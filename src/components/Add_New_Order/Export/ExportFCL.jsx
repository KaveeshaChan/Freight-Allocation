import React, { useState } from 'react';
import { handleFileUpload } from '../fileUploadHandler';

const InputField = ({ label, name, value, placeholder, onChange, error, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium mb-2 text-black">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      id={name}
      className="py-2 px-3 block w-full bg-gray-200 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);


const ExportFCL = ({ formData, handleInputChange, orderType, shipmentType }) => {
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please fill all required fields");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState(null)
  const userId = localStorage.getItem('userId');

  const onFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name)
    try {
      await handleFileUpload(file, setUploadedFile);
    } catch (error) {
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
    if (!formData.noOfContainers) formErrors.noOfContainers = "no.of Containers are required";
    if (!formData.targetDate) formErrors.targetDate = "Target date is required"
    if (!formData.dueDate) formErrors.dueDate = "Due Date is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        //prepare the payload as an object
        const payload = {
          orderType,
          shipmentType,
          orderNumber: formData.orderNumber,
          routeFrom: formData.routeFrom,
          routeTo: formData.routeTo,
          shipmentReadyDate: formData.shipmentReadyDate,
          deliveryTerm: formData.deliveryTerm,
          type: formData.type,
          numberOfContainers: formData.noOfContainers || null,
          dueDate: formData.dueDate,
          targetDate: formData.targetDate,
          additionalNotes: formData.additionalNotes,
          fileUpload: uploadedFile,
          fileName: fileName ? fileName.split('.')[0] : null,
          userId
        }

        const token = localStorage.getItem('token')
        const response = await fetch(
          "http://localhost:5056/api/orderHandling/add-new-order/export-fcl", 
          {
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
        setErrorMessage("Error:", error)
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
      noOfContainers: '',       
      targetDate: '',     
      additionalNotes: '',
      fileUpload: '',
      fileName: '',
      dueDate: "",
      };

    Object.keys(resetFields).forEach((field) =>
      handleInputChange({ target: { name: field, value: resetFields[field] } })
    );
    setUploadedFile(null);
    setErrors({});
  };


  return (
    <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto p-4">
      {/* Order Number */}
      <InputField
        label="&#x2022; Order Number"
        name="orderNumber"
        value={formData.orderNumber}
        placeholder="Enter the order number"
        onChange={handleInputChange}
        error={errors.orderNumber}
      />

        {/* Route */}
      <div className="mb-4">
        <label htmlFor="route" className="block text-sm font-medium mb-1 text-black">
          &#x2022; Route
        </label>
        <div className="flex space-x-3">
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

      {/* Shipment Ready Date, Delivery Term, and Type */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
      </div>

      <InputField
        label="&#x2022; Type"
        name="type"
        value={formData.type}
        placeholder="Enter the type"
        onChange={handleInputChange}
        error={errors.type}
      />

      {/* No. of Containers */}
      <InputField 
        label="&#x2022; No. of Containers" 
        name="noOfContainers" 
        value={formData.noOfContainers} 
        placeholder="Enter the number of containers"
        onChange={handleInputChange}
        type="number"
        error={errors.noOfContainers}
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
      <div className="max-w-sm mb-4">
        <label htmlFor="fileUpload" className="block text-sm font-medium mb-1 text-black">
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
            <strong>Selected file:</strong> {fileName}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="w-full mb-4">
        <label htmlFor="additionalNotes" className="block text-sm font-medium mb-1 text-black">
          &#x2022; Additional Notes
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
      <div className="w-full mb-4">
        <button
          type="submit"
          className="py-2 px-4 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 w-full"
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


export default ExportFCL;