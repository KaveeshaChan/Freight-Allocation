import React, { useState } from 'react';
import Layout from './Main_Layout';

const InProgress = () => {
  const [formData, setFormData] = useState({
    orderNo: '',
    fromRoute: '',
    toRoute: '',
    shipmentReadyDate: '',
    term: '',
    type: '',
    shipmentType: '', // Added for shipment type
  });

  const [tableData, setTableData] = useState([]);
  const [previewData, setPreviewData] = useState(null); // Store the previewed data
  const [showTable, setShowTable] = useState(false); // Control table visibility

  const handleInputChange = (e) => {
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
    setTableData((prevData) => [...prevData, previewData]); // Add the preview data to the table
    setFormData({
      orderNo: '',
      fromRoute: '',
      toRoute: '',
      shipmentReadyDate: '',
      term: '',
      type: '',
      shipmentType: '', // Reset the shipment type field
    });
    setPreviewData(null); // Clear the preview after submitting
    setShowTable(false); // Hide the table after submission
  };

  return (
    <Layout>
      <div className="p-4 mt-8">
        <div className="flex items-center mb-6"> {/* Using flex to align elements inline */}
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            style={{ transition: 'all 0.3s ease' }}
          >
            Add Document
          </button>

          {/* Order type selection button immediately after the Add Document button */}
          <div className="ml-4"> {/* Margin added to separate the button and select, can be adjusted as needed */}
            <label htmlFor="order-type" className="block text-gray-700 font-medium mr-4 inline">
              Select Order Type:
            </label>
            <select
              id="order-type"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="import">Import</option>
              <option value="export">Export</option>
            </select>
          </div>

          {/* Shipment Type selection */}
          <div className="ml-4"> {/* Margin added for spacing */}
            <label htmlFor="shipmentType" className="block text-gray-700 font-medium mr-4 inline">
              Shipment Type:
            </label>
            <select
              id="shipmentType"
              value={formData.shipmentType}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="airFreight">Air Freight</option>
              <option value="lcl">LCL</option>
              <option value="fcl">FCL</option>
            </select>
          </div>
        </div>

        {/* Box containing input fields and preview button */}
        <div className="border p-6 rounded-md shadow-lg mx-auto mt-6 max-w-7xl bg-white">
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

          {/* Preview Button - Centered and with a dropdown icon */}
          <div className="flex justify-center mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
              onClick={handlePreview}
            >
              <span>Preview Table Data</span>
              {/* Dropdown Icon */}
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.23a1 1 0 011.41 0L10 10.586l3.36-3.357a1 1 0 111.42 1.413l-4 4a1 1 0 01-1.42 0l-4-4a1 1 0 010-1.413z"
                  clipRule="evenodd"
                />
              </svg>
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
                    <th className="border border-gray-300 p-2">Carrier</th>
                    <th className="border border-gray-300 p-2">Agent</th>
                    <th className="border border-gray-300 p-2">Net Freight Per Container (USD)</th>
                    <th className="border border-gray-300 p-2">DO Fee</th>
                    <th className="border border-gray-300 p-2">Free Time</th>
                    <th className="border border-gray-300 p-2">Transshipment Port</th>
                    <th className="border border-gray-300 p-2">Transit Time</th>
                    <th className="border border-gray-300 p-2">Vessel Details</th>
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
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Always Visible Submit Button */}
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
