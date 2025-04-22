import React, { useState, useEffect } from 'react';
import { FiDownload, FiPlusCircle, FiInfo, FiTrash2, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/fileDownloadHandler';

const ExportFCL = ({ order }) => {
  const [hasDocument, setHasDocument] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueClick = () => {
    setShowSuccessPopup(false);
    navigate('/user-dashboard');
  };

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://192.168.100.20:5056/api/select/view-orders/documentData", {
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

        if (data.documentData) {
          const decodedData = JSON.parse(atob(data.documentData));
          setDocumentData(decodedData);
          setDocumentName(data.documentName);
          setHasDocument(true);
          // exportToExcel(decodedData, data.documentName);
        } else {
          alert("No data available to export.");
          setHasDocument(false);
        }

        // setAvailableOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setHasDocument(false);
      }
    };
    fetchDocumentData();
  }, []);

  const handleDownload = () => {
    if (documentData && documentName) {
      exportToExcel(documentData, documentName);
    }
  };

  const initialQuotation = {
    netFreight: '',
    DTHC: '',
    freeTime: '',
    transShipmentPort: '',
    carrier: '',
    transitTime: '',
    vesselOrFlightDetails: '',
    validityTime: '',
  };

  const [currentQuotation, setCurrentQuotation] = useState(initialQuotation);
  const [savedQuotations, setSavedQuotations] = useState([]);
  const navigate = useNavigate();

  const handleAddQuotation = () => {
    const isEmptyField = Object.values(currentQuotation).some(value => value.trim() === '');
    if (isEmptyField) {
      alert('Please fill all fields before adding a quotation');
      return;
    }
    setSavedQuotations([...savedQuotations, { ...currentQuotation, id: Date.now() }]);
    setCurrentQuotation(initialQuotation);
  };

  const removeQuotation = (id) => {
    setSavedQuotations(savedQuotations.filter(q => q.id !== id));
  };

  const handleSubmit = async () => {
    if (savedQuotations.length === 0) {
      alert('Please add at least one quotation before submitting');
      return;
    }

    const payload = savedQuotations.map(quotation => ({
      orderNumber: order.orderNumber,
      netFreight: quotation.netFreight,
      DTHC: quotation.DTHC,
      freeTime: quotation.freeTime,
      transShipmentPort: quotation.transShipmentPort,
      carrier: quotation.carrier,
      transitTime: quotation.transitTime,
      vesselOrFlightDetails: quotation.vesselOrFlightDetails,
      validityTime: quotation.validityTime,
    }));

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.100.20:5056/api/orderHandling/add-quoatation/export-fcl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
    setShowSuccessPopup(true);
    setIsLoading(false);
  } catch (error) {
    console.error('Error submitting quotes:', error);
    alert(error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Enforce integer-only input for transitTime field
    if (name === 'transitTime' && !/^\d*$/.test(value)) {
      alert('Transit Time should only contain integers');
      return;
    }

    setCurrentQuotation(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">
                🚢
              </span>
              Export - FCL
            </h2>
            <p className="text-m text-gray-500 mt-4">
              Order Number: {order.orderNumber}
            </p>
          </div>
        </div>
        {hasDocument && (
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
          >
            <FiDownload className="text-xl" />
            Download Documents
          </button>
        )}
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
                  'Type', 'Containers', 'Target Date'
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
                  order.numberOfContainers,
                  new Date(order.targetDate).toISOString().split('T')[0]
                ].map((value, index) => (
                  <td
                    key={index}
                    className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap"
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

      {/* Add Quotation Form */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FiPlusCircle className="text-blue-600" />
            Add New Quotation
          </h3>
        </div>
        <div className="p-6">
        <p className="mb-6 text-gray-500 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            Note: Enter ‘0’ for DTHC if it’s already included in Net Freight or not applicable, and for Free Time if the shipment has "Standard free time" or "No free time".
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Net Freight ($)', name: 'netFreight', type: 'number' },
              { label: 'DTHC ($) ', name: 'DTHC', type: 'number' },
              { label: 'Free Time', name: 'freeTime' },
              { label: 'Transshipment Port', name: 'transShipmentPort' },
              { label: 'Carrier', name: 'carrier' },
              { label: 'Transit Time', name: 'transitTime', placeholder: 'Number of days' },
              { label: 'Vessel Or Flight Details', name: 'vesselOrFlightDetails' },
              { label: 'Validity Date', name: 'validityTime', type: 'date' },
            ].map((field, index) => (
              <InputField
                key={index}
                label={field.label}
                placeholder={field.placeholder || `Enter ${field.label}`}
                type={field.type || 'text'}
                name={field.name}
                value={currentQuotation[field.name]}
                onChange={handleInputChange}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleAddQuotation}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
            >
              <FiPlusCircle className="text-xl" />
              Add Quotation
            </button>
          </div>
        </div>
      </section>

      {/* Saved Quotations */}
      {savedQuotations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FiSave className="text-blue-600" />
              Saved Quotations ({savedQuotations.length})
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Net Freight (USD)', 'DTHC (USD)', 'Free Time',
                      'Transshipment Port', 'Carrier', 'Transit Time', 
                      'Vessel Or Flight Details', 'Validity Date'
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {savedQuotations.map((quotation) => (
                    <tr key={quotation.id} className="hover:bg-gray-50 transition-colors">
                      {[
                        quotation.netFreight,
                        quotation.DTHC,
                        quotation.freeTime,
                        quotation.transShipmentPort,
                        quotation.carrier,
                        quotation.transitTime,
                        quotation.vesselOrFlightDetails,
                        quotation.validityTime,
                      ].map((value, index) => (
                        <td
                          key={index}
                          className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                        >
                          <span className="font-medium text-gray-900">
                            {value || '-'}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        <button
                          onClick={() => removeQuotation(quotation.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete quotation"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end gap-4">
          <button
              type='submit'
              onClick={handleSubmit}
              disabled={isLoading || savedQuotations.length === 0}
              className={` py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white font-semibold 
                        hover:from-[#5F72F3] hover:to-[#C057CB] transition-all duration-300 
                        disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${savedQuotations.length === 0 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'}`}
              >
                <span className='relative z-10'>
                  {isLoading ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <FiSave className="text-xl" />
                    <span>Submit All Quotes</span>
                  </span>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>


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
              <h3 className="text-2xl font-semibold text-[#2C2C2C] mr-2">&nbsp;Hooray!</h3>
            </div>
            <p className="text-[#2C2C2C]/90 text-center mb-1">Your quotes have been successfully submitted.</p>
            
            <button
              onClick={() => handleContinueClick()}
              className=" mt-4 w-full py-2 px-4 bg-[#38B000] hover:bg-[#38B000]/90 text-white rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};



const InputField = ({ label, placeholder, type = 'text', name, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
      required
    />
  </div>
);

export default ExportFCL;