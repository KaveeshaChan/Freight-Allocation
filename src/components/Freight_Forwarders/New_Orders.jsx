import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FiSearch, FiFilter, FiPlusCircle, FiRefreshCw } from 'react-icons/fi';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
    
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from storage
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }

        const response = await fetch("http://localhost:5056/api/select/view-orders/", {
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
  

  const handleAddQuote = (order) => {
    navigate('/Add_Quote', { state: { order } });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = availableOrders.filter(order => {
    const matchesSearch = order.orderNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrderType = orderType ? order.orderType.toLowerCase() === orderType.toLowerCase() : true;
    const matchesShipmentType = shipmentType ? order.shipmentType.toLowerCase() === shipmentType.toLowerCase() : true;

    return matchesSearch && matchesOrderType && matchesShipmentType;
  }).sort((b, a) => new Date(b.daysRemaining) - new Date(a.daysRemaining));

  const clearFilters = () => {
    setSearchTerm('');
    setOrderType('');
    setShipmentType('');
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
                  Available Orders
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
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Export">Export</option>
                    <option value="Import">Import</option>
                  </select>

                  <select
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[160px]"
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

            
            {/* Enhanced Table Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-6">
            <div className="relative max-h-[600px]">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
                <table className="w-full">
                <thead>
                    <tr className="text-sm font-semibold text-gray-600 text-center">
                      <th className="py-5 px-4 w-[15%]">Order Number</th>
                      <th className="py-5 px-4 w-[15%]">Type</th>
                      <th className="py-5 px-4 w-[15%]">Shipment</th>
                      <th className="py-5 px-4 w-[15%]">Valid Days</th>
                      <th className="py-5 px-4 w-[15%]">Quoting Status</th>
                      {userRole !== 'freightAgent' && <th className="py-4 px-6">Actions</th>}
                    </tr>
                  </thead>

                </table>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors text-center">
                        <td className="py-5 px-4 w-[15%] font-medium text-gray-800">{order.orderNumber}</td>
                        <td className="py-5 px-4 w-[15%]">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                            {order.orderType}
                          </span>
                        </td>
                        <td className="py-5 px-4 w-[15%] text-gray-600">{order.shipmentType}</td>
                        <td className="py-5 px-4 w-[15%]">
                          <div className="flex items-center gap-2 justify-center">
                            <span className="text-gray-600">{order.daysRemaining}</span>
                            <span className="text-sm text-gray-400">days</span>
                          </div>
                        </td>
                        <td className="py-5 px-4 w-[15%]">
                          {order.alreadyQuoted === 'Yes' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                              Quoted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                              Not Quoted
                            </span>
                          )}
                        </td>
                        {userRole !== 'freightAgent' && (
                        <td className="py-5 px-4 w-[15%]">
                          <button
                            onClick={() => handleAddQuote(order)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 ml-auto"
                          >
                            <FiPlusCircle className="text-medium" />
                            Add Quote
                          </button>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-300 mb-4 text-6xl">📭</div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">You haven't completed any orders yet.</h3>
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;