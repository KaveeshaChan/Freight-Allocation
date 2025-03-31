import React, { useState, useEffect } from "react";
import InProgress from "./New_Orders";
import CompletedOrders from "./Complted";
import Quoted from "./Quoted_Items";
import Header from "../Layouts/Main_Layout";
import { useNavigate } from "react-router-dom";

const OrderTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inProgress");

  // Check token validation
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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

  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="w-[100%] fixed top-16 left-0 z-40 bg-white ">
        <div className="container mx-auto px-4">
          <div className="relative flex w-[50%] justify-between right-0">
            <ul className="relative flex flex-wrap px-1.5 py-2 list-none  bg-white gap-4">
              <li className="z-30 flex-auto text-center ">
                <button
                  className={`z-30 flex items-center justify-center w-full p-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                    activeTab === "inProgress" 
                      ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" 
                      : "text-slate-600 hover:bg-white hover:text-slate-700"
                  }`}
                  onClick={() => setActiveTab("inProgress")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                    className={`w-4 h-4 mr-1.5 ${
                      activeTab === "inProgress" ? "text-white" : "text-slate-500"
                  }`}>
                    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z"/>
                    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z"/>
                    <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z"/>
                  </svg>
                    <span className="ml-1">In Progress</span>
                </button>
              </li>
            <li className="z-30 flex-auto text-center">
              <button
                className={`z-30 flex items-center justify-center w-full p-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                  activeTab === "Quoted" 
                    ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" 
                    : "text-slate-600 hover:bg-white hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("Quoted")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                  className={`w-4 h-4 mr-1.5 ${
                    activeTab === "Quoted" ? "text-white" : "text-slate-500"
                 }`}>
                  <path fill="currentColor" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0-.477.65l.11.35H3.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-1.632l.11-.35A.5.5 0 0 0 10.5 1zm.68 1h3.64l-.313 1H6.493zm1.674 8.854l3.5-3.5l-.707-.708L7.5 9.793L5.854 8.146l-.708.708l2 2a.5.5 0 0 0 .708 0" clip-rule="evenodd" />
                </svg>
                  <span className="ml-1">Quoted Orders</span>
              </button>
            </li>
            <li className="z-30 flex-auto text-center">
              <button
                className={`z-30 flex items-center justify-center w-full p-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                  activeTab === "completedOrders" 
                    ? "bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white shadow-lg" 
                    : "text-slate-600 hover:bg-white hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("completedOrders")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                  className={`w-4 h-4 mr-1.5 ${
                    activeTab === "completedOrders" ? "text-white" : "text-slate-500"
                  }`}>
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd"/>
                </svg>
                  <span className="ml-1">Chosen Orders</span>
              </button>
            </li>
          </ul>
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
