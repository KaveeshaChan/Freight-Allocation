import React, { useState } from "react";
import Layout from "./Main_Layout";
import ExportAirFreight from "./ExportAirFreight";
import ExportLCL from "./ExportLCL";
import ExportFCL from "./ExportFCL";
import ImportAirFreight from "./ImportAirFreight";
import ImportLCL from "./ImportLCL";
import ImportFCL from "./ImportFCL";

const DocumentPage = () => {
  const [formData, setFormData] = useState({});
  const [orderType, setOrderType] = useState("export");
  const [shipmentType, setShipmentType] = useState("airFreight");

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Prepare the data before sending to backend
  const prepareDataForBackend = () => {
    const dataToSend = {
      orderType: orderType || null,
      shipmentType: shipmentType || null,
      ...formData,
    };

    // Convert empty fields to null
    for (let key in dataToSend) {
      if (dataToSend[key] === "") {
        dataToSend[key] = null;
      }
    }

    console.log(dataToSend); // For debugging
    return dataToSend;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    console.log("handleSubmit function is called");
    event.preventDefault(); // Prevent default form submission

    const data = prepareDataForBackend(); // Get prepared data

    try {
      const response = await fetch("http://localhost:5056/api/add-new-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("Success:", responseData); // Success log
    } catch (error) {
      console.error("Error:", error); // Error log
    }
  };

  // Render the appropriate component based on orderType and shipmentType
  const renderActiveComponent = () => {
    switch (`${orderType}-${shipmentType}`) {
      case "export-airFreight":
        return (
          <ExportAirFreight
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "export-lcl":
        return (
          <ExportLCL
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "export-fcl":
        return (
          <ExportFCL
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "import-airFreight":
        return (
          <ImportAirFreight
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "import-lcl":
        return (
          <ImportLCL
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case "import-fcl":
        return (
          <ImportFCL
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="p-8 mt-8">
        <div className="flex items-center space-x-6 mb-6">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-md">
              Add New Order
            </button>
          </form>

          <div className="flex items-center space-x-2">
            <label className="font-medium text-gray-700">Select Order Type:</label>
            <select
              onChange={(e) => setOrderType(e.target.value)}
              value={orderType}
              className="p-2 bg-black text-white border-2 border-gray-300 rounded-md"
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
              className="p-2 bg-black text-white border-2 border-gray-300 rounded-md"
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

          {renderActiveComponent()} {/* Render the active component */}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentPage;
