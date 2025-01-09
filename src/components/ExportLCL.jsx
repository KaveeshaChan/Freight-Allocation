import React from 'react';
import CommonFields from './commonFields';

const ExportLCL = ({ formData, handleInputChange, handleSubmit }) => (
  <>
    <CommonFields formData={formData} handleInputChange={handleInputChange} />
    
    <form onSubmit={handleSubmit}>
      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-palletCBM" className="block text-sm font-medium mb-2 text-black">
            6. Pallet CBM
          </label>
        </div>
        <input
          type="text"
          name="palletCBM"
          value={formData.palletCBM || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-palletCBM"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the Pallet CBM"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-cargoCBM" className="block text-sm font-medium mb-2 text-black">
            7. Cargo CBM
          </label>
        </div>
        <input
          type="text"
          name="cargoCBM"
          value={formData.cargoCBM || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-cargoCBM"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the Cargo CBM"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-grossWeight" className="block text-sm font-medium mb-2 text-black">
            8. Gross Weight (Kg)
          </label>
        </div>
        <input
          type="text"
          name="grossWeight"
          value={formData.grossWeight || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-grossWeight"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the Gross Weight"
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-noOfPallets" className="block text-sm font-medium mb-2 text-black">
            9. No. of Pallets
          </label>
        </div>
        <input
          type="number"
          name="noOfPallets"
          value={formData.noOfPallets || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-noOfPallets"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="Enter the number of pallets"
          min="1" // Ensure the value is at least 1
        />
      </div>

      <div className="max-w-sm mb-6">
        <div className="flex justify-between items-center">
          <label htmlFor="hs-floating-underline-input-targetDate" className="block text-sm font-medium mb-2 text-black">
            10. Target Date
          </label>
        </div>
        <input
          type="date"
          name="targetDate"
          value={formData.targetDate || ""}
          onChange={handleInputChange}
          id="hs-floating-underline-input-targetDate"
          className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
          placeholder="DD/MM/YYYY"
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

      <div className="max-w-sm mb-6">
  <div className="flex justify-between items-center">
    <label htmlFor="additional-notes" className="block text-sm font-medium mb-2 text-black">
      Additional Notes
    </label>
  </div>
  <textarea
    name="additionalNotes"
    id="additional-notes"
    className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border-gray-400 text-black placeholder-gray-400 focus:ring-black"
    placeholder="Enter any additional notes here..."
    rows="4"
  />
</div>


      {/* Submit Button */}
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

export default ExportLCL;
