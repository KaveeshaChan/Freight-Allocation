import React from 'react';

const CommonFields = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-orderNumber" className="block text-sm font-medium mb-2 text-black">
            1. Order Number
          </label>
        </div>
        <input
          type="text"
          name="orderNumber"
          value={formData.orderNumber || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-orderNumber"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the order number"
          aria-label="Order Number"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="route" className="block text-sm font-medium mb-2 text-black">
            2. Route
          </label>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              name="routeFrom"
              value={formData.routeFrom || ""}
              onChange={handleInputChange}
              id="hs-floating-underline-input-routeFrom"
              className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
              placeholder="From"
              aria-label="Route From"
            />
          </div>
          <span className="text-sm text-black my-auto">-</span>
          <div className="flex-1 relative">
            <input
              type="text"
              name="routeTo"
              value={formData.routeTo || ""}
              onChange={handleInputChange}
              id="hs-floating-underline-input-routeTo"
              className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
              placeholder="To"
              aria-label="Route To"
            />
          </div>
        </div>
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-shipmentReadyDate" className="block text-sm font-medium mb-2 text-black">
            3. Shipment Ready Date
          </label>
        </div>
        <input
          type="date"
          name="shipmentReadyDate"
          value={formData.shipmentReadyDate || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-shipmentReadyDate"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="DD/MM/YYYY"
          aria-label="Shipment Ready Date"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-DeliveryTerm" className="block text-sm font-medium mb-2 text-black">
            4. Delivery Term
          </label>
        </div>
        <input
          type="text"
          name="DeliveryTerm"
          value={formData.DeliveryTerm || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-DeliveryTerm"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the Delivery Term"
          aria-label="Delivery Term"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-type" className="block text-sm font-medium mb-2 text-black">
            5. Type
          </label>
        </div>
        <input
          type="text"
          name="type"
          value={formData.type || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-type"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the type"
          aria-label="Type"
        />
      </div>
    </>
  );
};

export default CommonFields;
