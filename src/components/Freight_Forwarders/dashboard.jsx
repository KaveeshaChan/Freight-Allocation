import React, { useState, useEffect } from 'react';
import InProgress from './New_Orders';
import CompletedOrders from './Complted';
import Quoted from './Quoted_Items';
import Header from '../Layouts/Main_Layout';
import { useNavigate } from 'react-router-dom';

const OrderTabs = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inProgress');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inProgress':
        return <InProgress />;
      
      case 'completedOrders':
        return <CompletedOrders />;

        case 'Quoted':
        return <Quoted />;
      
        
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <main className="mt-24">
    <div className="container mx-auto p-4">
      <div className="flex justify-left space-x-4">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'inProgress'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('inProgress')}
        >
          In Progress
        </button>
        

        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'Quoted'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('Quoted')}
        >
          Quoted Orders
        </button>
        
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'completedOrders'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('completedOrders')}
        >
          Choosen Orders
        </button>
        
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
    </main>
      </div>
  );
};

export default OrderTabs;