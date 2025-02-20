import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFileUpload } from '../fileUploadHandler';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text", disabled = false, style = {} }) => (
  <div className={`mb-6 ${disabled ? "opacity-50" : ""}`}>
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-gray-800">
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
      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
        disabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-800"
      } ${error ? "border-red-500 focus:border-red-600 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"} placeholder-gray-400`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ExportAirFreight = ({ formData, handleInputChange, orderType, shipmentType }) => {
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please fill all required fields");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
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
    if (!formData.chargeableWeight) formErrors.chargeableWeight = "Chargeable weight (Kg) is required";
    if (!formData.grossWeight) formErrors.grossWeight = "Gross weight is required";
    if (!formData.cargoType) formErrors.cargoType = "Cargo type is required";
    if (!formData.cargoCBM) formErrors.cargoCBM = "Cargo CBM is required";
    if (!formData.dueDate) formErrors.dueDate = "Due Date is required";
    if (formData.cargoType === "PalletizedCargo" && !formData.noOfPallets) formErrors.noOfPallets = "Number of pallets is required";
    if (!formData.targetDate) formErrors.targetDate = "Target date is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          orderType,
          shipmentType,
          orderNumber: formData.orderNumber,
          routeFrom: formData.routeFrom,
          routeTo: formData.routeTo,
          shipmentReadyDate: formData.shipmentReadyDate,
          deliveryTerm: formData.deliveryTerm,
          type: formData.type,
          cargoType: formData.cargoType,
          numberOfPallets: formData.noOfPallets || null,
          chargeableWeight: formData.chargeableWeight,
          dueDate: formData.dueDate,
          grossWeight: formData.grossWeight,
          cargoCBM: formData.cargoCBM,
          targetDate: formData.targetDate,
          additionalNotes: formData.additionalNotes || null,
          fileUpload: uploadedFile,
          fileName: fileName ? fileName.split('.')[0] : null,
          userId,
        };
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Navigate to login page
          return;
        }

        const response = await fetch(
          "http://localhost:5056/api/orderHandling/add-new-order/export-airFreight",
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
          return;
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        setShowSuccessPopup(true);
        resetForm();

      } catch (error) {
        setErrorMessage("Error:", error);
        setShowErrorPopup(true);
      }
    } else {
      setShowErrorPopup(true);
    }
  };

  const resetForm = () => {
    const resetFields = {
      orderNumber: "",
      chargeableWeight: "",
      routeFrom: "",
      routeTo: "",
      shipmentReadyDate: "",
      deliveryTerm: "",
      type: "",
      grossWeight: "",
      cargoType: "",
      dueDate: "",
      cargoCBM: "",
      noOfPallets: "",
      targetDate: "",
      additionalNotes: "",
      fileUpload: "",
      fileName: "",
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
    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
  {/* Order Number */}
  <InputField
    label="Order Number"
    name="orderNumber"
    value={formData.orderNumber}
    placeholder="Enter order number"
    onChange={handleInputChange}
    error={errors.orderNumber}
  />

      {/* Route */}
      <div className="mb-4">
    <label className="block text-sm font-medium mb-2 text-gray-800">Route</label>
    <div className="grid grid-cols-2 gap-3">
      <InputField
        name="routeFrom"
        value={formData.routeFrom}
        placeholder="From"
        onChange={handleInputChange}
        error={errors.routeFrom}
      />
      <InputField
        name="routeTo"
        value={formData.routeTo}
        placeholder="To"
        onChange={handleInputChange}
        error={errors.routeTo}
      />
    </div>
  </div>

      {/* Date and Term Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
    <InputField
      label="Shipment Ready Date"
      name="shipmentReadyDate"
      value={formData.shipmentReadyDate}
      type="date"
      onChange={handleInputChange}
      error={errors.shipmentReadyDate}
    />
    <InputField
      label="Delivery Term"
      name="deliveryTerm"
      value={formData.deliveryTerm}
      placeholder="Enter delivery term"
      onChange={handleInputChange}
      error={errors.deliveryTerm}
    />
  </div>

      {/* Type */}
      <InputField
    label="Type"
    name="type"
    value={formData.type}
    placeholder="Enter the type"
    onChange={handleInputChange}
    error={errors.type}
  />

      {/* Cargo Type */}
      <div className="mb-4">
    <label className="block text-sm font-medium mb-2 text-gray-800">Cargo Type</label>
    <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleCargoTypeChange({ target: { name: 'cargoType', value: 'PalletizedCargo' } })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.cargoType === 'PalletizedCargo' 
                ? 'border-purple-600 bg-purple-100' 
                : 'border-gray-300 hover:border-purple-600'
            }`}
          >
            <span className={`font-medium ${
              formData.cargoType === 'PalletizedCargo' ? 'text-purple-600' : 'text-gray-800'
            }`}>Palletized Cargo</span>
          </button>
          <button
            type="button"
            onClick={() => handleCargoTypeChange({ target: { name: 'cargoType', value: 'LooseCargo' } })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.cargoType === 'LooseCargo' 
                ? 'border-blue-600 bg-blue-100' 
                : 'border-gray-300 hover:border-blue-600'
            }`}
          >
            <span className={`font-medium ${
              formData.cargoType === 'LooseCargo' ? 'text-blue-600' : 'text-gray-800'
            }`}>Loose Cargo</span>
          </button>
          </div>
    {errors.cargoType && <p className="text-red-500 text-sm mt-1">{errors.cargoType}</p>}
  </div>

      {/* Weights Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
    <InputField
      label="Chargeable Weight (Kg)"
      name="chargeableWeight"
      value={formData.chargeableWeight}
      placeholder="Enter weight"
      onChange={handleInputChange}
      error={errors.chargeableWeight}
      type="number"
    />
    <InputField
      label="Gross Weight (Kg)"
      name="grossWeight"
      value={formData.grossWeight}
      placeholder="Enter weight"
      onChange={handleInputChange}
      error={errors.grossWeight}
      type="number"
    />
  </div>

      {/* Cargo CBM */}
      <InputField
    label="Cargo CBM"
    name="cargoCBM"
    value={formData.cargoCBM}
    placeholder="Enter the Cargo CBM"
    onChange={handleInputChange}
    error={errors.cargoCBM}
  />

      {/* Number of Pallets */}
      <div className="mt-4">
    <InputField
      label="Number of Pallets"
      name="noOfPallets"
      value={formData.noOfPallets}
      placeholder="Enter the number of pallets"
      onChange={handleInputChange}
      error={errors.noOfPallets}
      disabled={formData.cargoType === "LooseCargo"}
      style={formData.cargoType === "LooseCargo" ? { backgroundColor: '#E5E7EB' } : {}}
      type="number"
    />
  </div>

      {/* Target Date */}
      <InputField
    label="Target Date"
    name="targetDate"
    value={formData.targetDate}
    onChange={handleInputChange}
    error={errors.targetDate}
    type="date"
  />

      {/* Due Date */}
      <InputField
    label="Due Date (Days)"
    name="dueDate"
    value={formData.dueDate}
    placeholder="Enter days"
    type="number"
    min="1"
    max="99"
    step="1"
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
      handleInputChange({
        target: {
          name: 'dueDate',
          value: value ? parseInt(value) : ''
        }
      });
    }}
    error={errors.dueDate}
  />

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-800">Upload File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-blue-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-gray-800">
                <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">XLS, XLSX (MAX. 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden"
              onChange={onFileUpload}
              accept=".xls, .xlsx"
            />
          </label>
        </div>
        {uploadedFile && (
          <div className="mt-2 text-sm text-gray-800 flex items-center">
            <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {fileName}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="w-full mb-4">
    <textarea
      name="additionalNotes"
      id="additionalNotes"
      value={formData.additionalNotes || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2.5 rounded-lg border-2 border-[#EDF2F7] focus:border-[#0534F0] focus:ring-2 focus:ring-[#0534F0]/10 transition-all placeholder-[#A0AEC0]"
      placeholder="Enter any additional notes here..."
      rows="3"
    />
  </div>

      {/* Submit Button */}
      <button
    type="submit"
    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
  >
    Create Order
  </button>

  
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
            <div className="flex items-center mb-4">
              <div className="bg-[#38B000]/10 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-[#38B000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C]">Order Created!</h3>
            </div>
            <p className="text-[#2C2C2C]/70 mb-6">Your order has been successfully submitted.</p>
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
  );
};

export default ExportAirFreight;
