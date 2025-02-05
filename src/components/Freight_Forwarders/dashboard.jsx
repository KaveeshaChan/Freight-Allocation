import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';



const Dashboard = ({ children }) => {
  const [availableOrders, setAvailableOrders] = useState([]);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }
    
        const response = await axios.get(
          'http://localhost:5056/api/select/view-orders-agents/',
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        setAvailableOrders(response.data.orders || []);
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

  return (
    <Header>
    <div>
      <h1>Header Section</h1>
      {children}
    </div>
    </Header>
  );
};

export default Dashboard;
