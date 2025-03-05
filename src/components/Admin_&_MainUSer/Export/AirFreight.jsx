import React, { useState, useEffect } from 'react';
import { FiDownload, FiInfo, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../../Freight_Forwarders/utils/fileDownloadHandler';
import PDFGenerator from '../All_Orders/PDF/PdfExAir'; // Import the PDFGenerator component
import QuoteDetailsPopup from '../PopupForSelectAgent/ExportAir';

const ExportAirFreight = ({ order }) => {
  const [hasDocument, setHasDocument] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [freightQuotes, setFreightQuotes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRowSelect = (quote) => {
    setSelectedQuote(quote);
    setIsPopupVisible(true);
  };

  const handleSelectAgent = async () => {
    if (!selectedQuote) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch("http://localhost:5056/api/orderhandling/select-best-quote/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          OrderQuoteID: selectedQuote.OrderQuoteID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to select agent');
        setShowErrorPopup(true);
        return;
      }

      setShowSuccessPopup(true);
      setIsPopupVisible(false);
    } catch (error) {
      setErrorMessage('Error: ' + error.message);
      setShowErrorPopup(true);
    }
  };

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in again.');

        const response = await fetch("http://localhost:5056/api/select/view-orders/documentData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderNumber: order.orderNumber })
        });

        if (response.status === 404) {
          setHasDocument(false);
          return;
        }

        if (!response.ok) {
          alert("Request failed");
          return;
        }

        const data = await response.json();
        console.log(data);

        if (data.documentData) {
          const decodedData = JSON.parse(atob(data.documentData));
          setDocumentData(decodedData);
          setDocumentName(data.documentName);
          setHasDocument(true);
        } else {
          alert("No data available to export.");
          setHasDocument(false);
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setHasDocument(false);
      }
    };

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
        } else {
          console.error("Unexpected API response format:", data);
          setFreightQuotes([]); // Fallback to prevent errors
        }
      } catch (error) {
        console.error('Error fetching freight quotes:', error);
        setFreightQuotes([]); // Ensure state remains an array
      }
    };
    fetchDocumentData();
    fetchFreightQuotes();
  }, [order.orderNumber]);

  const handleDownload = () => {
    if (documentData && documentName) {
      exportToExcel(documentData, documentName);
    }
  };

  const cheapestQuote = freightQuotes.reduce((min, quote) => quote.totalFreight < min.totalFreight ? quote : min, freightQuotes[0] || { totalFreight: Infinity });

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">
                ✈️
              </span>
              Export - Air Freight
            </h2>
            <p className="text-m text-gray-500 mt-4">
              Order Number: {order.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          {hasDocument && (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
            >
              <FiDownload className="text-xl" />
              Download Documents
            </button>
          )}
          <PDFGenerator order={order} documentData={documentData} freightQuotes={freightQuotes} />
        </div>
      </header>

      {/* Order Details Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            Order Details
          </h3>
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

      {/* Freight Quotes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            Freight Quotes
          </h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
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
              {sortedQuotes.map((quote, index) => (
                <tr
                  key={index}
                  className={`${quote.totalFreight === cheapestQuote.totalFreight ? 'bg-green-100' : ''} cursor-pointer hover:bg-gray-50`}
                  onClick={() => handleRowSelect(quote)}
                >
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{quote.Agent}</span>
                    <span className="block text-gray-500">{quote.createdUser}</span>
                  </td>
                   <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.netFreight}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.AWB}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.HAWB}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.airLine}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.transShipmentPort}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.transitTime}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.vesselOrFlightDetails}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{quote.totalFreight}</td>
                  <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(quote.validityTime).toISOString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for Quote Details */}
      {isPopupVisible && (
        <QuoteDetailsPopup
          quote={selectedQuote}
          order={order} // Pass the order prop here
          onClose={() => setIsPopupVisible(false)}
          onSelectAgent={handleSelectAgent}
        />
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Validation Error</h3>
            </div>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-[#2C2C2C]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center mt-3 mb-8">
              <div className="bg-[#38B000]/10 p-2 rounded-full">
                <svg className="w-6 h-6 text-[#38B000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#2C2C2C] mr-2">&nbsp;Success!</h3>
            </div>
            <p className="text-[#2C2C2C]/90 text-center mb-1">Agent selected successfully!</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2 px-4 bg-[#38B000] hover:bg-[#38B000]/90 text-white rounded-lg transition-colors mt-4"
            >
              Continue
 </button>
          </div>
        </div>
      )}
</div>
  );
};

export default ExportAirFreight;
