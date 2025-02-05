import React, { useState } from 'react';
import Header from './Header';

// Define options as constants
const ORDER_TYPES = {
  EXPORT: 'Export',
  IMPORT: 'Import'
};

const SHIPMENT_TYPES = {
  AIR_FREIGHT: 'Air Freight',
  LCL: 'LCL',
  FCL: 'FCL'
};

const ShipmentForm = () => {
  // Consolidated form state
  const [formData, setFormData] = useState({
    orderType: '',
    shipmentType: '',
    orderNumber: '',
    additionalDetails: {
      field1: '',
      field2: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
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

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        orderType: '',
        shipmentType: '',
        orderNumber: '',
        additionalDetails: { field1: '', field2: '' }
      });
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
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-16">
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
                required
                aria-describedby={errors.orderType ? 'orderType-error' : undefined}
              >
                <option value="">Select Order Type</option>
                {Object.entries(ORDER_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
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
                required
                aria-describedby={errors.shipmentType ? 'shipmentType-error' : undefined}
              >
                <option value="">Select Shipment Type</option>
                {Object.entries(SHIPMENT_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.shipmentType && (
                <p id="shipmentType-error" className="mt-1 text-sm text-red-500">
                  {errors.shipmentType}
                </p>
              )}
            </div>

            {/* Order Number Input */}
            <div className="form-group">
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.orderNumber ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                required
                aria-describedby={errors.orderNumber ? 'orderNumber-error' : undefined}
              />
              {errors.orderNumber && (
                <p id="orderNumber-error" className="mt-1 text-sm text-red-500">
                  {errors.orderNumber}
                </p>
              )}
            </div>

            {/* Additional Details Section */}
            {formData.orderType && formData.shipmentType && (
              <fieldset className="mt-6">
                <legend className="text-xl font-semibold mb-4">Additional Details</legend>
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="field1" className="block text-sm font-medium text-gray-700">
                      Field 1
                    </label>
                    <input
                      type="text"
                      id="field1"
                      name="additionalDetails.field1"
                      value={formData.additionalDetails.field1}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="field2" className="block text-sm font-medium text-gray-700">
                      Field 2
                    </label>
                    <input
                      type="text"
                      id="field2"
                      name="additionalDetails.field2"
                      value={formData.additionalDetails.field2}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                </div>
              </fieldset>
            )}

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
      </div>
    </>
  );
};

export default ShipmentForm;