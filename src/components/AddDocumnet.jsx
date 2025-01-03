import React, { useState } from 'react';
import Layout from './Main_Layout';

const InProgress = () => {
  const [formData, setFormData] = useState({
    orderType: 'import',
    shipmentType: 'airFreight',
    orderNo: '',
    fromRoute: '',
    toRoute: '',
    shipmentReadyDate: '',
    term: '',
    type: '',
  });

  const [previewData, setPreviewData] = useState(null); // Store the previewed data
  const [showTable, setShowTable] = useState(false); // Control table visibility

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDropdownChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePreview = () => {
    setPreviewData(formData); // Store the form data for preview
    setShowTable((prevState) => !prevState); // Toggle table visibility
  };

  const handleSubmit = () => {
    setFormData({
      orderType: 'import',
      shipmentType: 'airFreight',
      orderNo: '',
      fromRoute: '',
      toRoute: '',
      shipmentReadyDate: '',
      term: '',
      type: '',
    });
    setPreviewData(null); // Clear the preview after submitting
    setShowTable(false); // Hide the table after submission
  };

  // Display content based on dropdown selections
  const renderDynamicContent = () => {
    const parentBoxStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%', // Ensure it takes the full height of the parent box
      width: '100%', // Ensure it takes the full width of the parent box
    };
  
    const boxStyle = {
      backgroundColor: 'red',
      color: 'white',
      padding: '0.5rem 1rem', // Adjust padding for the box size
      borderRadius: '8px',
      textAlign: 'center',
      fontWeight: 'bold',
      display: 'inline-block', // Ensure the box adjusts to content size
    };
  
    if (formData.orderType === 'import' && formData.shipmentType === 'airFreight') {
      return (
        <div style={parentBoxStyle}>
          <div style={boxStyle}>You selected Import - Air Freight</div>
        </div>
      );
    }
    if (formData.orderType === 'export' && formData.shipmentType === 'lcl') {
      return (
        <div style={parentBoxStyle}>
          <div style={boxStyle}>You selected Export - LCL</div>
        </div>
      );
    }
    if (formData.orderType === 'export' && formData.shipmentType === 'fcl') {
      return (
        <div style={parentBoxStyle}>
          <div style={boxStyle}>You selected Export - FCL</div>
        </div>
      );
    }
    if (formData.orderType === 'import' && formData.shipmentType === 'lcl') {
      return (
        <div style={parentBoxStyle}>
          <div style={boxStyle}>You selected Import - LCL</div>
        </div>
      );
    }
    if (formData.orderType === 'import' && formData.shipmentType === 'fcl') {
      return (
        <div style={parentBoxStyle}>
          <div style={boxStyle}>You selected Import - FCL</div>
        </div>
      );
    }
    return (
      <div style={parentBoxStyle}>
        <div style={boxStyle}>Please select an option.</div>
      </div>
    );
  };
  
  
  

  return (
    <Layout>
      <div className="p-4 mt-8">
        <div className="flex items-center mb-6">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            style={{ transition: 'all 0.3s ease' }}
          >
            Add Document
          </button>

          {/* Order Type Selection */}
          <div className="ml-4">
            <label htmlFor="orderType" className="block text-gray-700 font-medium mr-4 inline">
              Select Order Type:
            </label>
            <select
              id="orderType"
              value={formData.orderType}
              onChange={handleDropdownChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="import">Import</option>
              <option value="export">Export</option>
            </select>
          </div>

          {/* Shipment Type Selection */}
          <div className="ml-4">
            <label htmlFor="shipmentType" className="block text-gray-700 font-medium mr-4 inline">
              Shipment Type:
            </label>
            <select
              id="shipmentType"
              value={formData.shipmentType}
              onChange={handleDropdownChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="airFreight">Air Freight</option>
              <option value="lcl">LCL</option>
              <option value="fcl">FCL</option>
            </select>
          </div>
        </div>

        {/* Box containing dynamic content */}
        <div className="border p-6 rounded-md shadow-lg mx-auto mt-6 max-w-7xl bg-white">
          {renderDynamicContent()}

          {/* Input Fields */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="orderNo" className="block text-gray-700 font-medium mb-2">Order No</label>
                <input
                  id="orderNo"
                  type="text"
                  value={formData.orderNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Order No"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="route" className="block text-gray-700 font-medium mb-2">Route</label>
                <div className="flex gap-2">
                  <input
                    id="fromRoute"
                    type="text"
                    value={formData.fromRoute}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="From"
                  />
                  <input
                    id="toRoute"
                    type="text"
                    value={formData.toRoute}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Other Fields */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="shipmentReadyDate" className="block text-gray-700 font-medium mb-2">Shipment Ready Date</label>
                <input
                  id="shipmentReadyDate"
                  type="date"
                  value={formData.shipmentReadyDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="term" className="block text-gray-700 font-medium mb-2">Term</label>
                <input
                  id="term"
                  type="text"
                  value={formData.term}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Term"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="type" className="block text-gray-700 font-medium mb-2">Type</label>
                <input
                  id="type"
                  type="text"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Type"
                />
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div className="flex justify-center mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
              onClick={handlePreview}
            >
              <span>Preview Table Data</span>
            </button>
          </div>

          {/* Table */}
          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="border border-gray-300 p-2">Order No</th>
                    <th className="border border-gray-300 p-2">Route</th>
                    <th className="border border-gray-300 p-2">Shipment Ready Date</th>
                    <th className="border border-gray-300 p-2">Term</th>
                    <th className="border border-gray-300 p-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData && (
                    <tr>
                      <td className="border border-gray-300 p-2">{previewData.orderNo}</td>
                      <td className="border border-gray-300 p-2">{`${previewData.fromRoute} to ${previewData.toRoute}`}</td>
                      <td className="border border-gray-300 p-2">{previewData.shipmentReadyDate}</td>
                      <td className="border border-gray-300 p-2">{previewData.term}</td>
                      <td className="border border-gray-300 p-2">{previewData.type}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InProgress;
