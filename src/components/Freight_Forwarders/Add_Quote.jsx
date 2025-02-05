import React, { useState } from 'react';
import Header from './Header';

const ShipmentForm = () => {
  const [orderType, setOrderType] = useState('');
  const [shipmentType, setShipmentType] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleShipmentTypeChange = (event) => {
    setShipmentType(event.target.value);
  };

  const handleOrderNumberChange = (event) => {
    setOrderNumber(event.target.value);
  };

  const handleSubmit = () => {
    console.log({
      orderType,
      shipmentType,
      orderNumber,
    });
  };

  return (
    <Header>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="order-type" className="block text-sm font-medium text-gray-700">
            Order Type
          </label>
          <select
            id="order-type"
            value={orderType}
            onChange={handleOrderTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select Order Type</option>
            <option value="Export">Export</option>
            <option value="Import">Import</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="shipment-type" className="block text-sm font-medium text-gray-700">
            Shipment Type
          </label>
          <select
            id="shipment-type"
            value={shipmentType}
            onChange={handleShipmentTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select Shipment Type</option>
            <option value="Air Freight">Air Freight</option>
            <option value="LCL">LCL</option>
            <option value="FCL">FCL</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="order-number" className="block text-sm font-medium text-gray-700">
            Order Number
          </label>
          <input
            type="text"
            id="order-number"
            value={orderNumber}
            onChange={handleOrderNumberChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>

        {orderType && shipmentType && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
            <div className="mb-4">
              <label htmlFor="field1" className="block text-sm font-medium text-gray-700">
                Field 1
              </label>
              <input
                type="text"
                id="field1"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="field2" className="block text-sm font-medium text-gray-700">
                Field 2
              </label>
              <input
                type="text"
                id="field2"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </Header>
  );
};

export default ShipmentForm;