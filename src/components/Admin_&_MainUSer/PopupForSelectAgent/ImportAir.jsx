import React, { useState } from 'react';

const QuoteDetailsPopup = ({ quote, order, onClose, onSelectAgent }) => {
  const [isLoading, setIsLoading] = useState(false);
  
    const handleSelectAgent = async () => {
      setIsLoading(true);
      await onSelectAgent();
      setIsLoading(false);
    };

  if (!quote) return null;
  
    return (
      <div className="fixed -inset-8 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl w-full">
          <h2 className="text-xl font-bold mb-4">Quote Details</h2>
          
          {/* First Table: Order Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700">Order Details</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Route', 'Shipment Ready Date', 'Delivery Term',
                      'Type', 'Cargo Type', 'Number of Pallets',
                      'Chargeable Weight (Kg)', 'Gross Weight (Kg)',
                      'Cargo CBM', 'Target Date'
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
                      order.cargoType,
                      order.numberOfPallets,
                      order.chargeableWeight,
                      order.grossWeight,
                      order.cargoCBM,
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
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Freight Agent Details</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Air Freight Cost</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">AWB($)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrier</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Transit Time</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight Details</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Freight</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Validity Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{quote.Agent}</span>
                      <span className="block text-gray-500">{quote.createdUser}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.airFreightCost}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.AWB}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.carrier}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.transitTime}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.vesselOrFlightDetails}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.totalFreight}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(quote.validityTime).toISOString().split('T')[0]}</td>
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
            <button
            onClick={handleSelectAgent}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
            ) : (
              'Select This Agent'
            )}
          </button>
          </div>
        </div>
      </div>
    );
  };

  export default QuoteDetailsPopup;