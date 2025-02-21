import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiPrinter } from 'react-icons/fi';

const PDFGenerator = ({ order, documentData, freightQuotes }) => {
  const printPDF = () => {
    const doc = new jsPDF();

    // Add order details
    doc.setFontSize(18);
    doc.text('Import - Air Freight', 14, 22);
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 14, 32);

    // Add order details table
    const orderDetails = [
      ['Route', `${order.from} - ${order.to}`],
      ['Shipment Ready Date', new Date(order.shipmentReadyDate).toISOString().split('T')[0]],
      ['Delivery Term', order.deliveryTerm],
      ['Type', order.Type],
      ['Cargo Type', order.cargoType],
      ['Pallets', order.numberOfPallets],
      ['Chargeable Weight (Kg)', order.chargeableWeight],
      ['Gross Weight', order.grossWeight],
      ['Cargo CBM', order.cargoCBM],
      ['L*W*H with the pallet', order.LWHWithThePallet],
      ['Target Date', new Date(order.targetDate).toISOString().split('T')[0]],
    ];

    doc.autoTable({
      startY: 40,
      head: [['Order Details', '']],
      body: orderDetails,
    });

    // Add additional notes
    if (order.additionalNotes) {
      doc.text('Additional Notes:', 14, doc.lastAutoTable.finalY + 10);
      doc.text(order.additionalNotes, 14, doc.lastAutoTable.finalY + 18);
    }

    // Add freight quotes table
    const freightQuotesData = freightQuotes.map((quote) => [
      `${quote.Agent} / ${quote.createdUser}`,
      quote.airFreightCost,
      quote.AWB,
      quote.carrier,
      quote.transitTime,
      quote.vesselOrFlightDetails,
      quote.totalFreight,
      new Date(quote.validityTime).toISOString().split('T')[0],
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Agent / Created User', 'Air Freight Cost', 'AWB($)', 'Carrier', 'Transit Time', 'Flight/Vessel Details', 'Total Freight', 'Validity Time']],
      body: freightQuotesData,
    });

    // Print the PDF
    doc.autoPrint();
    window.open(doc.output('bloburl'));
  };

  return (
    <button
      onClick={printPDF}
      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
    >
      <FiPrinter className="text-xl" />
      Print PDF
    </button>
  );
};

export default PDFGenerator;