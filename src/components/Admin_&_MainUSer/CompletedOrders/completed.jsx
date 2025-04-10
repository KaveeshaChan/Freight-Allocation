import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AirfreightExport from './expair';
import AirfreightImport from './impair';
import LCLExport from './explcl';
import LCLImport from './implcl';
import FCLExport from './expfcl';
import FCLImport from './impfcl';

const OrderDetails = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [freightQuotes, setFreightQuotes] = useState([]);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }

      const response = await fetch(`http://192.168.100.20:5056/api/select/view-orders/exporter?status=completed`, {
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
      const orderData = data.orders?.find(order => order.orderNumber === orderNumber) || null;
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchFreightQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch(`http://192.168.100.20:5056/api/select/view-quotes/?orderNumber=${orderNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch freight quotes');
      }

      const data = await response.json();

      // Extract the 'quotes' array from the response object
      if (Array.isArray(data.quotes)) {
        setFreightQuotes(data.quotes);
      } else {
        console.error("Unexpected API response format:", data);
        setFreightQuotes([]); // Fallback to prevent errors
      }
    } catch (error) {
      console.error('Error fetching freight quotes:', error);
      setFreightQuotes([]); // Ensure state remains an array
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchFreightQuotes();
  }, [orderNumber]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const renderOrderDetails = () => {
    const { orderType, shipmentType } = order;

    if (orderType === 'export' && shipmentType === 'airFreight') {
      return <AirfreightExport order={order} quotes={freightQuotes} />;
    }

    if (orderType === 'import' && shipmentType === 'airFreight') {
      return <AirfreightImport order={order} quotes={freightQuotes} />;
    }

    if (orderType === 'export' && shipmentType === 'lcl') {
      return <LCLExport order={order} quotes={freightQuotes} />;
    }

    if (orderType === 'import' && shipmentType === 'lcl') {
      return <LCLImport order={order} quotes={freightQuotes} />;
    }

    if (orderType === 'export' && shipmentType === 'fcl') {
      return <FCLExport order={order} quotes={freightQuotes} />;
    }

    if (orderType === 'import' && shipmentType === 'fcl') {
      return <FCLImport order={order} quotes={freightQuotes} />;
    }

    return null;
  };

  return (
    <div className="container mx-auto p-6">
        <button
        onClick={() => navigate(-1)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors">
        <FiArrowLeft className="mr-2 h-5 w-5" />
        Back to Dashboard
        </button>
      

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-4">
        {renderOrderDetails()}
      </div>
      
    </div>
  );
};

export default OrderDetails;