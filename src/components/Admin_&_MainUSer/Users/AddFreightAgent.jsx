import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FaEye, FaEyeSlash, FaUser, FaBuilding, FaIdCard, FaGlobe, FaPhone, FaEnvelope, FaKey } from 'react-icons/fa';
import Header from '../../Layouts/Main_Layout';
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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
  const [userID, setUserID] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      const decodedToken = jwtDecode(token);
      if (decodedToken.roleName !== 'admin' && decodedToken.roleName !== 'mainUser') {
        navigate('/login'); // Redirect if not an admin or mainUser
      }
      setUserID(decodedToken.userId)
    } catch (error) {
      console.error('Error decoding token or navigating:', error);
      navigate('/login'); // Handle invalid or malformed token
    }
  }, [navigate]);

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
      userID: userID
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }

      const response = await fetch('http://192.168.100.20:5056/api/add-freight-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // Validate Director 2 fields only if any Director 2 field is filled
  const isDirector2DataProvided =
  formData.director2Email.trim() || formData.director2Name.trim();

if (formData.director2ContactNumber.trim() === callingCode) {
  formData.director2ContactNumber = ""; // Assign empty value if it's just the calling code
}

if (isDirector2DataProvided || formData.director2ContactNumber.trim() !== "") {
  // Validate Contact Number if it's not empty
  if (!formData.director2ContactNumber.trim()) {
    newErrors.director2ContactNumber = "Director 02 Contact Number is required";
  } else if (!validatePhoneNumber(formData.director2ContactNumber, formData.country)) {
    newErrors.director2ContactNumber = "Invalid phone number for Director 02";
  }

  if (!formData.director2Email.trim()) {
    newErrors.director2Email = "Director 02 Email is required";
  }

  if (!formData.director2Name.trim()) {
    newErrors.director2Name = "Director 02 Name is required";
  }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Error Popup */}
        {showErrorPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                Validation Errors
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {Object.values(errors).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
              <button
                onClick={closeErrorPopup}
                className="mt-6 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Success!
              </h2>
              <p className="text-gray-700 mb-4">
                Credentials sent to <span className="font-semibold">{formData.name}</span> successfully.
              </p>
              <button
                onClick={closeSuccessPopup}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FaBuilding className="text-[#0534F0]" />
            Add New Freight Agent
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 flex items-center gap-2">
                <FaBuilding className="text-[#98009E]" />
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaBuilding className="text-[#0534F0]" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="Enter company name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* BRN */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaIdCard className="text-[#98009E]" />
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="BRN"
                    value={formData.BRN}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="BRN-XXXX-XXXX"
                  />
                  {errors.BRN && <p className="text-red-500 text-sm">{errors.BRN}</p>}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaGlobe className="text-[#0534F0]" />
                    Country
                  </label>
                  <Select
                    options={options}
                    value={options.find((option) => option.value === formData.country)}
                    onChange={handleCountryChange}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '44px',
                        borderRadius: '0.5rem',
                        borderColor: '#D1D5DB',
                        '&:hover': { borderColor: '#9CA3AF' },
                        '&:focus-within': {
                          borderColor: '#0534F0',
                          boxShadow: '0 0 0 2px rgba(5, 52, 240, 0.1)'
                        }
                      })
                    }}
                  />
                  {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaBuilding className="text-[#98009E]" />
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="Full company address"
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaPhone className="text-[#0534F0]" />
                    Contact Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="contactNumber"
                      value={callingCode + formData.contactNumber.slice(callingCode.length)}
                      onChange={handleChange}
                      className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                      placeholder="Contact number"
                    />
                    
                  </div>
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaEnvelope className="text-[#98009E]" />
                    Company Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                    placeholder="company@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaKey className="text-[#0534F0]" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-3.5 text-gray-500 hover:text-[#0534F0]"
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* Directors Section */}
            <div className="space-y-8">
              {/* Director 1 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUser className="text-[#98009E]" />
                  Director 1 Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="director1Name"
                      value={formData.director1Name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                      placeholder="Director's full name"
                    />
                    {errors.director1Name && <p className="text-red-500 text-sm">{errors.director1Name}</p>}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="director1ContactNumber"
                        value={callingCode + formData.director1ContactNumber.slice(callingCode.length)}
                        onChange={handleChange}
                        className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                        placeholder="Contact number"
                      />
                     
                    </div>
                    {errors.director1ContactNumber && <p className="text-red-500 text-sm">{errors.director1ContactNumber}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="director1Email"
                      value={formData.director1Email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                      placeholder="director@email.com"
                    />
                    {errors.director1Email && <p className="text-red-500 text-sm">{errors.director1Email}</p>}
                  </div>
                </div>
              </div>

              {/* Director 2 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUser className="text-[#0534F0]" />
                  Director 2 Details (Optional)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="director2Name"
                      value={formData.director2Name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                      placeholder="Director's full name"
                    />
                    {errors.director2Name && <p className="text-red-500 text-sm">{errors.director2Name}</p>}
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="director2ContactNumber"
                        value={callingCode + formData.director2ContactNumber.slice(callingCode.length)}
                        onChange={handleChange}
                        className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                        placeholder="Contact number"
                      />
                      
                    </div>
                    {errors.director2ContactNumber && <p className="text-red-500 text-sm">{errors.director2ContactNumber}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="director2Email"
                      value={formData.director2Email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0534F0] focus:border-transparent"
                      placeholder="director@email.com"
                    />
                    {errors.director2Email && <p className="text-red-500 text-sm">{errors.director2Email}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#0534F0] to-[#98009E] hover:from-[#0429C7] hover:to-[#7A0080] text-white rounded-xl font-semibold text-lg transition-all shadow-lg"
            >
              Create Freight Agent Account
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddFreightAgent;