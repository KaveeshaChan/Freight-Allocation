import React from 'react';

const CommonFields = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* Order Number and Route in one line */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="col-span-1">
          <label htmlFor="hs-floating-underline-input-orderNumber" className="block text-sm font-medium mb-2 text-black">
            1. Order Number
          </label>
          <input
            type="text"
            name="orderNumber"
            value={formData.orderNumber || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-orderNumber"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Enter the order number"
            aria-label="Order Number"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="route" className="block text-sm font-medium mb-2 text-black">
            2. Route
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                name="routeFrom"
                value={formData.routeFrom || ""}
                onChange={handleInputChange}
                id="hs-floating-underline-input-routeFrom"
                className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="From"
                aria-label="Route From"
              />
            </div>
            <span className="text-sm text-black my-auto">-</span>
            <div className="flex-1">
              <input
                type="text"
                name="routeTo"
                value={formData.routeTo || ""}
                onChange={handleInputChange}
                id="hs-floating-underline-input-routeTo"
                className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="To"
                aria-label="Route To"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Ready Date, Delivery Term, and Type in one line */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <label htmlFor="hs-floating-underline-input-shipmentReadyDate" className="block text-sm font-medium mb-2 text-black">
            3. Shipment Ready Date
          </label>
          <input
            type="date"
            name="shipmentReadyDate"
            value={formData.shipmentReadyDate || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-shipmentReadyDate"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="DD/MM/YYYY"
            aria-label="Shipment Ready Date"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="hs-floating-underline-input-DeliveryTerm" className="block text-sm font-medium mb-2 text-black">
            4. Delivery Term
          </label>
          <input
            type="text"
            name="DeliveryTerm"
            value={formData.DeliveryTerm || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-DeliveryTerm"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Enter the Delivery Term"
            aria-label="Delivery Term"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="hs-floating-underline-input-type" className="block text-sm font-medium mb-2 text-black">
            5. Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-type"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Enter the type"
            aria-label="Type"
          />
        </div>
      </div>
    </>
  );
};

export default CommonFields;
