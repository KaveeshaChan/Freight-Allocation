import React, { useState, useEffect } from 'react';
import Header from './Header';
import Modal from './Modal'; // Import the Modal component
import ShipmentForm from './Add_Quote'; // Import the ShipmentForm component

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
        const response = await fetch(
          "http://localhost:5056/api/select/view-orders-agents/", 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAvailableOrders(data.orders || []);

      } catch (error) {
        console.error('Error fetching freight agents:', error.message);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Redirecting to login.');
          // Handle unauthorized error (e.g., redirect to login page)
        }
      }
    };
  
    fetchAvailableOrders();
  }, []);

  const handleAddQuote = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Orders</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No orders available
                    </td>
                  </tr>
                ) : (
                  availableOrders.map((order) => (
                    <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shipmentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quotationValidDays}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleAddQuote(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          Add Quote
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Add Quote for Order #{selectedOrder?.orderNumber}</h2>
            <ShipmentForm selectedOrder={selectedOrder} />
          </div>
        </Modal>

        {children}
      </div>
    </>
  );
};

export default Dashboard;