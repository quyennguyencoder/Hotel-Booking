import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();

  const redirectPath = state?.from?.pathname || "/home";

  //handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) =>{
    e.preventDefault()
    const {email, password} = formData;

    if (!email || !password) {
        setError("Please fill all input")
        setTimeout(() => setError(""), 5000);
        return;
    }

    try {
        const {status, token, role} = await ApiService.loginUser(formData);
        if (status === 200) {
            ApiService.saveToken(token)
            ApiService.saveRole(role)
            navigate(redirectPath, {replace: true})
        }
        
    } catch (error) {
        setError(error.response?.data?.message || error.message)
        setTimeout(() => setError(""), 5000);
        
    }
  }



  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {["email", "password"].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.charAt(0).toLocaleUpperCase() + field.slice(1)}
                        </label>
                        <input 
                            type={field === "password" ? "password" : "email"} 
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder={`Enter your ${field}`}
                        />
                    </div>
                ))}
                
                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
                >
                    Login
                </button>
            </form>
            
            <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Register
                </a>
            </p>
        </div>
    </div>
)




};





export default LoginPage;
