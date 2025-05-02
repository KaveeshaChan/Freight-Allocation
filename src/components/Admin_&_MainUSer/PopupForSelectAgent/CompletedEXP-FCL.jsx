import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteDetailsPopup = ({ quote, order, onClose, onSelectAgent }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({ ...order });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (showEditDialog && order) {
      setFormData({
        netFreight: order.netFreight,
        DTHC: order.DTHC,
        freeTime: order.freeTime,
        transShipmentPort: order.transShipmentPort,
        carrier: order.carrier,
        transitTime: order.transitTime,
        vesselOrFlightDetails: order.vesselOrFlightDetails,
        validityTime: order.validityTime?.split('T')[0],
      });
    }
  }, [showEditDialog, order]);

  const handleSave = async () => {
    const payload = {
      orderNumber: order.orderNumber,
      OrderQuoteID: order.OrderQuoteID,
      ...formData,
      validityTime: formData.validityTime
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    return;
    }
  
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5056/api/update/update-preQuotes/export-fcl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Network response was not ok")
        setShowErrorPopup(true)
      }
      
      await response.json();
      setShowSuccessPopup(true);
      setIsLoading(false)
      handleDialogClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!quote) return null;

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleDialogClose = () => {
    setShowEditDialog(false);
  };
  
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
                  'Type', 'No. of Containers', 'Target Date'
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
                        order.numberOfContainers || 'N/A'   ,
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
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">DTHC($)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Free Time</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trans Shipment Port</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrier</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Transit Time</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Flight / Vessel Details</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Freight</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Validity Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.DTHC}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.freeTime}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transShipmentPort}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.carrier}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.transitTime}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.vesselOrFlightDetails}</td>
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{order.netFreight}</td> 
                    <td className="px-4 py-3.5 text-sm text-center text-gray-700 whitespace-nowrap">{new Date(order.validityTime).toISOString().split('T')[0]}</td>               
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Select Agent Button */}
          <div className="mt-6 flex justify-end gap-4">
          <button
              onClick={handleEditClick}
              className="flex bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 24 20"><path fill="none" stroke="#fff" stroke-width="2" d="m14 4l6 6zm8.294 1.294c.39.39.387 1.025-.008 1.42L9 20l-7 2l2-7L17.286 1.714a1 1 0 0 1 1.42-.008zM3 19l2 2m2-4l8-8"/></svg>
              Edit quotation
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            
          </div>
        </div>
        {showEditDialog && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
              <div className='flex justify-between'>
                <h2 className="text-lg font-bold mb-4">Edit Quotation</h2>
                <h2 className="text-md text-blue-500 font-bold mb-4">{order.orderNumber}</h2>
              </div>
              <div className='flex justify-between flex-wrap gap-4 p-4'>
                <div className="mb-4 ">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Freight</label>
                  <input name="netFreight" type="text" defaultValue={order.netFreight} value={formData.netFreight || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">DTHC ($)</label>
                  <input name='DTHC' type="text" defaultValue={order.DTHC} value={formData.DTHC || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Time</label>
                  <input name='freeTime' type="text" defaultValue={order.freeTime} value={formData.freeTime || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transhipment Port</label>
                  <input name='transShipmentPort' type="text" defaultValue={order.transShipmentPort} value={formData.transShipmentPort || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                  <input name='carrier' type="text" defaultValue={order.carrier} value={formData.carrier || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transit Time</label>
                  <input name='transitTime' type="text" defaultValue={order.transitTime} value={formData.transitTime || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vessel / Flight Details</label>
                  <input name='vesselOrFlightDetails' type="text" defaultValue={order.vesselOrFlightDetails} value={formData.vesselOrFlightDetails || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity Date
                  </label>
                  <input
                    type="date"
                    name='validityTime'
                    value={formData.validityTime ? formData.validityTime.split('T')[0] : ''}
                    onChange={handleChange}
                    className="w-[220px] border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={handleDialogClose} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                {/* <button onClick={fgb} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button> */}
                <button
                  onClick={handleSave}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
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
            <p className="text-[#2C2C2C]/90 text-center mb-1">Quotation updated successfully!</p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/user-dashboard');
                window.location.reload();
              }}
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

  export default QuoteDetailsPopup;