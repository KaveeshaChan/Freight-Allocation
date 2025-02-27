import React, { useState, useEffect } from 'react';
import logo from '../../assests/CargoLogo.png';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To store error message
  const [email, setEmail] = useState(""); // To store email input
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load stored credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  
    const apiUrl = "http://localhost:5056/api/login";
    const payload = { email, password };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong. Try again.");
      }

      const data = await response.json();
      const token = data.token;

            // Decode the token to get user role
      const decodedToken = jwtDecode(token);
      const roleName = decodedToken.roleName;
      const userId = decodedToken.userId
      const agentID = decodedToken.agentID

      // Store the token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", roleName);
      localStorage.setItem("userId", userId)
      localStorage.setItem("agentID", agentID)

      // Redirect based on role
      if (roleName === "admin") {
        window.location.href = "/All-Orders"; // Redirect to admin page
      } else if (roleName === "mainUser") {
        window.location.href = "/All-Orders"; // Redirect to main user page
      } else if (roleName === "freightAgent") {
        window.location.href = "/user-dashboard";
      } else if (roleName === "coordinator") {
        window.location.href = "/user-dashboard"; // Redirect to common user page
      } else {
        throw new Error("Unknown role");
      }
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#F4F4F4]">
      {/* Gradient Header */}
      <header className="flex items-center justify-center p-4 relative">
        {/* Rounded rectangle background for the header */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-[#0534F0] to-[#98009E] rounded-full p-4 flex items-center justify-center relative">
          {/* Circle for logo */}
          <div className="absolute left-2 bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center shadow-lg">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          </div>

            {/* Title "Cargo Connect" */}
            <h1 className="text-2xl font-bold text-white">
              Cargo Connect
            </h1>
          </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-8 relative">
              Welcome
              
            </h2>

            {errorMessage && (
              <div className="flex items-center bg-[#E63946]/10 text-[#E63946] px-4 py-3 rounded-lg mb-6 text-sm border border-[#E63946]/20">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00B8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-[#2C2C2C]">
                  <input
                    type="checkbox"
                    className="rounded border-[#2C2C2C]/30 text-[#0534F0] focus:ring-[#0534F0]"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
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
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In →'
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

export default LoginPage;