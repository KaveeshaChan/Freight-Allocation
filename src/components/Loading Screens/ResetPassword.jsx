import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assests/CargoLogo.png';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const urlToken = new URLSearchParams(location.search).get('token');
  const isForced = !urlToken; // If no token in URL, assume forced reset.

  const token = isForced 
    ? localStorage.getItem('tempToken') 
    : urlToken;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add password validation
    if (newPassword.includes(' ') || confirmPassword.includes(' ')) {
      setError('Password cannot contain spaces');
      return;
    }

    if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (!token) {
        setError('Invalid or missing token');
        return;
    }

    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:5056/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword })
        });

        if (!response.ok) throw new Error('Password reset failed');

        if (isForced) { 
            localStorage.removeItem('tempToken');
        }

        navigate('/login');
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#F4F4F4]">
      <header className="flex items-center justify-center p-4 relative">
        <div className="w-full max-w-2xl bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-full p-4 flex items-center justify-center relative">
          <div className="absolute left-2 bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center shadow-lg">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cargo Connect</h1>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-10">
              {isForced ? 'Set New Password for First Login' : 'Reset Your Password'}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00B8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                    New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#2C2C2C]/20 focus:ring-2 focus:ring-[#0534F0] focus:border-transparent placeholder-[#2C2C2C]/50 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]/50 hover:text-[#0534F0] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mb-4">
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00B8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#2C2C2C]/20 focus:ring-2 focus:ring-[#0534F0] focus:border-transparent placeholder-[#2C2C2C]/50 pr-12"
                    placeholder="••••••••"
                />
                </div>
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
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Update Password'
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

export default PasswordReset;
