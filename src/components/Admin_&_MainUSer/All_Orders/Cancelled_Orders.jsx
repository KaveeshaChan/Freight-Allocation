import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layouts/Main_Layout';
import { FiSearch, FiPlusCircle, FiRefreshCw, FiClock, FiX, FiBox, FiTruck, FiAnchor, FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';
import AirfreightExportPopup from '../PopupForSelectAgent/CancelledEXP-AIR'; // Import the popup component
import AirfreightImportPopup from '../PopupForSelectAgent/CancelledIMP-AIR'; // Import the popup component
import LCLExportPopup from '../PopupForSelectAgent/CancelledEXP-LCL'; // Import the popup component
import LCLImportPopup from '../PopupForSelectAgent/CancelledIMP-LCL'; // Import the popup component
import FCLExportPopup from '../PopupForSelectAgent/CancelledEXP-FCL'; // Import the popup component
import FCLImportPopup from '../PopupForSelectAgent/CancelledIMP-FCL'; // Import the popup component

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null); // State for selected quote
  const navigate = useNavigate();
  const status = "cancelled";

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
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

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
    setSelectedQuote({}); // Simulate selecting a quote for the popup
  };

  const handleClosePopup = () => {
    setSelectedOrder(null);
    setSelectedQuote(null);
  };

  const handleSelectAgentInPopup = () => {
    // Add logic to handle selecting an agent within the popup
    handleClosePopup();
  };

  const renderPopup = () => {
    if (!selectedOrder) return null;

    const { orderType, shipmentType } = selectedOrder;

    if (orderType === 'export' && shipmentType === 'airFreight') {
      return <AirfreightExportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    if (orderType === 'import' && shipmentType === 'airFreight') {
      return <AirfreightImportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    if (orderType === 'export' && shipmentType === 'lcl') {
      return <LCLExportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    if (orderType === 'import' && shipmentType === 'lcl') {
      return <LCLImportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    if (orderType === 'export' && shipmentType === 'fcl') {
      return <FCLExportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    if (orderType === 'import' && shipmentType === 'fcl') {
      return <FCLImportPopup quote={selectedQuote} order={selectedOrder} onClose={handleClosePopup} onSelectAgent={handleSelectAgentInPopup} />;
    }

    return null;
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
                  Cancelled Orders
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
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm font-semibold text-gray-600 text-center">
                      <th className="py-5 px-4 w-[16%]">Order Number</th>
                      <th className="py-5 px-4 w-[16%]">Order Type</th>
                      <th className="py-5 px-4 w-[16%]">Shipment Type</th>
                      <th className="py-5 px-4 w-[16%]">Cancelled By</th>

                      
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

                        <td className="py-5 px-4 font-medium text-red-700 w-[16%] text-center">{order.cancelledByName}</td>
                        
                        
                        
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

      {renderPopup()}

    </div>
  );
};

export default Dashboard;