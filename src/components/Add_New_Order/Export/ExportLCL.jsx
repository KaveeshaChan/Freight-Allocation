import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFileUpload } from '../fileUploadHandler';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text", disabled = false, style = {} }) => (
  <div className={`mb-6 ${disabled ? "opacity-50" : ""}`}>
    <label htmlFor={name} className="block text-xs font-medium mb-2 text-gray-800">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      id={name}
      disabled={disabled}
      style={style}
      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
        disabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-800"
      } ${error ? "border-red-500 focus:border-red-600 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"} placeholder-gray-400`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ExportLCL = ({ formData, handleInputChange, orderType, shipmentType }) => {
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please fill all required fields");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const onFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    try {
      await handleFileUpload(file, setUploadedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage("Error uploading file:", error);
      setShowErrorPopup(true);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.orderNumber) formErrors.orderNumber = "Order number is required";
    if (!formData.routeFrom) formErrors.routeFrom = "Route from is required";
    if (!formData.routeTo) formErrors.routeTo = "Route to is required";
    if (!formData.shipmentReadyDate) formErrors.shipmentReadyDate = "Shipment ready date is required";
    if (!formData.deliveryTerm) formErrors.deliveryTerm = "Delivery term is required";
    if (!formData.type) formErrors.type = "Type is required";
    if (!formData.palletCBM) formErrors.palletCBM = "Pallet CBM is required";
    if (!formData.cargoCBM) formErrors.cargoCBM = "Cargo CBM is required";
    if (!formData.grossWeight) formErrors.grossWeight = "Gross weight is required";
    if (!formData.dueDate) formErrors.dueDate = "Due Date is required";

    if (!formData.noOfPallets) formErrors.noOfPallets = "Number of pallets is required";
    if (!formData.targetDate) formErrors.targetDate = "Target date is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Prepare the payload as an object
        const payload = {
          orderType,
          shipmentType,
          orderNumber: formData.orderNumber,
          routeFrom: formData.routeFrom,
          routeTo: formData.routeTo,
          shipmentReadyDate: formData.shipmentReadyDate,
          deliveryTerm: formData.deliveryTerm,
          type: formData.type,
          dueDate: formData.dueDate,

          numberOfPallets: formData.noOfPallets || null,
          palletCBM: formData.palletCBM,
          cargoCBM: formData.cargoCBM,
          grossWeight: formData.grossWeight,
          targetDate: formData.targetDate,
          additionalNotes: formData.additionalNotes || null,
          fileUpload: uploadedFile,
          fileName: fileName ? fileName.split('.')[0] : null,
          userId
        }

        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Navigate to login page
          return;
        }

        const response = await fetch(
          "http://localhost:5056/api/orderHandling/add-new-order/export-lcl",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message);
          setShowErrorPopup(true);
          setLoading(false);
          return;
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        setShowSuccessPopup(true);
        resetForm();

      } catch (error) {
        setErrorMessage("Error:", error);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowErrorPopup(true);
    }
  };

  const resetForm = () => {
    const resetFields = {
      orderNumber: '',
      routeFrom: '',
      routeTo: '',
      shipmentReadyDate: '',
      deliveryTerm: '',
      type: '',
      palletCBM: '',
      dueDate: "",

      cargoCBM: '',
      grossWeight: '',
      noOfPallets: '',
      targetDate: '',
      fileUpload: '',
      additionalNotes: '',
      fileName: ''
    };

    Object.keys(resetFields).forEach((field) =>
      handleInputChange({ target: { name: field, value: resetFields[field] } })
    );
    setUploadedFile(null);
    setErrors({});
  };

  const handleCargoTypeChange = (e) => {
    handleInputChange(e);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleFormSubmit} className="max-w-8xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-8">
       

        {/* Main Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Core Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Route Details
              </h3>
              <InputField
                label="Order Number"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                error={errors.orderNumber}
                icon="📌"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="routeFrom"
                  value={formData.routeFrom}
                  placeholder="Origin"
                  onChange={handleInputChange}
                  error={errors.routeFrom}
                  icon="🛫"
                />
                <InputField
                  name="routeTo"
                  value={formData.routeTo}
                  placeholder="Destination"
                  onChange={handleInputChange}
                  error={errors.routeTo}
                  icon="🛬"
                />
              </div>

<InputField
              label="Type"
              name="type"
              value={formData.type}
              placeholder="Enter the type"
              onChange={handleInputChange}
              error={errors.type}
            />
            </div>

            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Timeline
              </h3>
              <InputField
                label="Shipment Ready Date"
                name="shipmentReadyDate"
                type="date"
                value={formData.shipmentReadyDate}
                onChange={handleInputChange}
                error={errors.shipmentReadyDate}
              />
              <InputField
                label="ETA Date Client Destination"
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleInputChange}
                error={errors.targetDate}
              />
            </div>
          </div>

          {/* Middle Column - Cargo Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                Cargo Specifications
              </h3>
              
              <InputField
              label="Number of Pallets"
              type='number'
              name="noOfPallets"
              value={formData.noOfPallets}
              placeholder="Enter the number of pallets"
              onChange={handleInputChange}
              error={errors.noOfPallets}
            />

<InputField
              label="Gross Weight (Kg)"
              type='number'
              name="grossWeight"
              value={formData.grossWeight}
              placeholder="Enter the gross weight"
              onChange={handleInputChange}
              error={errors.grossWeight}
            />


<div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Pallet CBM"
                  type='number'
                  name="palletCBM"
                  value={formData.palletCBM}
                  onChange={handleInputChange}
                  error={errors.palletCBM}
                  
                />
                <InputField
                  label="Cargo CBM"
                  type='number'
                  name="cargoCBM"
                  value={formData.cargoCBM}
                  onChange={handleInputChange}
                  error={errors.cargoCBM}
                  
                />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Additional Details
              </h3>
              
              <InputField
                label="Delivery Terms"
                name="deliveryTerm"
                value={formData.deliveryTerm}
                onChange={handleInputChange}
                error={errors.deliveryTerm}
                icon="📑"
              />
              
              <InputField
                label="Due Date (Days)"
                type='number'
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                error={errors.dueDate}
                icon="⏳"
              />
              
              {/* Attachments Field */}
<div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>
  <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 transition-colors hover:border-blue-400">
    <input 
      type="file" 
      className="hidden"
      id="file-upload"
      onChange={onFileUpload}
      accept=".xls, .xlsx"
    />
    <label htmlFor="file-upload" className="cursor-pointer">
      <div className="text-center">
        <div className="text-4xl mb-2">📎</div>
        <p className="text-sm text-gray-600">
          {fileName || "Drag & drop files or click to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">XLS, XLSX (Max 5MB)</p>
      </div>
    </label>
  </div>
</div>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
                Additional Notes
              </h3>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                placeholder="Enter any special instructions..."
                rows="4"
              />
            </div>
          </div>
        </div>


        {/* Submit Section */}
        <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          onClick={handleFormSubmit}
          className={`w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Create Export-LCL Order'
          )}
        </button>
          </div>


         {/* Popups remain similar with updated colors */}
       {showErrorPopup && (
        <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Validation Error</h3>
            </div>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

{showSuccessPopup && (
        <div className="fixed inset-0 bg-[#2C2C2C]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center mt-3 mb-8">
              <div className="bg-[#38B000]/10 p-2 rounded-full">
                <svg className="w-6 h-6 text-[#38B000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#2C2C2C] mr-2">&nbsp;Hooray!</h3>
            </div>
            <p className="text-[#2C2C2C]/90 text-center mb-1">Your order has been successfully submitted.</p>
            <p className="text-[#2C2C2C]/50 text-center text-sm mb-6">*A notification email will be sent to all active freight forwarders.</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2 px-4 bg-[#38B000] hover:bg-[#38B000]/90 text-white rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </form>
    </div>
  );
};

export default ExportLCL;