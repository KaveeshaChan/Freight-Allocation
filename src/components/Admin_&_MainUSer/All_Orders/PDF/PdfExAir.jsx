import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiPrinter } from 'react-icons/fi';
import logo from '../../../../assests/CargoLogo.png';

const PDFGenerator = ({ order, freightQuotes }) => {
  const printPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const margin = 15; // Page margins in mm

    // Set default styles
    doc.setFont('helvetica');
    doc.setLineHeightFactor(1.5);

    // Add header with logo and title
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      doc.addImage(img, 'PNG', margin, 10, 10, 10);
      doc.setFontSize(24);
      doc.setTextColor('#0534F0');
      doc.setFont(undefined, 'bold');
      doc.text('CargoConnect', margin + 15, 18);
      
      // Add gradient separator
      const gradientHeight = 2;
      for (let i = 0; i <= pageWidth; i++) {
        const color = interpolateColor('#0534F0', '#98009E', i / pageWidth);
        doc.setFillColor(color);
        doc.rect(i, 25, 1, gradientHeight, 'F');
      }

      // Main content container
      let yPos = 35;

      // Order Overview
      doc.setFontSize(18);
      doc.setTextColor('#111827');
      doc.text(`${order.orderType} - ${order.shipmentType}`, margin, yPos);
      
      // Order Details Table
      const orderDetails = [
        ['Order Number:', order.orderNumber || 'N/A'],
        ['Route:', `${order.from || ''} - ${order.to || ''}`],
        ['Shipment Date:', order.shipmentReadyDate ? new Date(order.shipmentReadyDate).toLocaleDateString() : 'N/A'],
        ['Delivery Term:', order.deliveryTerm || 'N/A'],
        ['Cargo Type:', order.cargoType || 'N/A'],
        ['Chargeable Weight:', order.chargeableWeight ? `${order.chargeableWeight} Kg` : 'N/A'],
        ['Gross Weight:', order.grossWeight || 'N/A'],
        ['Cargo CBM:', order.cargoCBM || 'N/A'],
        ['Target Date:', order.targetDate ? new Date(order.targetDate).toLocaleDateString() : 'N/A']
      ];

      doc.autoTable({
        startY: yPos + 5,
        margin: { left: margin, right: margin },
        head: [['Order Details', '']],
        body: orderDetails,
        theme: 'plain',
        styles: {
          fontSize: 11,
          textColor: '#374151',
          lineColor: '#e5e7eb',
          lineWidth: 0.25
        },
        headStyles: {
          fillColor: '#ffffff',
          textColor: '#0534F0',
          fontSize: 12,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold', textColor: '#111827' },
          1: { cellWidth: 'auto' }
        }
      });
      yPos = doc.lastAutoTable.finalY + 10;

      // Additional Notes
      if (order.additionalNotes) {
        doc.setFontSize(12);
        doc.setTextColor('#0534F0');
        doc.setFont(undefined, 'bold');
        doc.text('Additional Notes:', margin, yPos);
        
        doc.setFontSize(11);
        doc.setTextColor('#374151');
        doc.setFont(undefined, 'normal');
        const splitNotes = doc.splitTextToSize(order.additionalNotes, pageWidth - (margin * 2));
        doc.text(splitNotes, margin, yPos + 8);
        yPos += splitNotes.length * 6 + 15;
      }

      // Freight Quotes Table
      if (freightQuotes?.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor('#111827');
        doc.setFont(undefined, 'bold');
        doc.text('Freight Quotes', margin, yPos);
        
        const quotesData = freightQuotes.map(quote => [
          
          quote.Agent || 'N/A',
          quote.airFreightCost || 'N/A',
          quote.AWB || 'N/A',
          quote.carrier || 'N/A',
          quote.transitTime || 'N/A',
          quote.vesselOrFlightDetails || 'N/A',
          `$${quote.totalFreight || '0.00'}`,
          quote.validityTime ? new Date(quote.validityTime).toLocaleDateString() : 'N/A'
        ]);

        doc.autoTable({
          startY: yPos + 5,
          margin: { left: margin, right: margin },
          head: [['Freight Agent', 'Air Freight Cost', 'AWB ($)', 'Carrier', 'Transit Time', 'Flight Details', 'Total Freight ($)', 'Valid Until']],
          body: quotesData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            textColor: '#374151',
            lineColor: '#e5e7eb',
            lineWidth: 0.25,
            halign: 'center' // Align text to center
          },
          headStyles: {
            fillColor: '#0534F0',
            textColor: '#ffffff',
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center' // Align text to center in header
          },
          columnStyles: {
            0: { cellWidth: 35, halign: 'center' },
            1: { cellWidth: 15, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 20, halign: 'center' },
            4: { cellWidth: 15, halign: 'center' },
            5: { cellWidth: 20, cellPadding: 2, halign: 'center' },
            6: { cellWidth: 20, halign: 'center' },
            7: { cellWidth: 25, halign: 'center' }
          },
          pageBreak: 'auto'
        });
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for(let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#9ca3af');
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      doc.autoPrint({ variant: 'non-conform' });
      window.open(doc.output('bloburl'));
    };
  };

  const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice(1).match(/.{2}/g)
      .map((hex, idx) => {
        const color1Component = parseInt(hex, 16);
        const color2Component = parseInt(color2.slice(1).match(/.{2}/g)[idx], 16);
        const resultComponent = Math.round(color1Component + factor * (color2Component - color1Component));
        return ('0' + resultComponent.toString(16)).slice(-2);
      }).join('');
    return `#${result}`;
  };

  return (
    <button
      onClick={printPDF}
      className="flex items-center gap-3 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:from-[#0534F0]/90 hover:to-[#98009E]/90 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg group"
    >
      <FiPrinter className="text-xl transition-transform group-hover:scale-110" />
      <span className="font-medium">Generate Professional Report</span>
    </button>
  );
};

export default PDFGenerator;