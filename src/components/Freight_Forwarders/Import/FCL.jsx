import React, { useState } from 'react';
import { FiDownload, FiPlusCircle, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ImportFCL = ({ order }) => {
  const initialQuotation = {
    netFreight: '',
    DOFee: '',
    transShipmentPort: '',
    freeTime: '',
    carrier:'',
    transitTime: 14, // Set initial value to 14
    vesselOrFlightDetails: '',
    validityTime: '',
  };

  const [currentQuotation, setCurrentQuotation] = useState(initialQuotation);
  const [savedQuotations, setSavedQuotations] = useState([]);
  const navigate = useNavigate();

  const handleAddQuotation = () => {
    console.log('Current Quotation:', currentQuotation);
    const isEmptyField = Object.values(currentQuotation).some(value => value.toString().trim() === '');
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
      orderNumber: order.orderNumber,
      netFreight: quotation.netFreight,
      DOFee: quotation.DOFee,
      transShipmentPort: quotation.transShipmentPort,
      freeTime: quotation.freeTime,
      carrier: quotation.carrier,
      transitTime: quotation.transitTime,
      validityTime: quotation.validityTime,
    }));

    console.log('Payload to send:', payload);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Navigate to login page
      return;
    }

    try {
      const response = await fetch('http://localhost:5056/api/orderHandling/add-quoatation/import-fcl', {
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
      alert(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate transitTime as integer without decimal and minimum value of 14
    if (name === 'transitTime') {
      const intValue = parseInt(value, 10);
      if (isNaN(intValue) || intValue < 14) {
        setCurrentQuotation(prev => ({ ...prev, [name]: 14 }));
      } else {
        setCurrentQuotation(prev => ({ ...prev, [name]: intValue }));
      }
    } else {
      setCurrentQuotation(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Import - FCL</h2>
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
                'Route', 'Shipment Ready Date', 'Delivery Term',
                'Type', 'Number of Containers', 'Target Date'
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
                order.numberOfContainers,
                order.targetDate,
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
            { label: 'Net Freight (USD)', name: 'netFreight', type: 'number' },
            { label: 'DO Fee', name: 'DOFee', type: 'number' },
            { label: 'Transshipment Port', name: 'transShipmentPort' },            
            { label: 'Free Time', name: 'freeTime' },
            { label: 'Carrier', name: 'carrier' },
            { label: (
              <>
                Transit Time
                <span className="text-red-500 italic text-xs"> (14 days free time is must)</span>
              </>
            ), name: 'transitTime', type: 'number', min: 14 }, // Set minimum value to 14
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
              min={field.min || undefined} // Add min attribute if exists
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
                    'Net Freight (USD)', 
                    'DO Fee', 
                    'Transshipment Port', 
                    'Free Time', 
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
                      quotation.netFreight,
                      quotation.DOFee,
                      quotation.transShipmentPort,
                      quotation.freeTime,
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

const InputField = ({ label, placeholder, type = 'text', name, value, onChange, min }) => (
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
      min={min} // Add min attribute if exists
    />
  </div>
);

export default ImportFCL;