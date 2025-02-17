import React, { useState } from 'react';
import InProgress from './InProgress';
import PendingOrders from './Pending';
import CompletedOrders from './Pending';
import OrderSummary from './Summary';
import Header from '../../Layouts/Main_Layout';
import CancelOrder from './Cancelled_Orders';

const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState('inProgress');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inProgress':
        return <InProgress />;
      case 'pendingOrders':
        return <PendingOrders />;
      case 'completedOrders':
        return <CompletedOrders />;
      case 'orderSummary':
        return <OrderSummary />;
        case 'cancelOrder':
        return <CancelOrder />;
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
            activeTab === 'pendingOrders'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('pendingOrders')}
        >
          Pending Orders
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'completedOrders'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('completedOrders')}
        >
          Completed Orders
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'cancelOrder'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('cancelOrder')}
        >
          Cancelled Orders
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            activeTab === 'orderSummary'
              ? 'bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#0534F0] hover:to-[#98009E] hover:text-white'
          }`}
          onClick={() => setActiveTab('orderSummary')}
        >
          Order Summary
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
    </main>
      </div>
  );
};

export default OrderTabs;