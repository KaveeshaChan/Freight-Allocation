import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layouts/Main_Layout';
import { FiSearch, FiPlusCircle, FiRefreshCw, FiClock, FiX } from 'react-icons/fi';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const navigate = useNavigate();

  const handlePendingOrder = (order) => {
    console.log('Mark order as pending:', order);
    // Add your pending logic here
  };

  const handleCancelOrder = (order) => {
    console.log('Cancel order:', order);
    // Add your cancellation logic here
  };

  useEffect(() => {
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
      }
    };
    fetchAvailableOrders();
  }, []);
  console.log(availableOrders);

  const handleAddQuote = (order) => {
    navigate('/Order-Ammendments', { state: { order } });
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-4">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Available Orders
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
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors even:bg-gray-50">
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
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handlePendingOrder(order)}
                            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <FiClock className="shrink-0" />
                            <span className="hidden sm:inline">Pending</span>
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <FiX className="shrink-0" />
                            <span className="hidden sm:inline">Cancel</span>
                          </button>
                        </div>
                      </td>
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
    </div>
  );
};

export default Dashboard;