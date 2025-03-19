import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';   // this extends the jsPDF instance
import { FiPrinter } from 'react-icons/fi';
import logo from '../../../../assests/CargoLogo.png';
import { format, isValid, parseISO } from 'date-fns';

const PDFGenerator = ({ order, freightQuotes }) => {
  const formatCurrency = (value) => 
    `$${Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A'; // Handle invalid inputs
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'dd MMM yyyy') : 'N/A'; // Format valid dates
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A'; // Fallback for any unexpected errors
    }
  };

  const printPDF = () => {
    if (!order || !freightQuotes) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const primaryColor = '#0534F0';
    const secondaryColor = '#98009E';
    
    doc.setFont('helvetica');
    doc.setLineHeightFactor(1.25);

    // Header Section
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      // Company Header
      doc.addImage(img, 'PNG', margin, 15, 25, 25);
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.setFont(undefined, 'bold');
      doc.text('CARGO CONNECT', margin + 30, 25);
      doc.setFontSize(9);
      doc.setTextColor('#6b7280');
      doc.text('Basilur Tea Exports (PVT) Ltd.', margin + 30, 31);
      doc.text('143/6, Weediyabandara Mawatha, Kelanimulla Angoda', margin + 30, 36);
      doc.text('Tel: +94 11 2 549 500 • www.basilurtea.com', margin + 30, 41);

      // Decorative line
      doc.setFillColor(primaryColor);
      doc.rect(margin, 47, pageWidth - margin * 2, 1, 'F');
      doc.setFillColor(secondaryColor);
      doc.rect(margin, 48.5, pageWidth - margin * 2, 0.5, 'F');

      let yPos = 57;

      // Order Summary Header
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.setFont(undefined, 'bold');
      doc.text(`ORDER SUMMARY: ${order.orderNumber || 'N/A'}`, margin, yPos);
      yPos += 12;

      // Two Column Layout
      const col1 = margin;
      const col2 = pageWidth / 2 + 10;
      const lineHeight = 6;

      // Section Styling
      const sectionHeader = (text, x, y) => {
        doc.setFillColor('#f8fafc');
        doc.rect(x - 2, y - 4, 50, 6, 'F');
        doc.setTextColor(primaryColor);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(text, x, y);
      };

      // Shipment Details
      sectionHeader('SHIPMENT DETAILS', col1, yPos);
      doc.setFont(undefined, 'normal');
      doc.setTextColor('#374151');
      doc.setFontSize(9);
      doc.text(`- Order Type: Export - AirFreight`, col1, yPos + lineHeight);
      doc.text(`- Route: ${order.from || 'N/A'} to ${order.to || 'N/A'}`, col1, yPos + lineHeight * 2);
      doc.text(`- Ready Date: ${formatDate(order.shipmentReadyDate)}`, col1, yPos + lineHeight * 3);
      doc.text(`- Target Date: ${formatDate(order.targetDate)}`, col1, yPos + lineHeight * 4);
      doc.text(`- Delivery Term: ${order.deliveryTerm || 'N/A'}`, col1, yPos + lineHeight * 5);
      doc.text(`- Shipment Type: ${order.Type || 'N/A'}`, col1, yPos + lineHeight * 6);

      // Cargo Details
      sectionHeader('CARGO INFORMATION', col2, yPos);
      doc.setFont(undefined, 'normal');
      doc.setTextColor('#374151');
      doc.setFontSize(9);
      doc.text(`- Cargo Type: ${order.cargoType || 'N/A'}`, col2, yPos + lineHeight);
      doc.text(`- Pallets: ${(order.numberOfPallets || 0).toLocaleString()}`, col2, yPos + lineHeight * 2);
      doc.text(`- Chargeable Weight: ${(order.chargeableWeight || 0).toLocaleString()} kg`, col2, yPos + lineHeight * 3);
      doc.text(`- Gross Weight: ${(order.grossWeight || 0).toLocaleString()} kg`, col2, yPos + lineHeight * 4);     
      doc.text(`- Cargo CBM: ${(order.cargoCBM || 0).toLocaleString()}`, col2, yPos + lineHeight * 5);
     

      yPos += 45;

      // Freight Quotes Table
      if (freightQuotes?.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('FREIGHT QUOTE COMPARISON', margin, yPos);
        yPos += 8;

        const headers = [
          { header: 'Agent', dataKey: 'agent' },
          { header: 'Net Freight ($)', dataKey: 'netFreight' },
          { header: 'AWB ($)', dataKey: 'AWB' },
          { header: 'HAWB ($)', dataKey: 'HAWB' },
          { header: 'Air Line', dataKey: 'AirLine' },
          { header: 'Transshipment', dataKey: 'transshipmentPort' },
          { header: 'Transit Time', dataKey: 'transit' },
          { header: 'Validity', dataKey: 'validity' },
          { header: 'Total', dataKey: 'total' }
        ];

        const quotesData = freightQuotes.map(quote => ({
          agent: quote.Agent || '-',
          netFreight: quote.netFreight,
          AWB: quote.AWB,
          HAWB: quote.HAWB,
          AirLine: quote.airLine || '-',
          transshipmentPort: quote.transShipmentPort || '-',
          transit: quote.transitTime ? `${quote.transitTime} days` : '-',
          validity: formatDate(quote.validityTime),
          total: formatCurrency(quote.totalFreight)
        }));

        doc.autoTable({
          startY: yPos,
          margin: { left: margin, right: margin },
          columns: headers,
          body: quotesData,
          theme: 'grid',
          styles: {
            fontSize: 7,
            textColor: '#374151',
            lineColor: '#e5e7eb',
            lineWidth: 0.3,
            cellPadding: 3,
            overflow: 'linebreak'
          },
          headerStyles: {
            fillColor: primaryColor,
            textColor: '#ffffff',
            fontSize: 7,
            fontStyle: 'normal',
            halign: 'center'
          },
          bodyStyles: {
            alternateRowFill: true,
            rowFillColor: '#f8fafc'
          },
          columnStyles: {
            0: { cellWidth: 24, halign: 'center' },
            1: { cellWidth: 18, halign: 'center' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 18, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' },
            5: { cellWidth: 22, halign: 'center' },
            6: { cellWidth: 18, halign: 'center' },
            7: { cellWidth: 20, halign: 'center' },
            8: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
          }
        });

        yPos = doc.lastAutoTable.finalY + 12;

        // Summary Box
        const lowestQuote = Math.min(...freightQuotes.map(q => q.totalFreight));
        doc.setFillColor('#f3f4f6');
        doc.setDrawColor(primaryColor);
        doc.rect(
          margin,
          yPos,
          pageWidth - margin * 2,
          14,
          'FD'
        );
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('QUOTE SUMMARY', margin + 5, yPos + 5);
        doc.setTextColor('#374151');
        doc.setFont(undefined, 'bold');
        doc.text(
          `• Received ${freightQuotes.length} quotes\n` +
          `• Lowest offer is ${formatCurrency(lowestQuote)}\n`,
          margin + 40,
          yPos + 5,
          { lineHeightFactor: 1.5 }
        );
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      const footerText = `Page %s of ${totalPages} • CargoConnect`;
      
      doc.setFontSize(8);
      doc.setTextColor('#9ca3af');
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(
          footerText.replace('%s', i),
          margin,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'left' }
        );
      }

      doc.autoPrint({ variant: 'non-conform' });
      window.open(doc.output('bloburl'));
    };
  };

  return (
    <button
      onClick={printPDF}
      disabled={!order || !freightQuotes}
      className="flex items-center gap-3 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiPrinter className="text-xl shrink-0" />
      <div className="text-left">
        <p className="font-semibold text-sm">Generate Professional Report</p>
        <p className="text-xs opacity-90">Includes detailed cost breakdown</p>
      </div>
    </button>
  );
};

export default PDFGenerator;