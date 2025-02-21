import React, { useState, useEffect } from "react";
import Header from "../Layouts/Main_Layout";
import ExportAirFreight from "./Export/ExportAirFreight";
import ExportLCL from "./Export/ExportLCL";
import ExportFCL from "./Export/ExportFCL";
import ImportAirFreight from "./Import/ImportAirFreight";
import ImportLCL from "./Import/ImportLCL";
import ImportFCL from "./Import/ImportFCL";

const DocumentPage = () => {
  const [formData, setFormData] = useState({});
  const [orderType, setOrderType] = useState("export");
  const [shipmentType, setShipmentType] = useState("airFreight");

  useEffect(() => {
    resetForm(); // Reset the form data when orderType or shipmentType changes
  }, [orderType, shipmentType]);

  const resetForm = () => {
    setFormData({}); // Reset form data to empty
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with:");
    console.log("Order Type:", orderType);
    console.log("Shipment Type:", shipmentType);
    console.log("Other Data:", formData);

    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mt-24 pb-12">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Selection Header */}
          <div className="bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-xl p-6 mb-8 shadow-lg">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="bg-white/10 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                  </svg>
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {orderType.charAt(0).toUpperCase() + orderType.slice(1)} Documentation
                  </h1>
                  <p className="text-gray-300">Manage your {orderType} shipments</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    onChange={(e) => setOrderType(e.target.value)}
                    value={orderType}
                    className="appearance-none bg-white/20 backdrop-blur-sm pl-4 pr-8 py-2 rounded-lg border border-white/30 text-white focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                  >
                    <option value="export" className="bg-[#0534F0]">Export</option>
                    <option value="import" className="bg-[#0534F0]">Import</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    onChange={(e) => setShipmentType(e.target.value)}
                    value={shipmentType}
                    className="appearance-none bg-white/20 backdrop-blur-sm pl-4 pr-8 py-2 rounded-lg border border-white/30 text-white focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                  >
                    <option value="airFreight" className="bg-[#0534F0]">Air Freight</option>
                    <option value="lcl" className="bg-[#0534F0]">LCL</option>
                    <option value="fcl" className="bg-[#0534F0]">FCL</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <span className="bg-[#0534F0] w-2 h-6 rounded-full"></span>
                <span>
                  {shipmentType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} Details
                </span>
              </h2>
            </div>

            <div className="p-8">
              {orderType === "import" && shipmentType === "lcl" && <ImportLCL formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
              {orderType === "import" && shipmentType === "fcl" && <ImportFCL formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
              {orderType === "import" && shipmentType === "airFreight" && <ImportAirFreight formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
              {orderType === "export" && shipmentType === "airFreight" && <ExportAirFreight formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
              {orderType === "export" && shipmentType === "lcl" && <ExportLCL formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
              {orderType === "export" && shipmentType === "fcl" && <ExportFCL formData={formData} handleInputChange={handleInputChange} orderType={orderType} shipmentType={shipmentType} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentPage;