import React, { useState } from 'react';
import { handleFileUpload } from '../fileUploadHandler';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text" }) => (
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
      className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const ImportLCL = ({ formData, handleInputChange, orderType, shipmentType }) => {
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please fill all required fields");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState(null)

  const onFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name)
    try {
      await handleFileUpload(file, setUploadedFile);
    } catch (error) {
      alert(error.message);
      console.error('Error uploading file:', error);
      setErrorMessage("Error uploading file:", error)
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
    if (!formData.noOfPallets) formErrors.noOfPallets = "Number of pallets is required";
    if (!formData.targetDate) formErrors.targetDate = "Target date is required";
    if (!formData.productDescription) formErrors.productDescription = "Product description is required";
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
          numberOfPallets: formData.noOfPallets || null,
          palletCBM: formData.palletCBM,
          cargoCBM: formData.cargoCBM,
          grossWeight: formData.grossWeight,
          targetDate: formData.targetDate,
          productDescription: formData.productDescription,
          additionalNotes: formData.additionalNotes || null,
          fileUpload: uploadedFile,
          fileName: fileName ? fileName.split('.')[0] : null
        }

        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5056/api/orderHandling/add-new-order/import-lcl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message)
          setShowErrorPopup(true);
          return;
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        setShowSuccessPopup(true)
        resetForm();

      } catch (error) {
        console.error("Error:", error);
        setShowErrorPopup(true);
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
      cargoCBM: '',
      grossWeight: '',
      noOfPallets: '',
      targetDate: '',
      productDescription: '',
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

  return (
    <form onSubmit={handleFormSubmit}>

      {/* Order Number and Route */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <InputField 
          label="&#x2022; Order Number" 
          name="orderNumber" 
          value={formData.orderNumber} 
          placeholder="Enter the order number"
          onChange={handleInputChange}
          error={errors.orderNumber}
        />
        <div className="col-span-1">
          <label htmlFor="route" className="block text-sm font-medium mb-2 text-black">
          &#x2022; Route
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
          label="&#x2022; Shipment Ready Date" 
          name="shipmentReadyDate" 
          value={formData.shipmentReadyDate} 
          placeholder="DD/MM/YYYY"
          onChange={handleInputChange}
          error={errors.shipmentReadyDate}
          type="date"
        />
        <InputField 
          label="&#x2022; Delivery Term" 
          name="deliveryTerm" 
          value={formData.deliveryTerm} 
          placeholder="Enter the Delivery Term"
          onChange={handleInputChange}
          error={errors.deliveryTerm}
        />
        <InputField 
          label="&#x2022; Type" 
          name="type" 
          value={formData.type} 
          placeholder="Enter the type"
          onChange={handleInputChange}
          error={errors.type}
        />
      </div>

      {/* Pallet CBM, Cargo CBM, Gross Weight */}
      <InputField 
        label="&#x2022; Pallet CBM" 
        name="palletCBM" 
        value={formData.palletCBM} 
        placeholder="Enter the Pallet CBM"
        onChange={handleInputChange}
        error={errors.palletCBM}
      />
      <InputField 
        label="&#x2022; Cargo CBM" 
        name="cargoCBM" 
        value={formData.cargoCBM} 
        placeholder="Enter the Cargo CBM"
        onChange={handleInputChange}
        error={errors.cargoCBM}
      />
      <InputField 
        label="&#x2022; Gross Weight (Kg)" 
        name="grossWeight" 
        value={formData.grossWeight} 
        placeholder="Enter the Gross Weight"
        onChange={handleInputChange}
        error={errors.grossWeight}
      />
      <InputField 
        label="&#x2022; No. of Pallets" 
        name="noOfPallets" 
        value={formData.noOfPallets} 
        placeholder="Enter the number of pallets"
        onChange={handleInputChange}
        error={errors.noOfPallets}
        type="number"
      />
      <InputField 
        label="&#x2022; Target Date" 
        name="targetDate" 
        value={formData.targetDate} 
        placeholder="DD/MM/YYYY"
        onChange={handleInputChange}
        error={errors.targetDate}
        type="date"
      />
      <InputField 
        label="&#x2022; Product Description" 
        name="productDescription" 
        value={formData.productDescription} 
        placeholder="Enter the product description"
        onChange={handleInputChange}
        error={errors.productDescription}
        type="textarea"
      />

     {/* File Upload */}
     <div className="max-w-sm mb-6">
        <label htmlFor="fileUpload" className="block text-sm font-medium mb-2 text-black">
          &#x2022; Upload File
        </label>
        <input
          name="fileUpload"
          type="file"
          accept=".xls, .xlsx"
          onChange={onFileUpload}
          value={formData.uploadedFile || ""}
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
  &#x2022; Additional Notes
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
                {errorMessage}
              </h2>
              <button onClick={() => setShowErrorPopup(false)} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 text-center">
              <h2 className="text-lg text-green-500 font-semibold">
                New Order Added Successfully!
              </h2>
              <button onClick={() => setShowSuccessPopup(false)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}
    </form>
  );
};

export default ImportLCL;
