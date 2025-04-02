import React, { useState, useEffect } from "react";
import InProgress from "./New_Orders";
import CompletedOrders from "./Complted";
import Quoted from "./Quoted_Items";
import Header from "../Layouts/Main_Layout";
import { useNavigate } from "react-router-dom";

const OrderTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inProgress");
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check token validation
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
      if (window.innerWidth >= 768) {
        setShowDropdown(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Removed isMobile dependency to avoid infinite loop

  const renderTabContent = () => {
    switch (activeTab) {
      case "inProgress":
        return <InProgress />;
      case "completedOrders":
        return <CompletedOrders />;
      case "Quoted":
        return <Quoted />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'inProgress':
        return 'In Progress';
      case 'Quoted':
        return 'Quoted Orders';
      case 'completedOrders':
        return 'Chosen Orders';
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
      case 'Quoted':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...iconProps}>
            <path fill="currentColor" fillRule="evenodd" d="M5.5 1a.5.5 0 0 0-.477.65l.11.35H3.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.632l.11-.35A.5.5 0 0 0 10.5 1zm.68 1h3.64l-.313 1H6.493zm1.674 8.854l3.5-3.5l-.707-.708L7.5 9.793L5.854 8.146l-.708.708l2 2a.5.5 0 0 0 .708 0" clipRule="evenodd" />
          </svg>
        );
      case 'completedOrders':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...iconProps}>
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd"/>
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
          : "text-slate-600 hover:bg-white hover:text-blue-600"
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

  const tabs = ['inProgress', 'Quoted', 'completedOrders'];

  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </div>

      {/* Tabs Navigation */}
      <div className="fixed top-16 left-0 w-full z-40 bg-transparent shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex w-full">
            {isMobile ? (
              <div className="relative max-w-[300px] py-2">
                <div className="flex items-center">
                  <div className="w-full">
                    {renderTabButton(activeTab)}
                  </div>
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
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 z-50 border border-gray-200">
                    {tabs
                      .filter(tab => tab !== activeTab)
                      .map(tab => (
                        <div key={tab} className="px-2 py-1 hover:bg-gray-50">
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
      <div className="pt-[90px] overflow-y-auto h-[100vh] px-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrderTabs;