import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Main_Layout";
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

    // You can perform other actions here, like saving data locally, displaying a message, etc.
    // In this case, no API call is made.

    resetForm();
  };

  return (
    <Layout>
      <div className="p-4 mt-8">
        <div className="flex items-center space-x-6 mb-6">
          <form onSubmit={handleFormSubmit}>
          <span className="px-4 py-2 border-2 border-orange-500 text-orange-500 bg-transparent rounded-md">
        Add New Order
      </span>
          </form>

          
          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-700">Select Order Type:</label>
            <select
              onChange={(e) => setOrderType(e.target.value)}
              value={orderType}
              className="p-2  bg-orange-500 text-white rounded-md"
            >
              <option value="export">Export</option>
              <option value="import">Import</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-700">Select Shipment Type:</label>
            <select
              onChange={(e) => setShipmentType(e.target.value)}
              value={shipmentType}
              className="p-2 bg-orange-500 text-white rounded-md"
            >
              <option value="airFreight">Air Freight</option>
              <option value="lcl">LCL</option>
              <option value="fcl">FCL</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-black p-6 mb-8 rounded-md shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center w-full uppercase">
            {orderType.charAt(0).toUpperCase() + orderType.slice(1)} -{" "}
            {shipmentType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          </h2>

          {orderType === "import" && shipmentType === "lcl" && (
            <ImportLCL formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType} />
          )}
          {orderType === "import" && shipmentType === "fcl" && (
            <ImportFCL formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType} />
          )}
          {orderType === "import" && shipmentType === "airFreight" && (
            <ImportAirFreight formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType} />
          )}
          {orderType === "export" && shipmentType === "airFreight" && (
            <ExportAirFreight formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType} />
          )}
          {orderType === "export" && shipmentType === "lcl" && (
            <ExportLCL formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType} />
          )}
          {orderType === "export" && shipmentType === "fcl" && (
            <ExportFCL
            formData={formData}
            handleInputChange={handleInputChange}
            orderType={orderType}
            shipmentType={shipmentType}
          />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentPage;
