import React from 'react';

const QuoteDetailsPopup = ({ quote, order, onClose, onSelectAgent }) => {
  if (!quote) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl w-full">
          <h2 className="text-xl font-bold mb-4">Quote Details</h2>
          
          {/* First Table: Order Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700">Order Details for <span className="text-blue-500">{order.orderNumber}</span> </h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                  {[
                  'Route', 'Shipment Ready Date', 'Delivery Term',
                  'Type', 'Number of Pallets', 'Pallet CBM',
                  'Cargo CBM', 'Gross Weight (Kg)', 'Target Date'
                ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                  {[
                  `${order.from} - ${order.to}`,
                  new Date(order.shipmentReadyDate).toISOString().split('T')[0],
                  order.deliveryTerm,
                  order.Type,
                  order.numberOfPallets,
                  order.palletCBM,
                  order.cargoCBM,
                  order.grossWeight,
                  new Date(order.targetDate).toISOString().split('T')[0]
                ].map((value, index) => (
                      <td
                        key={index}
                        className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap"
                      >
                        <span className="font-medium text-gray-900">{value}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Second Table: Freight Quote Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700">Freight Quote Details</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trans Shipment Port</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider ">Transit Time</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight / Vessel Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Freight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Freight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Validity Time</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transShipmentPort}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transitTime}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.vesselOrFlightDetails}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.netFreight}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.totalFreight}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(order.validityTime).toISOString().split('T')[0]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Select Agent Button */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            
          </div>
        </div>
      </div>
    );
  };

  export default QuoteDetailsPopup;