import React, { useState } from 'react';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text", disabled = false, style = {} }) => (
  <div className="max-w-sm mb-6">
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-black">
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
      className={`py-3 px-4 block w-full ${disabled ? "bg-gray-400 text-gray-600" : "bg-gray-300 text-black"} placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const ImportAirFreight = ({ formData, handleInputChange, orderType, shipmentType }) => {
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
    if (formData.cargoType === "PalletizedCargo" && !formData.noOfPallets) formErrors.noOfPallets = "Number of pallets is required";
    if (!formData.targetDate) formErrors.targetDate = "Target date is required";
    if (!formData.length) formErrors.length = "Length is required";
    if (!formData.height) formErrors.height = "Height is required";
    if (!formData.width) formErrors.width = "Width is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setUploadedFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted!");

    if (validateForm()) {
      try {
        const formDataWithFile = new FormData();

        if (uploadedFile) {
          console.log("File uploaded:", uploadedFile);
          formDataWithFile.append("fileUpload", uploadedFile);
        } else {
          console.log("No file uploaded.");
        }

        console.log("Order Type:", orderType);
        console.log("Shipment Type:", shipmentType);

        formDataWithFile.append("orderType", orderType);
        formDataWithFile.append("shipmentType", shipmentType);

        Object.keys(formData).forEach((key) => {
          console.log(`${key}: ${formData[key]}`);
          formDataWithFile.append(key, formData[key]);
        });

        console.log("Data to send to backend:", formDataWithFile);

        const response = await fetch("http://localhost:5056/api/add-new-order", {
          method: "POST",
          body: formDataWithFile,
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          return;
        }

        const responseData = await response.json();
        console.log("Success:", responseData);

      } catch (error) {
        console.error("Error:", error);
      }

      resetForm();
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
      cargoCBM: "",
      noOfPallets: "",
      targetDate: "",
      fileUpload: "",
      productDescription: "",
      additionalNotes: "",
      length: "",
      width: "",
      height: "",

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
    <form onSubmit={handleFormSubmit}>
      {/* Order Number and Route */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <InputField 
          label="1. Order Number" 
          name="orderNumber" 
          value={formData.orderNumber} 
          placeholder="Enter the order number"
          onChange={handleInputChange}
          error={errors.orderNumber}
        />
        <div className="col-span-1">
          <label htmlFor="route" className="block text-sm font-medium mb-2 text-black">
            2. Route
          </label>
          <div className="flex space-x-2 -mt-2">
            <InputField 
              name="routeFrom" 
              value={formData.routeFrom} 
              placeholder="From"
              onChange={handleInputChange}
              error={errors.routeFrom}
            />
            <span className="text-sm text-black my-auto">-</span>
            <InputField 
              name="routeTo" 
              value={formData.routeTo} 
              placeholder="To"
              onChange={handleInputChange}
              error={errors.routeTo}
            />
          </div>
        </div>
      </div>

      {/* Shipment Ready Date, Delivery Term, and Type */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <InputField 
          label="3. Shipment Ready Date" 
          name="shipmentReadyDate" 
          value={formData.shipmentReadyDate} 
          placeholder="DD/MM/YYYY"
          onChange={handleInputChange}
          error={errors.shipmentReadyDate}
          type="date"
        />
        <InputField 
          label="4. Delivery Term" 
          name="deliveryTerm" 
          value={formData.deliveryTerm} 
          placeholder="Enter the Delivery Term"
          onChange={handleInputChange}
          error={errors.deliveryTerm}
        />
        <InputField 
          label="5. Type" 
          name="type" 
          value={formData.type} 
          placeholder="Enter the type"
          onChange={handleInputChange}
          error={errors.type}
        />
      </div>

      {/* Cargo Type */}
      <div className="w-full mb-6 mt-6">
        <label htmlFor="cargoType" className="block text-sm font-medium mb-2 text-black">
          6. Cargo Type
        </label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="PalletizedCargo"
              name="cargoType"
              value="PalletizedCargo"
              checked={formData.cargoType === 'PalletizedCargo'}
              onChange={handleCargoTypeChange}
              className="mr-2"
            />
            <label htmlFor="PalletizedCargo" className="text-sm text-black">Palletized Cargo</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="LooseCargo"
              name="cargoType"
              value="LooseCargo"
              checked={formData.cargoType === 'LooseCargo'}
              onChange={handleCargoTypeChange}
              className="mr-2"
            />
            <label htmlFor="LooseCargo" className="text-sm text-black">Loose Cargo</label>
          </div>
        </div>
        {errors.cargoType && <p className="text-red-500 italic text-sm">{errors.cargoType}</p>}
      </div>


      {/* Chargeable Weight, Gross Weight, Cargo CBM */}
      <InputField 
        label="7. Chargeable Weight (Kg)" 
        name="chargeableWeight" 
        value={formData.chargeableWeight} 
        placeholder="Enter the Chargeable Weight (Kg)"
        onChange={handleInputChange}
        error={errors.chargeableWeight}
      />
      <InputField 
        label="8. Gross Weight (Kg)" 
        name="grossWeight" 
        value={formData.grossWeight} 
        placeholder="Enter the Gross Weight"
        onChange={handleInputChange}
        error={errors.grossWeight}
      />
      <InputField 
        label="9. Cargo CBM" 
        name="cargoCBM" 
        value={formData.cargoCBM} 
        placeholder="Enter the Cargo CBM"
        onChange={handleInputChange}
        error={errors.cargoCBM}
      /> 

<div className="mb-6">
  <label htmlFor="dimensions" className="block text-sm font-medium mb-2 text-black">
    10. Dimensions (Length * Height * Width)
  </label>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <input
        type="number"
        name="length"
        id="length"
        value={formData.length || ""}
        placeholder="Length (cm)"
        onChange={handleInputChange}
        className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-gray-600 border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
    </div>
    <div>
      <input
        type="number"
        name="height"
        id="height"
        value={formData.height || ""}
        placeholder="Height (cm)"
        onChange={handleInputChange}
        className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-gray-600 border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
    </div>
    <div>
      <input
        type="number"
        name="width"
        id="width"
        value={formData.width || ""}
        placeholder="Width (cm)"
        onChange={handleInputChange}
        className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-gray-600 border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
    </div>
  </div>
</div>


      {/* No. of Pallets and Target Date */}
{/* Number of Pallets (if applicable) */}
{formData.cargoType === "PalletizedCargo" && (
  <InputField
    label="11. Number of Pallets"
    name="noOfPallets"
    value={formData.noOfPallets}
    placeholder="Enter the number of pallets"
    onChange={handleInputChange}
    error={errors.noOfPallets}
    type="number"
  />
)}

      <InputField 
        label="12. Target Date" 
        name="targetDate" 
        value={formData.targetDate} 
        placeholder="DD/MM/YYYY"
        onChange={handleInputChange}
        error={errors.targetDate}
        type="date"
      />

      {/* Product Description */}
      <InputField 
        label="13. Product Description" 
        name="productDescription" 
        value={formData.productDescription} 
        placeholder="Enter the product description"
        onChange={handleInputChange}
        type="textarea"
        error={errors.productDescription}
      />

      {/* File Upload */}
      <div className="max-w-sm mb-6">
  <label htmlFor="fileUpload" className="block text-sm font-medium mb-2 text-black">
    14. Upload File
  </label>
  <input
    name="fileUpload"
    type="file"
    accept=".pdf, .doc, .docx, .xls, .xlsx, image/*"
    onChange={handleFileUpload}
    value={formData.fileUpload || ""}
    id="fileUpload"
    className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
  />
  {uploadedFile && (
    <div className="mt-2 text-sm text-gray-600">
      <strong>Selected file:</strong> {uploadedFile.name}
    </div>
  )}
</div>

<div className="w-full mb-6">
  <label htmlFor="additionalNotes" className="block text-sm font-medium mb-2 text-black">
    15. Additional Notes
  </label>
  <textarea
    name="additionalNotes"
    id="additionalNotes"
    value={formData.additionalNotes || ""}
    onChange={handleInputChange}
    className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
    placeholder="Enter any additional notes here..."
    rows="4"
  />
</div>

      {/* Submit Button */}
      <div className="w-full mb-6">
        <button
          type="submit"
          className="py-3 px-6 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 w-full"
        >
          Submit
        </button>
      </div>

      {showErrorPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 text-center">
            <h2 className="text-lg text-red-500 font-semibold">
              Please fill all required fields
            </h2>
            <button onClick={() => setShowErrorPopup(false)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ImportAirFreight;


