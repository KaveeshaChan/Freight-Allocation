import React, { useState } from 'react';
import { FiDownload, FiPlusCircle, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const ImportAirFreight = ({ order }) => {
  const initialQuotation = {
    airFreightCost: '',
    AWB: '',
    carrier: '',
    transitTime: '',
    vesselOrFlightDetails: '',
    validityTime: '',
  };

  const [currentQuotation, setCurrentQuotation] = useState(initialQuotation);
  const [savedQuotations, setSavedQuotations] = useState([]);
  const navigate = useNavigate();


  const handleAddQuotation = () => {
    console.log('Current Quotation:', currentQuotation);
    const isEmptyField = Object.values(currentQuotation).some(value => value.trim() === '');
    if (isEmptyField) {
      console.log('One or more fields are empty.');
      alert('Please fill all fields before adding a quotation');
      return;
    }
    setSavedQuotations([...savedQuotations, { ...currentQuotation, id: Date.now() }]);
    setCurrentQuotation(initialQuotation);
  };

  const removeQuotation = (id) => {
    setSavedQuotations(savedQuotations.filter(q => q.id !== id));
  };

  const handleSubmit = async () => {
    if (savedQuotations.length === 0) {
      alert('Please add at least one quotation before submitting');
      return;
    }

    const payload = savedQuotations.map(quotation => ({
      OrderNumber: order.orderNumber,
      airFreightCost: quotation.airFreightCost,
      AWB: quotation.AWB,
      carrier: quotation.carrier,
      transitTime: quotation.transitTime,
      vesselOrFlightDetails: quotation.vesselOrFlightDetails,
      validityTime: quotation.validityTime,
    }));

    

    console.log('Payload to send:', payload);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Navigate to login page
      return;
    }

    try {
      const response = await fetch('https://your-backend-endpoint.com/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Quotes submitted successfully:', result);
      alert('Quotes submitted successfully!');
    } catch (error) {
      console.error('Error submitting quotes:', error);
      alert('There was an error submitting the quotes. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuotation(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Import - Air Freight</h2>
          <span className="text-lg font-semibold text-gray-600">{`Order Number: ${order.orderNumber}`}</span>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
          <FiDownload className="text-xl" /> Download Documents
        </button>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Route', 
                'Shipment Ready Date', 
                'Delivery Term',
                'Type', 'Cargo Type', 
                'Pallets', 
                'Chargeable Weight (Kg)', 
                'Gross Weight', 
                'Cargo CBM', 
                'L*W*H with the pallet', 
                'Target Date'
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[140px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                `${order.from} - ${order.to}`,
                order.shipmentReadyDate,
                order.deliveryTerm,
                order.Type,
                order.cargoType,
                order.numberOfPallets,
                order.chargeableWeight,
                order.grossWeight,
                order.cargoCBM,
                order.LWHWithThePallet,
                order.targetDate
              ].map((value, index) => (
                <td
                  key={index}
                  className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                >
                  {value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {order.additionalNotes && (
        <div className="bg-blue-50 p-5 rounded-lg mb-8 border border-blue-200">
          <h4 className="font-semibold text-lg text-blue-800 mb-2">Additional Notes</h4>
          <p className="text-gray-700 text-base leading-relaxed">
            {order.additionalNotes}
          </p>
        </div>
      )}

      <section className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Add New Quotation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Air Freight Cost', name: 'airFreightCost' },
            { label: 'AWB (USD)', name: 'AWB', type: 'number' },
            { label: 'Carrier', name: 'carrier' },
            { label: 'Transit Time', name: 'transitTime', placeholder: 'Days/hours' },
            { label: 'Flight Details', name: 'vesselOrFlightDetails' },
            { label: 'Validity Date', name: 'validityTime', type: 'date' },
          ].map((field, index) => (
            <InputField
              key={index}
              label={field.label}
              placeholder={field.placeholder || `Enter ${field.label}`}
              type={field.type || 'text'}
              name={field.name}
              value={currentQuotation[field.name]}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <button
          onClick={handleAddQuotation}
          className="mt-6 flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlusCircle className="text-xl" /> Add Quotation
        </button>
      </section>

      {savedQuotations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Quotations</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Air Freight Cost', 
                    'AWB (USD)', 
                    'Carrier', 
                    'Transit Time',
                    'Flight Details', 
                    'Validity Date'
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[120px]"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    {[
                      quotation.airFreightCost,
                      quotation.AWB,
                      quotation.carrier,
                      quotation.transitTime,
                      quotation.vesselOrFlightDetails,
                      quotation.validityTime,
                    ].map((value, index) => (
                      <td
                        key={index}
                        className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {value || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        onClick={() => removeQuotation(quotation.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FiX className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit All Quotes
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder, type = 'text', name, value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      required
    />
  </div>
);

export default ImportAirFreight;