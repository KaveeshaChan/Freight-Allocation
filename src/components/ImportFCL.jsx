import React from 'react';
import CommonFields from './commonFields';

const ImportFCL = ({ formData, handleInputChange, handleSubmit }) => {
  // Function to reset the form
  const resetForm = () => {
    handleInputChange({ target: { name: 'noOfContainers', value: '' } });
    handleInputChange({ target: { name: 'targetDate', value: '' } });
    handleInputChange({ target: { name: 'productDescription', value: '' } });
    handleInputChange({ target: { name: 'additionalNotes', value: '' } });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
    resetForm(); // Reset the form fields after submitting
  };

  return (
    <>
      <CommonFields formData={formData} handleInputChange={handleInputChange} />
      <form onSubmit={handleFormSubmit}>
      <div className="max-w-sm mb-6 mt-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-noOfContainers" className="block text-sm font-medium mb-2 text-black">
            6. No. of Containers
          </label>
        </div>
        <input
          type="number"
          name="noOfContainers"
          value={formData.noOfContainers || ""}
          onChange={(e) => {
            const value = Math.max(0, parseInt(e.target.value, 10)); // Ensure positive value
            handleInputChange({ target: { name: e.target.name, value } });
          }}
          id="hs-floating-underline-input-noOfContainers"
          className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Enter the number of containers"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-targetDate" className="block text-sm font-medium mb-2 text-black">
            7. Target Date
          </label>
        </div>
        <input
          type="date"
          name="targetDate"
          value={formData.targetDate || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-targetDate"
          className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="DD/MM/YYYY"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-productDescription" className="block text-sm font-medium mb-2 text-black">
            8. Product Description
          </label>
        </div>
        <textarea
          name="productDescription"
          value={formData.productDescription || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-productDescription"
          className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Enter the product description"
          rows="4"
        />
      </div>

      <div className="max-w-sm mb-6">
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept=".pdf, .doc, .docx, .xls, .xlsx, image/*"
              className="block w-full text-sm text-gray-500
                file:me-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                file:disabled:opacity-50 file:disabled:pointer-events-none"
            />
          </label>
          </div>

          {/* Additional Notes */}
          <div className="max-w-sm mb-6">
  <div className="flex justify-between items-center">
    <label htmlFor="additional-notes" className="block text-sm font-medium mb-2 text-black">
      Additional Notes
    </label>
  </div>
  <textarea
    name="additionalNotes"
    id="additional-notes"
    className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
    placeholder="Enter any additional notes here..."
    rows="4"
  />
</div>

<div className="max-w-sm mb-6">
          <button
            type="submit"
            className="py-3 px-6 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
        </form>
      
    </>
  );
};

export default ImportFCL;
