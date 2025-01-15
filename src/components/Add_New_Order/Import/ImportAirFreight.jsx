import React, { useState } from 'react';
import CommonFields from '../commonFields';

const ImportAirFreight = ({ formData, handleInputChange, handleSubmit }) => {
  const [isCargoLoose, setIsCargoLoose] = useState(formData.cargoType === 'LooseCargo');
  const [errors, setErrors] = useState({
    chargeableWeight: '',
    grossWeight: '',
    cargoType: '',
    cargoCBM: '',
    noOfPallets: '',
    targetDate: ''
  });
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleCargoTypeChange = (e) => {
    const selectedCargoType = e.target.value;
    setIsCargoLoose(selectedCargoType === 'LooseCargo');
    handleInputChange(e);

    if (selectedCargoType === 'LooseCargo') {
      handleInputChange({ target: { name: 'noOfPallets', value: '' } });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.chargeableWeight) newErrors.chargeableWeight = 'Please enter chargeable weight (Kg)';
    if (!formData.grossWeight) newErrors.grossWeight = 'Please enter gross weight (Kg)';
    if (!formData.cargoType) newErrors.cargoType = 'Please select cargo type';
    if (!formData.cargoCBM) newErrors.cargoCBM = 'Please enter cargo CBM';
    if (!formData.noOfPallets && formData.cargoType === 'PalletizedCargo') newErrors.noOfPallets = 'Please enter number of pallets';
    if (!formData.targetDate) newErrors.targetDate = 'Please select target date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submitted with event:", e); // Log the event object to verify it

    if (validateForm()) {
      // Ensure handleSubmit is properly defined and expects the event
      handleSubmit(e); // Pass the event to handleSubmit
      resetForm();
    } else {
      setShowErrorPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowErrorPopup(false);
  };

  const resetForm = () => {
    handleInputChange({ target: { name: 'chargeableWeight', value: '' } });
    handleInputChange({ target: { name: 'grossWeight', value: '' } });
    handleInputChange({ target: { name: 'cargoCBM', value: '' } });
    handleInputChange({ target: { name: 'noOfPallets', value: '' } });
    handleInputChange({ target: { name: 'targetDate', value: '' } });
    handleInputChange({ target: { name: 'additionalNotes', value: '' } });
    setIsCargoLoose(false);
    setErrors({});
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-full w-full mx-auto px-4">
      {showErrorPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 text-center">
            <h2 className="text-lg text-red-500 font-semibold">Please fill all required fields</h2>
            <button
              onClick={handlePopupClose}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <CommonFields formData={formData} handleInputChange={handleInputChange} />

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

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="hs-floating-underline-input-chargeableWeight" className="block text-sm font-medium mb-2 text-black">
            7. Chargeable Weight (Kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="chargeableWeight"
            value={formData.chargeableWeight || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-chargeableWeight"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter chargeable weight in Kg"
            min="0"
          />
          {errors.chargeableWeight && (
            <p className="text-red-500 italic text-xs">{errors.chargeableWeight}</p>
          )}
        </div>
        <div>
          <label htmlFor="hs-floating-underline-input-grossWeight" className="block text-sm font-medium mb-2 text-black">
            8. Gross Weight (Kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="grossWeight"
            value={formData.grossWeight || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-grossWeight"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter the Gross Weight"
          />
          {errors.grossWeight && (
            <p className="text-red-500 italic text-sm">{errors.grossWeight}</p>
          )}
        </div>
        <div>
          <label htmlFor="hs-floating-underline-input-cargoCBM" className="block text-sm font-medium mb-2 text-black">
            9. Cargo CBM <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cargoCBM"
            value={formData.cargoCBM || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-cargoCBM"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter the Cargo CBM"
          />
          {errors.cargoCBM && <p className="text-red-500 italic text-sm">{errors.cargoCBM}</p>}
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="hs-floating-underline-input-noOfPallets" className="block text-sm font-medium mb-2 text-black">
            10. No. of Pallets
          </label>
          <input
            type="number"
            name="noOfPallets"
            value={formData.noOfPallets || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-noOfPallets"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter the number of pallets"
            min="0"
            disabled={isCargoLoose}
          />
          {errors.noOfPallets && <p className="text-red-500 italic text-sm">{errors.noOfPallets}</p>}
        </div>
        <div>
          <label htmlFor="hs-floating-underline-input-targetDate" className="block text-sm font-medium mb-2 text-black">
            11. Target Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="targetDate"
            value={formData.targetDate || ""}
            onChange={handleInputChange}
            id="hs-floating-underline-input-targetDate"
            className="py-3 px-4 block w-full bg-gray-300 text-black placeholder-white border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.targetDate && <p className="text-red-500 italic text-sm">{errors.targetDate}</p>}
        </div>
      </div>

      <div className="w-full mb-6">
        <label className="block text-sm font-medium mb-2 text-black">12. Upload File</label>
        <input
          type="file"
          accept=".pdf, .doc, .docx, .xls, .xlsx, image/*"
          className="block w-full text-sm text-gray-500
            file:py-2 file:px-4 file:rounded-lg
            file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="additional-notes" className="block text-sm font-medium mb-2 text-black">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          id="additional-notes"
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
    </form>
  );
};

export default ImportAirFreight;