import React, { useState, useEffect } from 'react';
import Header from './Header';

const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);

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
    // Function to handle adding a quote for a specific order
    console.log('Add quote for order:', order);
    // Implement the logic to submit a quote for the order
  };

  return (
    <>
    <Header />
      <div clasName="">
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Order Type</th>
              <th>Shipment Type</th>
              <th>Quotation Valid Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableOrders.map((order) => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.orderType}</td>
                <td>{order.shipmentType}</td>
                <td>{order.quotationValidDays}</td>
                <td>
                  <button onClick={() => handleAddQuote(order)}>Add Quote</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {children}
      </div>
    </>
  );
};

export default Dashboard;