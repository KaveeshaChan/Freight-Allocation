import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import Header from '../../Layouts/Main_Layout';
import ExportAirFreight from '../Export/AirFreight';
import ExportLCL from '../Export/LCL';
import ExportFCL from '../Export/FCL';
import ImportFCL from '../Import/FCL';
import ImportAirFreight from '../Import/AirFreight';
import ImportLCL from '../Import/LCL';

const SHIPMENT_TYPE_MAP = {
  airFreight: 'Air Freight',
  lcl: 'LCL',
  fcl: 'FCL'
};

const ORDER_TYPE_MAP = {
  export: 'Export',
  import: 'Import'
};

const OrderSummary = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    orderType: '',
    shipmentType: '',
    orderNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showScreen, setShowScreen] = useState(Boolean(location.state?.order));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const status = "pending";

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
        }
        const response = await fetch(`http://localhost:5056/api/select/view-orders/exporter?status=${status}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAvailableOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching available orders:', error.message);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized. Redirecting to login.');
        }
      }
    };
  
    fetchAvailableOrders();
  }, []);

  useEffect(() => {
    if (location.state?.order) {
      const order = location.state.order;
      setFormData({
        orderType: ORDER_TYPE_MAP[order.orderType] || '',
        shipmentType: SHIPMENT_TYPE_MAP[order.shipmentType] || '',
        orderNumber: order.orderNumber || ''
      });
      setSelectedOrder(order);
      setShowScreen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const rawOrderType = Object.keys(ORDER_TYPE_MAP).find(
      (key) => ORDER_TYPE_MAP[key] === formData.orderType
    );
    const rawShipmentType = Object.keys(SHIPMENT_TYPE_MAP).find(
      (key) => SHIPMENT_TYPE_MAP[key] === formData.shipmentType
    );

    setFilteredOrders(
      availableOrders.filter((item) => {
        const matchOrderType = !rawOrderType
          || item.orderType.toLowerCase() === rawOrderType.toLowerCase();
        const matchShipmentType = !rawShipmentType
          || item.shipmentType.toLowerCase() === rawShipmentType.toLowerCase();

        return matchOrderType && matchShipmentType;
      })
    );
  }, [formData.orderType, formData.shipmentType, availableOrders]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'orderNumber') {
      const selectedOrder = availableOrders.find(
        (item) => item.orderNumber.toString() === value
      );
      if (selectedOrder) {
        setFormData((prev) => ({
          ...prev,
          orderNumber: value,
          orderType: ORDER_TYPE_MAP[selectedOrder.orderType] || prev.orderType,
          shipmentType: SHIPMENT_TYPE_MAP[selectedOrder.shipmentType] || prev.shipmentType
        }));
        setSelectedOrder(selectedOrder);
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
    } else if (!/^[A-Z0-9 -]+$/i.test(formData.orderNumber)) {
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
      setShowScreen(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setShowScreen(false);
    setSubmitSuccess(false);
    setFormData({ orderType: '', shipmentType: '', orderNumber: '' });
    setSelectedOrder(null);
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '44px',
      borderRadius: '8px',
      borderColor: state.isFocused ? '#6366f1' : errors.orderNumber ? '#ef4444' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#6366f1' : '#d1d5db'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#e0e7ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937'
    })
  };

  return (
    <div>
      <Header />
      <main className="mt-16">
        <div className={`mx-auto p-8 bg-white rounded-xl shadow-sm transition-all duration-200 ${showScreen ? 'max-w-8xl' : 'max-w-3xl'}`}>
          {!showScreen ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
                <p className="mt-2 text-gray-600">Select order details to view comprehensive summary</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="orderType"
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.orderType ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    >
                      <option value="">Select Order Type</option>
                      {Object.values(ORDER_TYPE_MAP).map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.orderType && (
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="text-red-500 h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {errors.orderType && (
                    <p className="mt-2 flex items-center text-sm text-red-600">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.orderType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="shipmentType"
                      name="shipmentType"
                      value={formData.shipmentType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.shipmentType ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    >
                      <option value="">Select Shipment Type</option>
                      {Object.values(SHIPMENT_TYPE_MAP).map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.shipmentType && (
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="text-red-500 h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {errors.shipmentType && (
                    <p className="mt-2 flex items-center text-sm text-red-600">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.shipmentType}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number <span className="text-red-500">*</span>
                  </label>
                  <Select
                    id="orderNumber"
                    name="orderNumber"
                    value={filteredOrders.find(order => 
                      new RegExp(`^${order.orderNumber?.toString().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i').test(formData.orderNumber)
                    ) ? { 
                      value: formData.orderNumber,
                      label: `${formData.orderNumber} - ${formData.orderType} - ${formData.shipmentType}`
                    } : null}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : '';
                      handleInputChange({ target: { name: 'orderNumber', value } });
                    }}
                    options={filteredOrders.map((item) => ({
                      value: item.orderNumber,
                      label: `${item.orderNumber} - ${ORDER_TYPE_MAP[item.orderType]} - ${SHIPMENT_TYPE_MAP[item.shipmentType]}`
                    }))}
                    styles={customStyles}
                    classNamePrefix="react-select"
                    placeholder="Search order number..."
                    noOptionsMessage={() => "No orders found"}
                  />
                  {errors.orderNumber && (
                    <p className="mt-2 flex items-center text-sm text-red-600">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.orderNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'View Order Summary'
                  )}
                </button>
              </div>

              {submitSuccess && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center">
                  <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-green-700">Order details loaded successfully!</span>
                </div>
              )}

              {errors.submit && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center">
                  <FiXCircle className="h-6 w-6 text-red-500 mr-3" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              )}

              {selectedOrder && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center">
                  <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-green-700">Order selected successfully!</span>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6 -mt-16">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <button
                  onClick={handleResetForm}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="mr-2 h-5 w-5" />
                  Back to Search
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {formData.orderType === ORDER_TYPE_MAP.export && (
                  <>
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.airFreight && <ExportAirFreight order={selectedOrder} />}
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.lcl && <ExportLCL order={selectedOrder} />}
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.fcl && <ExportFCL order={selectedOrder} />}
                  </>
                )}
                {formData.orderType === ORDER_TYPE_MAP.import && (
                  <>
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.airFreight && <ImportAirFreight order={selectedOrder} />}
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.lcl && <ImportLCL order={selectedOrder} />}
                    {formData.shipmentType === SHIPMENT_TYPE_MAP.fcl && <ImportFCL order={selectedOrder} />}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderSummary;