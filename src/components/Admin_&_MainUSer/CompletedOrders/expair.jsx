import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiInfo } from 'react-icons/fi';

const AirfreightExport = ({ order }) => {
  const [freightQuotes, setFreightQuotes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedOrderQuoteID, setSelectedOrderQuoteID] = useState('');

  useEffect(() => {
    const fetchFreightQuotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in again.');

        const response = await fetch(`http://localhost:5056/api/select/view-quotes/?orderNumber=${order.orderNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch freight quotes');
        }

        const data = await response.json();

        // Extract the 'quotes' array from the response object
        if (Array.isArray(data.quotes)) {
          setFreightQuotes(data.quotes);
          setSelectedOrderQuoteID(order.OrderQuoteID);
        } else {
          console.error("Unexpected API response format:", data);
          setFreightQuotes([]); // Fallback to prevent errors
        }
      } catch (error) {
        console.error('Error fetching freight quotes:', error);
        setFreightQuotes([]); // Ensure state remains an array
      }
    };

    fetchFreightQuotes();
  }, [order.orderNumber], [selectedOrderQuoteID]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedQuotes = React.useMemo(() => {
    let sortableQuotes = [...freightQuotes];
    if (sortConfig.key !== null) {
      sortableQuotes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableQuotes;
  }, [freightQuotes, sortConfig]);

  return (
    <div>
      <div className="bg-white rounded-lg p-6 max-w-8xl w-full mt">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">ORDER SUMMARY FOR - ({order.orderNumber}) - EXPORT/AIR FREIGHT</h1>
        
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

        {/* Additional Notes */}
        {order.additionalNotes && (
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FiInfo className="text-blue-600 flex-shrink-0" />
              <h4 className="font-semibold text-blue-800">Additional Notes</h4>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              {order.additionalNotes}
            </p>
          </div>
        )}

        {/* Second Table: Freight Quote Details */}
        <div className="bg-white rounded-xl shadow-sm border border-green-300 mt-4">
          <div className="p-4 border-b border-green-300 bg-green-300 rounded-t-xl">
            <h3 className="font-semibold text-gray-700">Selected Freight Quote Details</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Freight Agent Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Freight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">AWB($)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">HAWB($)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Air Line</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trans Shipment Port</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Transit Time</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight/Vessel Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Freight</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Validity Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.Freight_Agent}</td>
                <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.netFreight}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.AWB}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.HAWB}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.airLine}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transShipmentPort}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transitTime}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.vesselOrFlightDetails}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.totalFreight}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(order.validityTime).toISOString().split('T')[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Second Table: Freight Quote Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              Freight Quotes
            </h3>
          </div>
          <div className="overflow-x-auto h-[600px] px-4 pb-4">
            <table className="w-full">
              <thead className="bg-gray-100 mt-3 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Freight Agent Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('netFreight')}>
                    Net Freight {sortConfig.key === 'netFreight' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('AWB')}>
                    AWB($) {sortConfig.key === 'AWB' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('HAWB')}>
                    HAWB($) {sortConfig.key === 'HAWB' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Air Line</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trans Shipment Port</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('transitTime')}>
                    Transit Time {sortConfig.key === 'transitTime' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight/Vessel Details</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('totalFreight')}>
                    Total Freight {sortConfig.key === 'totalFreight' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('validityTime')}>
                    Validity Time {sortConfig.key === 'validityTime' ? (sortConfig.direction === 'ascending' ? <FiArrowUp /> : <FiArrowDown />) : null}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedQuotes
                .filter(quote => quote.OrderQuoteID !== selectedOrderQuoteID)
                .map((quote, index) => (
                  <tr key={index} className="cursor-pointer hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-left overflow-x-auto max-w-[250px] text-gray-700 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{quote.Agent}</span>
                      <span className="block text-gray-500">{quote.createdUser}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.netFreight}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.AWB}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.HAWB}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.airLine}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.transShipmentPort}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.transitTime}</td>
                    <td className="px-4 py-3 text-sm overflow-x-auto max-w-[200px] text-left text-gray-700 whitespace-nowrap">{quote.vesselOrFlightDetails}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{quote.totalFreight}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(quote.validityTime).toISOString().split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirfreightExport;