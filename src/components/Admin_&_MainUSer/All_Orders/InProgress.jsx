import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layouts/Main_Layout';
import { FiSearch, FiPlusCircle, FiRefreshCw, FiClock, FiX } from 'react-icons/fi';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="mt-4">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 max-w-4xl">
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative md:col-span-2">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  <select
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Export">Export</option>
                    <option value="Import">Import</option>
                  </select>

                  <div className="flex gap-2">
                    <select
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                      className="px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                      title="Reset filters"
                    >
                      <FiRefreshCw className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-6 text-right">
              <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                In Progress Orders
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                ({filteredOrders.length} available)
              </p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                    <th className="py-4 px-6 bg-gray-50">Order Number</th>
                    <th className="py-4 px-6 bg-gray-50">Type</th>
                    <th className="py-4 px-6 bg-gray-50">Shipment</th>
                    <th className="py-4 px-6 bg-gray-50">Valid Days</th>
                    <th className="py-4 px-6 bg-gray-50 text-right">Quotes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.orderNumber} 
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(order)}
                    >
                      <td className="py-4 px-6 font-medium text-gray-800">#{order.orderNumber}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                          ${order.orderType === 'Export' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${order.shipmentType === 'airFreight' ? 'bg-purple-100 text-purple-700' :
                            order.shipmentType === 'LCL' ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {order.shipmentType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-800">{order.daysRemaining}</span>
                          <span className="text-xs text-gray-400">days</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-800">
                        <span className="bg-blue-100/50 px-2.5 py-1 rounded-full text-sm">
                          {order.numberOfQuotes}
                        </span>
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
              <button onClick={closePopup} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            {/* Render table based on order type and shipment type */}
            {selectedOrder.orderType === 'export' && selectedOrder.shipmentType === 'airFreight' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
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
                          `${selectedOrder.from} - ${selectedOrder.to}`,
                          new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                          selectedOrder.deliveryTerm,
                          selectedOrder.Type,
                          selectedOrder.cargoType,
                          selectedOrder.numberOfPallets,
                          selectedOrder.chargeableWeight,
                          selectedOrder.grossWeight,
                          selectedOrder.cargoCBM,
                          new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}

            {selectedOrder.orderType === 'export' && selectedOrder.shipmentType === 'lcl' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          'Route', 'Shipment Ready Date', 'Delivery Term',
                          'Type', 'Number of Pallets', 'Pallet CBM',
                          'Cargo CBM', 'Gross Weight (Kg)', 'Target Date'
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
                          `${selectedOrder.from} - ${selectedOrder.to}`,
                          new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                          selectedOrder.deliveryTerm,
                          selectedOrder.Type,
                          selectedOrder.numberOfPallets,
                          selectedOrder.palletCBM,
                          selectedOrder.cargoCBM,
                          selectedOrder.grossWeight,
                          new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}

{selectedOrder.orderType === 'export' && selectedOrder.shipmentType === 'fcl' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
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
                  `${selectedOrder.from} - ${selectedOrder.to}`,
                  new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                  selectedOrder.deliveryTerm,
                  selectedOrder.Type,
                  selectedOrder.numberOfContainers,
                  new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}

{selectedOrder.orderType === 'import' && selectedOrder.shipmentType === 'fcl' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                {[
                  'Route', 'Shipment Ready Date', 'Delivery Term',
                  'Type', 'Cargo Type', 'Pallets',
                  'Chargeable Weight (Kg)', 'Gross Weight',
                  'Cargo CBM', 'L*W*H with the pallet', 'Target Date'
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
                  `${selectedOrder.from} - ${selectedOrder.to}`,
                  new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                  selectedOrder.deliveryTerm,
                  selectedOrder.Type,
                  selectedOrder.cargoType,
                  selectedOrder.numberOfPallets,
                  selectedOrder.chargeableWeight,
                  selectedOrder.grossWeight,
                  selectedOrder.cargoCBM,
                  selectedOrder.LWHWithThePallet,
                  new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}

{selectedOrder.orderType === 'import' && selectedOrder.shipmentType === 'airFreight' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                {[
                  'Route', 'Shipment Ready Date', 'Delivery Term',
                  'Type', 'Cargo Type', 'Pallets',
                  'Chargeable Weight (Kg)', 'Gross Weight',
                  'Cargo CBM', 'L*W*H with the pallet', 'Target Date'
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
                  `${selectedOrder.from} - ${selectedOrder.to}`,
                  new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                  selectedOrder.deliveryTerm,
                  selectedOrder.Type,
                  selectedOrder.cargoType,
                  selectedOrder.numberOfPallets,
                  selectedOrder.chargeableWeight,
                  selectedOrder.grossWeight,
                  selectedOrder.cargoCBM,
                  selectedOrder.LWHWithThePallet,
                  new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}

{selectedOrder.orderType === 'import' && selectedOrder.shipmentType === 'lcl' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  
                  <p className="text-m text-gray-500 mt-4">
              Order Number: {selectedOrder.orderNumber}
            </p>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                {[
                  'Route', 'Shipment Ready Date', 'Delivery Term',
                  'Type', 'Number of Pallets', 'Target Date'
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
                  `${selectedOrder.from} - ${selectedOrder.to}`,
                  new Date(selectedOrder.shipmentReadyDate).toISOString().split('T')[0],
                  selectedOrder.deliveryTerm,
                  selectedOrder.Type,
                  selectedOrder.numberOfPallets,
                  new Date(selectedOrder.targetDate).toISOString().split('T')[0]
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
            )}
            

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handlePendingOrder(selectedOrder)}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiClock className="shrink-0" />
                <span className="hidden sm:inline">Pending</span>
              </button>
              <button
                onClick={() => handleCancelOrder(selectedOrder)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiX className="shrink-0" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;