import React, { useState, useEffect } from 'react';
import InProgress from './InProgress';
import PendingOrders from './Pending';
import CompletedOrders from './Completed';
import OrderSummary from './Summary';
import Header from '../../Layouts/Main_Layout';
import CancelOrder from './Cancelled_Orders';

const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState('inProgress');
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
      if (!isMobile) {
        setShowDropdown(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

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

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'inProgress':
        return 'In Progress';
      case 'pendingOrders':
        return 'Pending Orders';
      case 'completedOrders':
        return 'Completed Orders';
      case 'orderSummary':
        return 'Select Freight Forwarder';
      case 'cancelOrder':
        return 'Cancelled Orders';
      default:
        return '';
    }
  };

  const getTabIcon = (tab) => {
    const iconProps = {
      className: `w-4 h-4 mr-1.5 ${activeTab === tab ? "text-white" : "text-slate-500"}`
    };

    switch (tab) {
      case 'inProgress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z"/>
            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z"/>
            <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z"/>
          </svg>
        );
      case 'pendingOrders':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...iconProps}>
            <path fill="currentColor" d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85zM20 3h-5.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H4v19h8.11a6.7 6.7 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6zm-8 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1" />
          </svg>
        );
      case 'completedOrders':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...iconProps}>
            <path fill="currentColor" d="M1.5 8a6.5 6.5 0 1 1 13 0A.75.75 0 0 0 16 8a8 8 0 1 0-8 8a.75.75 0 0 0 0-1.5A6.5 6.5 0 0 1 1.5 8" />
            <path fill="currentColor" d="m8.677 12.427l2.896 2.896a.25.25 0 0 0 .427-.177V13h3.25a.75.75 0 0 0 0-1.5H12V9.354a.25.25 0 0 0-.427-.177l-2.896 2.896a.25.25 0 0 0 0 .354M11.28 6.78a.749.749 0 1 0-1.06-1.06L7.25 8.689L5.78 7.22a.749.749 0 1 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0z" />
          </svg>
        );
      case 'cancelOrder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" {...iconProps}>
            <path fill="currentColor" fillRule="evenodd" d="M6 12A6 6 0 1 0 6 0a6 6 0 0 0 0 12M4.28 3.22a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06-1.06z" clipRule="evenodd" />
          </svg>
        );
      case 'orderSummary':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 22 22" {...iconProps}>
            <path fill="currentColor" d="M3 4a2 2 0 0 0-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5l-3-4h-3V4m-7 2l4 4l-4 4v-3H4V9h6m7 .5h2.5l1.97 2.5H17M6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTabButton = (tab) => (
    <button
      key={tab}
      className={`z-30 flex items-center justify-center w-full p-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
        activeTab === tab 
          ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" 
          : "text-slate-600 hover:bg-gray-200 hover:text-blue-600"
      }`}
      onClick={() => {
        setActiveTab(tab);
        if (isMobile) setShowDropdown(false);
      }}
    >
      {getTabIcon(tab)}
      <span className="ml-1">{getTabLabel(tab)}</span>
    </button>
  );

  const tabs = ['inProgress', 'pendingOrders', 'completedOrders', 'cancelOrder', 'orderSummary'];

  return (
    <div className='h-screen bg-gray-100'>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="fixed top-16 left-0 w-full z-40 bg-transparent shadow-sm">
        <div className="container mx-auto px-4">
          <div className=" flex w-[100%]">
            {isMobile ? (
              <div className="relative max-w-[300px]">
                <div className="flex items-center">
                  {renderTabButton(activeTab)}
                  <button
                    className="p-2 ml-2 text-slate-600"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-50">
                    {tabs
                      .filter(tab => tab !== activeTab)
                      .map(tab => (
                        <div key={tab} className="px-2 py-1">
                          {renderTabButton(tab)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full">
                <ul className="flex flex-wrap px-1.5 py-2 list-none bg-white gap-4">
                  {tabs.map(tab => (
                    <li key={tab} className="flex-1 min-w-[120px]">
                      {renderTabButton(tab)}
                    </li>               
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Tab Content */}
      <div className='pt-[90px] overflow-y-auto h-[100vh] px-2'>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrderTabs;