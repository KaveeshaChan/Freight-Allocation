import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in again.');

        const response = await fetch("http://localhost:5056/api/select/view-orders-agents/", {
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

  const filteredOrders = availableOrders
    .filter(order => order.orderNumber.toString().includes(searchTerm))
    .filter(order => (orderType ? order.orderType === orderType : true))
    .filter(order => (shipmentType ? order.shipmentType === shipmentType : true));

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Order Number"
            className="border border-gray-300 rounded-lg px-3 py-2 w-1/3"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 ml-2"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="">Select Order Type</option>
            <option value="Export">Export</option>
            <option value="Import">Import</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 ml-2"
            value={shipmentType}
            onChange={(e) => setShipmentType(e.target.value)}
          >
            <option value="">Select Shipment Type</option>
            <option value="Air Freight">Air Freight</option>
            <option value="LCL">LCL</option>
            <option value="FCL">FCL</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 text-left">Order Number</th>
                <th className="py-3 px-4 text-left">Order Type</th>
                <th className="py-3 px-4 text-left">Shipment Type</th>
                <th className="py-3 px-4 text-left">Quotation Valid Days</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderNumber} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.orderType}</td>
                  <td className="py-3 px-4">{order.shipmentType}</td>
                  <td className="py-3 px-4">{order.quotationValidDays}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAddQuote(order)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                    >
                      Add Quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {children}
      </div>
    </>
  );
};

export default Dashboard;