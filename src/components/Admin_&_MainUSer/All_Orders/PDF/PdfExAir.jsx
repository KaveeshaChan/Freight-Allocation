import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiPrinter } from 'react-icons/fi';
import logo from '../../../../assests/CargoLogo.png';

const PDFGenerator = ({ order, freightQuotes }) => {
  const printPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const primaryColor = '#0534F0';
    const secondaryColor = '#98009E';

    // Set professional font
    doc.setFont('helvetica');
    doc.setLineHeightFactor(1.3);

    // Header Section
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      // Company Header
      doc.addImage(img, 'PNG', margin, 15, 20, 20);
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.setFont(undefined, 'bold');
      doc.text('CARGO CONNECT', margin + 25, 25);
      doc.setFontSize(10);
      doc.setTextColor('#6b7280');
      doc.text('Basilur Tea Exports (PVT) Ltd.', margin + 25, 30);
      doc.text('143/6, Weediyabandara Mawatha, Kelanimulla Angoda. Sri Lanka', margin + 25, 35);
      doc.text('Tel: +94 11 2 549 500    • www.basilurtea.com', margin + 25, 40);

      // Decorative line
      doc.setFillColor(primaryColor);
      doc.rect(margin, 45, pageWidth - margin * 2, 0.5, 'F');
      doc.setFillColor(secondaryColor);
      doc.rect(margin, 46, pageWidth - margin * 2, 0.5, 'F');

      let yPos = 55;

      // Order Summary
      doc.setFontSize(14);
      doc.setTextColor('#111827');
      doc.setFont(undefined, 'bold');
      doc.text(`ORDER SUMMARY: ${order.orderNumber}`, margin, yPos);
      yPos += 10;

      // Two Column Layout
      const firstColumn = margin;
      const secondColumn = pageWidth / 2;

      // Left Column - Order Details
      doc.setFontSize(10);
      doc.setTextColor('#374151');
      doc.setFont(undefined, 'bold');
      doc.text('SHIPMENT DETAILS:', firstColumn, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`• Type: ${order.orderType} - ${order.shipmentType}`, firstColumn, yPos + 5);
      doc.text(`• Route: ${order.from} → ${order.to}`, firstColumn, yPos + 10);
      doc.text(`• Ready Date: ${new Date(order.shipmentReadyDate).toLocaleDateString()}`, firstColumn, yPos + 15);
      doc.text(`• Target Date: ${new Date(order.targetDate).toLocaleDateString()}`, firstColumn, yPos + 20);

      // Right Column - Cargo Details
      doc.text('CARGO INFORMATION:', secondColumn, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`• Type: ${order.cargoType}`, secondColumn, yPos + 5);
      doc.text(`• Gross Weight: ${order.grossWeight} kg`, secondColumn, yPos + 10);
      doc.text(`• Chargeable Weight: ${order.chargeableWeight} kg`, secondColumn, yPos + 15);
      doc.text(`• CBM: ${order.cargoCBM}`, secondColumn, yPos + 20);

      yPos += 30;

      // Freight Quotes Table
      if (freightQuotes?.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('FREIGHT QUOTE COMPARISON', margin, yPos);
        yPos += 7;

        const headers = [
          'Agent',
          'Carrier',
          'Transit Time',
          'Freight Cost',
          'AWB Fee',
          'Total',
          'Validity'
        ];

        const quotesData = freightQuotes.map(quote => ({
          agent: quote.Agent || 'N/A',
          carrier: quote.carrier || 'N/A',
          transit: quote.transitTime || 'N/A',
          freight: `$${Number(quote.airFreightCost).toFixed(2)}`,
          awb: `$${Number(quote.AWB).toFixed(2)}`,
          total: `$${Number(quote.totalFreight).toFixed(2)}`,
          validity: quote.validityTime ? new Date(quote.validityTime).toLocaleDateString() : 'N/A'
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
            lineWidth: 0.25,
            halign: 'center'
          },
          headStyles: {
            fillColor: primaryColor,
            textColor: '#ffffff',
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 25, halign: 'left' },
            1: { cellWidth: 25 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 25 }
          }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Summary Box
        const lowestQuote = Math.min(...freightQuotes.map(q => q.totalFreight));
        doc.setFillColor('#f3f4f6');
        doc.roundedRect(
          margin,
          yPos,
          pageWidth - margin * 2,
          15,
          2,
          2,
          'F'
        );
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.setFont(undefined, 'bold');
        doc.text('QUOTE SUMMARY:', margin + 5, yPos + 5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor('#374151');
        doc.text(
          `• ${freightQuotes.length} quotes received | Lowest offer: $${lowestQuote.toFixed(2)}`,
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
          `Page ${i} of ${totalPages} • Confidential Document • © ${new Date().getFullYear()} CargoConnect`,
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
      className="flex items-center gap-3 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-opacity shadow-lg"
    >
      <FiPrinter className="text-xl shrink-0" />
      <div className="text-left">
        <p className="font-semibold text-sm">Generate Professional Report</p>
        
      </div>
    </button>
  );
};

export default PDFGenerator;