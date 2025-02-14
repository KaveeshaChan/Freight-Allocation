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
  const closeErrorPopup = () => {setShowErrorPopup(false)};
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const closeSuccessPopup = () => {setShowSuccessPopup(false)};
  const navigate = useNavigate();

  const fetchAvailableOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch("http://localhost:5056/api/select/view-orders/exporter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAvailableOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
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
    } catch (error) {
      console.error('Error marking as pending:', error);
      setShowSuccessPopup(true);
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
  });

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

        {order.shipmentType === 'FCL' && (
          <Section title="Container Details" icon={<FiAnchor className="text-teal-500" />}>
            <DetailItem label="Containers" value={order.numberOfContainers} />
            <DetailItem label="Container Type" value={order.containerType} />
          </Section>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-4">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              InProgess Orders
            </h1>
            <p className="text-gray-500 font-medium">{filteredOrders.length} orders found</p>
          </div>

          {/* Enhanced Filters Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FiSearch className="absolute left-3 top-4 text-gray-400 text-lg" />
              </div>

              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Export">Export</option>
                <option value="Import">Import</option>
              </select>

              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200"
              >
                <FiRefreshCw className="shrink-0" />
                <span className="truncate">Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Enhanced Table Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <tr className="text-left text-sm font-semibold text-gray-600">
                    <th className="py-5 px-6">Order Number</th>
                    <th className="py-5 px-6">Type</th>
                    <th className="py-5 px-6">Shipment</th>
                    <th className="py-5 px-6">Valid Days</th>
                    <th className="py-5 px-6 text-right">Number of Quotes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors even:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(order)}>
                      <td className="py-4 px-6 font-medium text-gray-800">#{order.orderNumber}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
                          ${order.orderType === 'Export' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                          ${order.shipmentType === 'airFreight' ? 'bg-purple-100 text-purple-700' :
                            order.shipmentType === 'LCL' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {order.shipmentType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{order.daysRemaining}</span>
                          <span className="text-sm text-gray-400">days</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-800">{order.quotationCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handlePendingOrder(selectedOrder.OrderID)}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiClock className="shrink-0" />
                <span>Mark as Pending</span>
              </button>

              {showCancelReason ? (
                <div className="flex flex-col gap-3 flex-grow">
                  <textarea
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter cancellation reason..."
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    rows="3"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowCancelReason(false);
                        setCancelReason('');
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCancelOrder(selectedOrder, cancelReason)}
                      disabled={!cancelReason.trim()}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelReason(true)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiX className="shrink-0" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {/* {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))} */}
            </ul>
            <button
              onClick={closeErrorPopup}
              className="mt-4 p-2 w-full rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-lg font-semibold mb-4 text-green-600">Success</h2>
            <p className="text-sm text-gray-700">
              Order added to pending orders list.
            </p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 p-2 w-full rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;