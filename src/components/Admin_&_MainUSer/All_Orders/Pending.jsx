import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layouts/Main_Layout';
import { FiSearch, FiPlusCircle, FiRefreshCw, FiClock, FiX, FiBox, FiTruck, FiAnchor, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const closeErrorPopup = () => { setShowErrorPopup(false) };
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const closeSuccessPopup = () => { setShowSuccessPopup(false) };
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const status = "pending"

  const fetchAvailableOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }

      const response = await fetch(`http://localhost:5056/api/select/view-orders/exporter?status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAvailableOrders(data.orders || []);
    } catch (error) {
      setErrorMessage('Error fetching orders:', error);
      setShowErrorPopup(true)
    }
  };

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const handlePendingOrder = async (OrderID) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5056/api/update/order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Ensure token is included
        },
        body: JSON.stringify({
          OrderID: OrderID,
          status: "pending"
        })
      });

      if (!response.ok)
        throw new Error('Failed to mark as pending');
      await fetchAvailableOrders();
      closePopup();
      setSuccessMessage("Order added to the pending orders list.")
      setShowSuccessPopup(true);
    } catch (error) {
      setErrorMessage('Error marking as pending:', error);
      setShowErrorPopup(true)
    }
  };

  const handleCancelOrder = async (order, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5056/api/orders/${order.orderNumber}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Failed to cancel order');
      await fetchAvailableOrders();
      closePopup();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = availableOrders.filter(order => {
    const matchesSearch = order.orderNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrderType = orderType ? order.orderType.toLowerCase() === orderType.toLowerCase() : true;
    const matchesShipmentType = shipmentType ? order.shipmentType.toLowerCase() === shipmentType.toLowerCase() : true;

    return matchesSearch && matchesOrderType && matchesShipmentType;
  }).sort((b, a) => new Date(b.targetDate) - new Date(a.targetDate));

  const clearFilters = () => {
    setSearchTerm('');
    setOrderType('');
    setShipmentType('');
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setSelectedOrder(null);
  };

  const renderOrderDetails = (order) => {
    const Section = ({ title, icon, children }) => (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-semibold text-lg text-blue-600">{title}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    );

    const DetailItem = ({ label, value, icon }) => (
      <div className="flex justify-between items-center p-2 bg-white rounded-lg hover:bg-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-gray-700 font-medium">{value}</span>
      </div>
    );

    return (
      <div className="space-y-6">
        <Section title="Basic Info" icon={<FiBox className="text-blue-500" />}>
          <DetailItem
            label="Order Number"
            value={`#${order.orderNumber}`}
            icon={<FiPackage className="text-sm" />}
          />
          <DetailItem
            label="Order Type"
            value={order.orderType}
            icon={<FiTruck className="text-sm" />}
          />
          <DetailItem
            label="Shipment Type"
            value={order.shipmentType}
            icon={<FiAnchor className="text-sm" />}
          />
        </Section>

        <Section title="Route Details" icon={<FiMapPin className="text-green-500" />}>
          <DetailItem
            label="Route"
            value={`${order.from} → ${order.to}`}
            icon={<FiTruck className="text-sm" />}
          />
          <DetailItem
            label="Shipment Ready Date"
            value={new Date(order.shipmentReadyDate).toLocaleDateString()}
            icon={<FiCalendar className="text-sm" />}
          />
          <DetailItem
            label="Target Date"
            value={new Date(order.targetDate).toLocaleDateString()}
            icon={<FiCalendar className="text-sm" />}
          />
        </Section>

        {order.shipmentType === 'airFreight' && (
          <Section title="Cargo Details" icon={<FiPackage className="text-purple-500" />}>
            <DetailItem label="Cargo Type" value={order.cargoType} />
            <DetailItem label="Gross Weight" value={`${order.grossWeight} kg`} />
            <DetailItem label="Chargeable Weight" value={`${order.chargeableWeight} kg`} />
            <DetailItem label="Cargo CBM" value={order.cargoCBM} />
          </Section>
        )}

        {order.shipmentType === 'fcl' && (
          <Section title="Container Details" icon={<FiAnchor className="text-teal-500" />}>
            <DetailItem label="Containers" value={order.numberOfContainers} />
            <DetailItem label="Container Type" value={order.containerType} />
          </Section>
        )}
      </div>
    );
  };

  const handleSelectAgent = (order) => {
    navigate('/Summary', { state: { order } });
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="mt-6">
        <div className="container mx-auto p-6">
          <div className="rounded-xl mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {/* Left Section - Heading */}
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Pending Orders
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                  {filteredOrders.length} orders found
                </p>
              </div>

              {/* Right Section - Filters */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-grow max-w-4xl">
                {/* Search Input */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400 text-lg" />
                </div>

                {/* Filters Group */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <select
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Export">Export</option>
                    <option value="Import">Import</option>
                  </select>

                  <select
                    className="px- py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                    value={shipmentType}
                    onChange={(e) => setShipmentType(e.target.value)}
                  >
                    <option value="">All Shipments</option>
                    <option value="airFreight">Air Freight</option>
                    <option value="LCL">LCL</option>
                    <option value="FCL">FCL</option>
                  </select>

                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 whitespace-nowrap"
                  >
                    <FiRefreshCw className="shrink-0" />
                    
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Table Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="relative max-h-[600px]">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm font-semibold text-gray-600 text-center">
                      <th className="py-5 px-4 w-[16%]">Order Number</th>
                      <th className="py-5 px-4 w-[16%]">Type</th>
                      <th className="py-5 px-4 w-[16%]">Shipment</th>
                      <th className="py-5 px-4 w-[16%]">ETA to Client Destination</th>
                      <th className="py-5 px-4 w-[16%]">Number of Quotes</th>
                      <th className="py-5 px-4 w-[16%]">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors even:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(order)}>
                        <td className="py-5 px-4 font-medium text-gray-800 w-[16%] text-center">{order.orderNumber}</td>
                        <td className="py-5 px-4 w-[16%] text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
                            ${order.orderType === 'export' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="py-5 px-4 w-[16%] text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                            ${order.shipmentType === 'airFreight' ? 'bg-purple-100 text-purple-700' :
                              order.shipmentType === 'lcl' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {order.shipmentType}
                          </span>
                        </td>
                        <td className="py-5 px-4 w-[16%] text-center">
                          
                            <span className="font-medium text-gray-800">{new Date(order.targetDate).toISOString().split('T')[0]}</span>
                          
                        </td>
                        <td className="py-5 px-4 font-medium text-gray-800 w-[16%] text-center">{order.quotationCount}</td>
                        <td className="py-5 px-4 w-[16%] text-center items-center">
                          <button
                            onClick={() => handleSelectAgent(order)}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                          >
                            Select Agent
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-300 mb-4 text-6xl">📭</div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No orders found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
              <button onClick={closePopup} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-2xl" />
              </button>
            </div>

            {renderOrderDetails(selectedOrder)}

          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
    <div className="bg-red-100 p-6 rounded-lg shadow-lg w-96 text-center">
      
      {/* Red Cross Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-red-500 rounded-full">
          <span className="text-white text-3xl font-bold">✖</span>
        </div>
      </div>

      {/* Error Title */}
      <h2 className="text-xl font-semibold my-3 text-gray-800">Oops</h2>

      {/* Error Message */}
      <p className="text-gray-700 text-sm">{errorMessage || "Something went wrong. Let’s try one more time."}</p>

      {/* Try Again Button */}
      <button
        onClick={closeErrorPopup}
        className="mt-4 p-2 w-full rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
      >
        TRY AGAIN
          </button>
        </div>
      </div>
)}

      {/* Success Popup */}
      {showSuccessPopup && (
  <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
    <div className="bg-green-100 p-6 rounded-lg shadow-lg w-96 text-center">
      
      {/* Green Checkmark Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full">
          <span className="text-white text-3xl font-bold">✔</span>
        </div>
      </div>

      {/* Success Title */}
      <h2 className="text-xl font-semibold my-3 text-gray-800">Success</h2>

      {/* Success Message */}
      <p className="text-gray-700 text-sm">
        {successMessage}
      </p>

      {/* Close Button */}
      <button
        onClick={closeSuccessPopup}
        className="mt-4 p-2 w-full rounded-md bg-green-500 text-white font-semibold hover:bg-green-600"
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;