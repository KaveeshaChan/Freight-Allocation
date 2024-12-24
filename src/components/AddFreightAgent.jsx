import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from './Layout';
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

const AddFreightAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    BRN: '',
    address: '',
    contactNumber: '',
    email: '',
    director1ContactNumber: '',
    director1Email: '',
    director1Name: '',
    director2ContactNumber: '',
    director2Email: '',
    director2Name: '',
    password: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isCountrySelected, setIsCountrySelected] = useState(false); // Track if country is selected
  const [callingCode, setCallingCode] = useState(""); // Store calling code

  const options = useMemo(() => countryList().getData(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      // console.log("Updated FormData:", updatedFormData); // Comment or remove this line
      return updatedFormData;
    });
  };
  

  const handleCountryChange = (selectedOption) => {
    const countryCode = selectedOption.value;
    const newCallingCode = `+${getCountryCallingCode(countryCode)}`;

    setFormData((prev) => ({
      ...prev,
      country: selectedOption.label,
      contactNumber: newCallingCode,
      director1ContactNumber: newCallingCode,
      director2ContactNumber: newCallingCode,
    }));
    
    setIsCountrySelected(true); // Mark country as selected
    setCallingCode(newCallingCode); // Store calling code
  };

  const validatePhoneNumber = (number, country) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(number, country);
      return phoneNumber?.isValid() || false;
    } catch {
      return false;
    }
  };

  const cleanPhoneNumber = (number) => {
    return number.replace(/\s+/g, ''); // Remove all whitespace characters
  };

  const submitFormData = async (formData) => {
    const cleanedFormData = {
      ...formData,
      contactNumber: cleanPhoneNumber(formData.contactNumber),
      director1ContactNumber: cleanPhoneNumber(formData.director1ContactNumber),
      director2ContactNumber: cleanPhoneNumber(formData.director2ContactNumber),
    };

    console.log("Cleaned Form Data in submit:", cleanedFormData); // Log cleaned data

    try {
      const response = await fetch('http://localhost:5056/api/add-freight-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });

      if (response.ok) {
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          BRN: '',
          country: '',
          address: '',
          contactNumber: '',
          email: '',
          password: '',
          director1ContactNumber: '',
          director1Email: '',
          director1Name: '',
          director2ContactNumber: '',
          director2Email: '',
          director2Name: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Request Error:', error);
      setShowErrorPopup(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = 'Company Name is required';
    if (!formData.BRN.trim()) newErrors.BRN = 'Business Registration Number is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address.trim()) newErrors.address = 'Company Address is required';
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validatePhoneNumber(formData.contactNumber, formData.country)) {
      newErrors.contactNumber = 'Invalid phone number';
    }
    if (!formData.email.trim()) newErrors.email = 'Company Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.director1ContactNumber.trim()) {
      newErrors.director1ContactNumber = 'Director 01 Contact Number is required';
    } else if (!validatePhoneNumber(formData.director1ContactNumber, formData.country)) {
      newErrors.director1ContactNumber = 'Invalid phone number for Director 01';
    }
    if (!formData.director1Email.trim()) newErrors.director1Email = 'Director 01 Email is required';
    if (!formData.director1Name.trim()) newErrors.director1Name = 'Director 01 Name is required';
    if (formData.director2ContactNumber.trim() && !validatePhoneNumber(formData.director2ContactNumber, formData.country)) {
      newErrors.director2ContactNumber = 'Invalid phone number for Director 02';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      submitFormData(formData);
    } else {
      setShowErrorPopup(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <Layout>
    <div
      className="font-sans min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Error Popup */}
      {showErrorPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button
              onClick={closeErrorPopup}
              className="mt-4 p-2 w-full rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-lg font-semibold mb-4 text-green-600">Success</h2>
            <p className="text-sm text-gray-700">
              Username and Password sent to {formData.name} successfully.
            </p>
            <button
              onClick={closeSuccessPopup}
              className="mt-4 p-2 w-full rounded-md bg-green-500 text-white hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

     

      {/* Main Content */}
      <main className="flex justify-center items-center mt-8">
        <div
          className="p-6 rounded-lg shadow-lg"
          style={{
            background: '#FFFFFF', // Solid white background
            borderRadius: '16px', // Rounded corners
            border: '1px solid rgba(25, 25, 25, 0.1)', // Subtle border
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
            width: '700px', // Custom width for the box
          }}
        >
          <h2
            className="text-2xl mb-4 font-semibold"
            style={{
              color: '#191919', // Black text for the title
              textAlign: 'center',
            }}
          >
            Add Freight Agent
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* company name */}
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
                Company Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            {/* BRN & country */}
            <div className="mb-3 flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="BRN"
                    className="block mb-1 text-sm"
                    style={{ color: '#191919' }}
                  >
                    Business Registration Number:
                  </label>
                  <input
                    type="text"
                    id="BRN"
                    name="BRN"
                    className="w-full p-2 border rounded-md text-sm"
                    style={{
                      borderColor: '#191919',
                      backgroundColor: '#FFFFFF',
                      color: '#191919',
                    }}
                    value={formData.BRN}
                    onChange={handleChange}
                  />
                  {errors.BRN && <p className="text-red-500 text-xs">{errors.BRN}</p>}
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="country"
                    className="block mb-1 text-sm"
                    style={{ color: '#191919' }}
                  >
                    Country:
                  </label>
                  <Select
                    options={options}
                    value={options.find((option) => option.value === formData.country)}
                    onChange={handleCountryChange}
                  />
                  {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
                </div>
              </div>


            {/* Address */}
            <div className="mb-3">
              <label
                htmlFor="address"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
                Company Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full p-2 border rounded-md text-sm"
                style={{
                  borderColor: '#191919',
                  backgroundColor: '#FFFFFF',
                  color: '#191919',
                }}
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            {/* Contact Number & Email */}
            <div className="mb-3 flex space-x-4">
              <div className="w-1/2">
              <label htmlFor="contactNumber" className="block mb-1 text-sm" style={{ color: '#191919' }}>
                  Company Contact Number:
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  className="w-full p-2 border rounded-md text-sm"
                  style={{ borderColor: '#191919', backgroundColor: '#FFFFFF', color: '#191919' }}
                  value={callingCode + formData.contactNumber.slice(callingCode.length)}
                  onChange={handleChange}
                />
                {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber}</p>}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm"
                  style={{ color: '#191919' }}
                >
                  Company Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border rounded-md text-sm"
                  style={{
                    borderColor: '#191919',
                    backgroundColor: '#FFFFFF',
                    color: '#191919',
                  }}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block mb-1 text-sm"
                style={{ color: '#191919' }}
              >
                Password:
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="w-full p-2 border rounded-md text-sm"
                  style={{
                    borderColor: '#191919',
                    backgroundColor: '#FFFFFF',
                    color: '#191919',
                  }}
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 cursor-pointer"
                  style={{ fontSize: '18px' }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Director 01 */}
<div className="mb-3">
  <h3 className="text-lg font-semibold" style={{ color: '#191919' }}>Director 01</h3>
  
  <label
    htmlFor="director1Name"
    className="block mb-1 text-sm"
    style={{ color: '#191919' }}
  >
    Director 01 Name:
  </label>
  <input
    type="text"
    id="director1Name"
    name="director1Name"
    className="w-full p-2 border rounded-md text-sm"
    value={formData.director1Name}
    onChange={handleChange}
  />
  {errors.director1Name && <p className="text-red-500 text-xs">{errors.director1Name}</p>}

  {/* Director 01 Contact and Email in the same line */}
  <div className="flex space-x-4">
    <div className="flex-1">
      <label
        htmlFor="director1ContactNumber"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 01 Contact Number:
      </label>
      <input
        type="text"
        id="director1ContactNumber"
        name="director1ContactNumber"
        className="w-full p-2 border rounded-md text-sm"
        style={{ borderColor: '#191919', backgroundColor: '#FFFFFF', color: '#191919' }}
        value={callingCode + formData.director1ContactNumber.slice(callingCode.length)}
        onChange={handleChange}
      />
      {errors.director1ContactNumber && (
        <p className="text-red-500 text-xs">{errors.director1ContactNumber}</p>
      )}
    </div>

    <div className="flex-1">
      <label
        htmlFor="director1Email"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 01 Email:
      </label>
      <input
        type="email"
        id="director1Email"
        name="director1Email"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director1Email}
        onChange={handleChange}
      />
      {errors.director1Email && <p className="text-red-500 text-xs">{errors.director1Email}</p>}
    </div>
  </div>
</div>

{/* Director 02 */}
<div className="mb-3">
  <h3 className="text-lg font-semibold" style={{ color: '#191919' }}>Director 02</h3>
  
  <label
    htmlFor="director2Name"
    className="block mb-1 text-sm"
    style={{ color: '#191919' }}
  >
    Director 02 Name:
  </label>
  <input
    type="text"
    id="director2Name"
    name="director2Name"
    className="w-full p-2 border rounded-md text-sm"
    value={formData.director2Name}
    onChange={handleChange}
  />
  {errors.director2Name && <p className="text-red-500 text-xs">{errors.director2Name}</p>}

  {/* Director 02 Contact and Email in the same line */}
  <div className="flex space-x-4">
    <div className="flex-1">
      <label
        htmlFor="director2ContactNumber"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 02 Contact Number:
      </label>
      <input
        type="text"
        id="director2ContactNumber"
        name="director2ContactNumber"
        className="w-full p-2 border rounded-md text-sm"
        style={{ borderColor: '#191919', backgroundColor: '#FFFFFF', color: '#191919' }}
        value={callingCode + formData.director2ContactNumber.slice(callingCode.length)}
        onChange={handleChange}
      />
      {errors.director2ContactNumber && (
        <p className="text-red-500 text-xs">{errors.director2ContactNumber}</p>
      )}
    </div>

    <div className="flex-1">
      <label
        htmlFor="director2Email"
        className="block mb-1 text-sm"
        style={{ color: '#191919' }}
      >
        Director 02 Email:
      </label>
      <input
        type="email"
        id="director2Email"
        name="director2Email"
        className="w-full p-2 border rounded-md text-sm"
        value={formData.director2Email}
        onChange={handleChange}
      />
      {errors.director2Email && <p className="text-red-500 text-xs">{errors.director2Email}</p>}
    </div>
  </div>
</div>



            {/* Submit */}
            <div className="mb-3">
            <button
              type="submit"
              className="p-3 rounded-md text-lg cursor-pointer border-2 w-full mt-4"
              style={{
                borderColor: '#FF4D00',
                backgroundColor: '#FF4D00',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              Add Freight Agent
            </button>
            </div>
          </form>
        </div>
      </main>

    </div>
    </Layout>
  );
};

export default AddFreightAgent;      

