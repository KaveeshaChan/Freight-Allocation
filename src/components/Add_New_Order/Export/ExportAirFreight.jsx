import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFileUpload } from '../fileUploadHandler';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text", disabled = false, style = {} }) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-[#2C2C2C]">
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
      className={`w-full px-4 py-3 rounded-lg border border-[#F4F4F4] focus:border-[#0534F0] focus:ring-2 focus:ring-[#0534F0]/20 transition-colors ${
        disabled ? "bg-[#F4F4F4] text-[#2C2C2C]/50" : "bg-white text-[#2C2C2C]"
      } placeholder-[#2C2C2C]/50`}
      placeholder={placeholder}
    />
    {error && <p className="text-[#E63946] text-sm mt-1">{error}</p>}
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
    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8">Export Air Freight Details</h2>

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
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-[#2C2C2C]">Route</label>
        <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-6 mb-6">
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
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-[#2C2C2C]">Cargo Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleCargoTypeChange({ target: { name: 'cargoType', value: 'PalletizedCargo' } })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.cargoType === 'PalletizedCargo' 
                ? 'border-[#98009E] bg-[#98009E]/10' 
                : 'border-[#F4F4F4] hover:border-[#98009E]/30'
            }`}
          >
            <span className={`font-medium ${
              formData.cargoType === 'PalletizedCargo' ? 'text-[#98009E]' : 'text-[#2C2C2C]'
            }`}>Palletized Cargo</span>
          </button>
          <button
            type="button"
            onClick={() => handleCargoTypeChange({ target: { name: 'cargoType', value: 'LooseCargo' } })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              formData.cargoType === 'LooseCargo' 
                ? 'border-[#5F72F3] bg-[#5F72F3]/10' 
                : 'border-[#F4F4F4] hover:border-[#5F72F3]/30'
            }`}
          >
            <span className={`font-medium ${
              formData.cargoType === 'LooseCargo' ? 'text-[#5F72F3]' : 'text-[#2C2C2C]'
            }`}>Loose Cargo</span>
          </button>
        </div>
        {errors.cargoType && <p className="text-[#E63946] text-sm mt-1">{errors.cargoType}</p>}
      </div>

      {/* Weights Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
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
      <InputField
        label="Number of Pallets"
        name="noOfPallets"
        value={formData.noOfPallets}
        placeholder="Enter the number of pallets"
        onChange={handleInputChange}
        error={errors.noOfPallets}
        disabled={formData.cargoType === "LooseCargo"}
        style={formData.cargoType === "LooseCargo" ? { backgroundColor: '#D3D3D3' } : {}}
        type="number"
      />

      {/* Target Date */}
      <InputField
        label="Target Date"
        name="targetDate"
        value={formData.targetDate}
        placeholder="DD/MM/YYYY"
        onChange={handleInputChange}
        error={errors.targetDate}
        type="date"
      />

      {/* Due Date */}
      <InputField
        label="• Number of dates to fill Document "
        name="dueDate"
        value={formData.dueDate}
        placeholder="Enter the Due Date"
        type="number"
        min="1"
        max="99"  // Limit to 2 digits
        step="1"   // Only allow whole numbers
        onChange={(e) => {
          // Ensure only whole numbers up to 2 digits
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
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-[#2C2C2C]">Upload File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full border-2 border-dashed border-[#F4F4F4] hover:border-[#0534F0] rounded-lg transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-[#0534F0]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-[#2C2C2C]">
                <span className="text-[#0534F0] font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#2C2C2C]/50 mt-1">XLS, XLSX (MAX. 5MB)</p>
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
          <div className="mt-2 text-sm text-[#2C2C2C] flex items-center">
            <svg className="h-4 w-4 mr-2 text-[#00B8D9]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {fileName}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="w-full mb-4">
        <label htmlFor="additionalNotes" className="block text-sm font-medium mb-1 text-black">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          id="additionalNotes"
          value={formData.additionalNotes || ""}
          onChange={handleInputChange}
          className="py-2 px-3 block w-full bg-gray-200 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter any additional notes here..."
          rows="3"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:from-[#5F72F3] hover:to-[#C057CB] text-white rounded-lg font-medium transition-all transform hover:scale-[1.01]"
      >
        Create Order
      </button>

       {/* Popups remain similar with updated colors */}
       {showErrorPopup && (
        <div className="fixed inset-0 bg-[#2C2C2C]/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-[#E63946]/10 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C]">Validation Error</h3>
            </div>
            <p className="text-[#2C2C2C]/70 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full py-2 px-4 bg-[#F4F4F4] hover:bg-[#E63946]/10 text-[#E63946] rounded-lg transition-colors"
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
