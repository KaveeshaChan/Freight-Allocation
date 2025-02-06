import React, { useState, useEffect } from 'react';
import Header from './Header';
import ExportAirFreight from './Export/AirFreight';
import ExportLCL from './Export/LCL';
import ExportFCL from './Export/FCL';
import ImportFCL from './Import/FCL';
import ImportAirFreight from './Import/AirFreight';
import ImportLCL from './Import/LCL';

const SHIPMENT_TYPE_MAP = {
  airFreight: 'Air Freight',
  lcl: 'LCL',
  fcl: 'FCL'
};

const ORDER_TYPE_MAP = {
  export: 'Export',
  import: 'Import'
};

const ordersData = [
  // Your orders data
];

const ShipmentForm = ({ selectedOrder }) => {
  const [formData, setFormData] = useState({
    orderType: '',
    shipmentType: '',
    orderNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setFormData({
        orderType: ORDER_TYPE_MAP[selectedOrder.OrderType] || '',
        shipmentType: SHIPMENT_TYPE_MAP[selectedOrder.ShipmentType] || '',
        orderNumber: selectedOrder.OrderNumber.toString()
      });
      setShowScreen(true);
    }
  }, [selectedOrder]);

  // Filtered orders for the dropdown
  const [filteredOrders, setFilteredOrders] = useState(ordersData);

  useEffect(() => {
    const rawOrderType = Object.keys(ORDER_TYPE_MAP).find(
      (key) => ORDER_TYPE_MAP[key] === formData.orderType
    );
    const rawShipmentType = Object.keys(SHIPMENT_TYPE_MAP).find(
      (key) => SHIPMENT_TYPE_MAP[key] === formData.shipmentType
    );

    setFilteredOrders(
      ordersData.filter((item) => {
        const matchOrderType = !rawOrderType
          || item.OrderType.toLowerCase() === rawOrderType.toLowerCase();
        const matchShipmentType = !rawShipmentType
          || item.ShipmentType.toLowerCase() === rawShipmentType.toLowerCase();
        return matchOrderType && matchShipmentType;
      })
    );
  }, [formData.orderType, formData.shipmentType]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'orderNumber') {
      const selectedOrder = ordersData.find(
        (item) => item.OrderNumber.toString() === value
      );
      if (selectedOrder) {
        setFormData((prev) => ({
          ...prev,
          orderNumber: value,
          orderType: ORDER_TYPE_MAP[selectedOrder.OrderType] || prev.orderType,
          shipmentType: SHIPMENT_TYPE_MAP[selectedOrder.ShipmentType] || prev.shipmentType
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderType) {
      newErrors.orderType = 'Order type is required';
    }
    if (!formData.shipmentType) {
      newErrors.shipmentType = 'Shipment type is required';
    }
    if (!formData.orderNumber) {
      newErrors.orderNumber = 'Order number is required';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.orderNumber)) {
      newErrors.orderNumber = 'Invalid order number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={`mx-auto p-6 bg-white rounded-lg shadow-md mt-16 ${showScreen ? 'max-w-8xl' : 'max-w-6xl'}`}>
        {!showScreen ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {/* Order Type Select */}
              <div className="form-group">
                <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                  Order Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="orderType"
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.orderType ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                  aria-describedby={errors.orderType ? 'orderType-error' : undefined}
                >
                  <option value="">Select Order Type</option>
                  {Object.values(ORDER_TYPE_MAP).map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.orderType && (
                  <p id="orderType-error" className="mt-1 text-sm text-red-500">
                    {errors.orderType}
                  </p>
                )}
              </div>

              {/* Shipment Type Select */}
              <div className="form-group">
                <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700">
                  Shipment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="shipmentType"
                  name="shipmentType"
                  value={formData.shipmentType}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.shipmentType ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                  aria-describedby={errors.shipmentType ? 'shipmentType-error' : undefined}
                >
                  <option value="">Select Shipment Type</option>
                  {Object.values(SHIPMENT_TYPE_MAP).map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.shipmentType && (
                  <p id="shipmentType-error" className="mt-1 text-sm text-red-500">
                    {errors.shipmentType}
                  </p>
                )}
              </div>

              {/* Order Number Select */}
              <div className="form-group">
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <select
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.orderNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                  aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
                >
                  <option value="">Select Order Number</option>
                  {filteredOrders.map((item) => (
                    <option key={item.OrderNumber} value={item.OrderNumber}>
                      {item.OrderNumber}
                    </option>
                  ))}
                </select>
                {errors.orderNumber && (
                  <p id="orderNumber-error" className="mt-1 text-sm text-red-500">
                    {errors.orderNumber}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600">Form submitted successfully!</p>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>
          </form>
        ) : (
          // Render the relevant screen based on orderType and shipmentType
          <>
            {formData.orderType === ORDER_TYPE_MAP.export && formData.shipmentType === SHIPMENT_TYPE_MAP.airFreight && (
              <ExportAirFreight order={selectedOrder} />
            )}
            {formData.orderType === ORDER_TYPE_MAP.export && formData.shipmentType === SHIPMENT_TYPE_MAP.lcl && (
              <ExportLCL order={selectedOrder} />
            )}
            {formData.orderType === ORDER_TYPE_MAP.export && formData.shipmentType === SHIPMENT_TYPE_MAP.fcl && (
              <ExportFCL order={selectedOrder} />
            )}
            {formData.orderType === ORDER_TYPE_MAP.import && formData.shipmentType === SHIPMENT_TYPE_MAP.airFreight && (
              <ImportAirFreight order={selectedOrder} />
            )}
            {formData.orderType === ORDER_TYPE_MAP.import && formData.shipmentType === SHIPMENT_TYPE_MAP.lcl && (
              <ImportLCL order={selectedOrder} />
            )}
            {formData.orderType === ORDER_TYPE_MAP.import && formData.shipmentType === SHIPMENT_TYPE_MAP.fcl && (
              <ImportFCL order={selectedOrder} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ShipmentForm;