import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assests/CargoLogo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5056/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess('Password reset email sent. Check your inbox!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#F4F4F4]">
      {/* Gradient Header */}
      <header className="flex items-center justify-center p-4 relative">
        <div className="w-full max-w-2xl bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-full p-4 flex items-center justify-center relative">
          <div className="absolute left-2 bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center shadow-lg">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cargo Connect</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">Forgot Password</h2>
            <p className="text-[#2C2C2C]/70 mb-8">Enter your email to reset your password</p>

            {error && (
              <div className="flex items-center bg-[#E63946]/10 text-[#E63946] px-4 py-3 rounded-lg mb-6 text-sm border border-[#E63946]/20">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm border border-green-200">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00B8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#2C2C2C]/20 focus:ring-2 focus:ring-[#0534F0] focus:border-transparent placeholder-[#2C2C2C]/50"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#0534F0] to-[#98009E] text-white font-semibold 
                          hover:from-[#5F72F3] hover:to-[#C057CB] transition-all duration-300 
                          disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link →'
                  )}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;