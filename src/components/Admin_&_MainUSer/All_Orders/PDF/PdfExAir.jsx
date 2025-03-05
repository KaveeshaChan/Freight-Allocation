import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiPrinter } from 'react-icons/fi';
import logo from '../../../../assests/CargoLogo.png';
import { format } from 'date-fns';

const PDFGenerator = ({ order, freightQuotes }) => {
  const formatCurrency = (value) => 
    `$${Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const formatDate = (dateString) => 
    dateString ? format(new Date(dateString), 'dd MMM yyyy') : 'N/A';

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
      doc.rect(margin, 47, pageWidth - margin * 2, 0.8, 'F');
      doc.setFillColor(secondaryColor);
      doc.rect(margin, 48.2, pageWidth - margin * 2, 0.8, 'F');

      let yPos = 57;

      // Order Summary Header
      doc.setFontSize(14);
      doc.setTextColor('#111827');
      doc.setFont(undefined, 'bold');
      doc.text(`ORDER SUMMARY: ${order.orderNumber || 'N/A'}`, margin, yPos);
      yPos += 12;

      // Two Column Layout
      const col1 = margin;
      const col2 = pageWidth / 2 + 10;
      const lineHeight = 6;

      // Shipment Details
      doc.setFontSize(10);
      doc.setTextColor('#374151');
      doc.setFont(undefined, 'bold');
      doc.text('SHIPMENT DETAILS:', col1, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`• Type: ${order.orderType || 'N/A'} ${order.shipmentType || 'N/A'}`, col1, yPos + lineHeight);
      doc.text(`• Route: ${order.from || 'N/A'} to ${order.to || 'N/A'}`, col1, yPos + lineHeight * 2);
      doc.text(`• Ready Date: ${formatDate(order.shipmentReadyDate)}`, col1, yPos + lineHeight * 3);
      doc.text(`• Target Date: ${formatDate(order.targetDate)}`, col1, yPos + lineHeight * 4);

      // Cargo Details
      doc.setFont(undefined, 'bold');
      doc.text('CARGO INFORMATION:', col2, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`• Type: ${order.cargoType || 'N/A'}`, col2, yPos + lineHeight);
      doc.text(`• Gross Weight: ${(order.grossWeight || 0).toLocaleString()} kg`, col2, yPos + lineHeight * 2);
      doc.text(`• Chargeable Weight: ${(order.chargeableWeight || 0).toLocaleString()} kg`, col2, yPos + lineHeight * 3);
      doc.text(`• CBM: ${(order.cargoCBM || 0).toLocaleString()}`, col2, yPos + lineHeight * 4);

      yPos += 45;

      // Freight Quotes Table
      if (freightQuotes?.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('FREIGHT QUOTE COMPARISON', margin, yPos);
        yPos += 8;

        const headers = [
          'Agent',
          'Carrier',
          'Transit Days',
          'Freight Cost',
          'AWB Fee',
          'Total',
          'Valid Until'
        ];

        const quotesData = freightQuotes.map(quote => ({
          agent: quote.Agent || 'N/A',
          carrier: quote.carrier || 'N/A',
          transit: quote.transitTime ? `${quote.transitTime} days` : 'N/A',
          freight: formatCurrency(quote.airFreightCost),
          awb: formatCurrency(quote.AWB),
          total: formatCurrency(quote.totalFreight),
          validity: formatDate(quote.validityTime)
        }));

        doc.autoTable({
          startY: yPos,
          margin: { left: margin, right: margin },
          head: [headers],
          body: quotesData.map(q => Object.values(q)),
          theme: 'grid',
          styles: {
            fontSize: 9,
            textColor: '#374151',
            lineColor: '#e5e7eb',
            lineWidth: 0.3,
            halign: 'center',
            cellPadding: 3
          },
          headStyles: {
            fillColor: primaryColor,
            textColor: '#ffffff',
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
          },
          bodyStyles: {
            alternateRowFill: true,
            rowFillColor: '#f8fafc'
          },
          columnStyles: {
            0: { cellWidth: 28, halign: 'left' },
            1: { cellWidth: 25 },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 22 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 }
          }
        });

        yPos = doc.lastAutoTable.finalY + 12;

        // Summary Box
        const lowestQuote = Math.min(...freightQuotes.map(q => q.totalFreight));
        doc.setFillColor('#f3f4f6');
        doc.setDrawColor(primaryColor);
        doc.roundedRect(
          margin,
          yPos,
          pageWidth - margin * 2,
          14,
          2,
          2,
          'FD'
        );
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('QUOTE SUMMARY:', margin + 5, yPos + 5);
        doc.setFont(undefined, 'bold');
        doc.setTextColor('#374151');
        doc.text(
          `• ${freightQuotes.length} quotes received.
• Lowest offer: ${formatCurrency(lowestQuote)}.`,
          margin + 40,
          yPos + 5
        );
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#9ca3af');
        doc.text(
          `Page ${i} of ${totalPages} • Confidential Document • Generated ${formatDate(new Date())} • © ${new Date().getFullYear()} CargoConnect`,
          margin,
          doc.internal.pageSize.getHeight() - 10
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