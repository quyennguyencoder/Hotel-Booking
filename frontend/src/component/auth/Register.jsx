import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";


const RegisterPage = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: ""
    });

    const [message, setMessage] = useState({type: "", text: ""});
    const navigate = useNavigate();

    //handle inouyt change
    const handleInputChange = ({target: {name, value}}) => 
        setFormData((prev) => ({... prev, [name]:value}));

    //validate from field
    const isFormValid = Object.values(formData).every((field) => field.trim());

    //handle form submissiion
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setMessage({type: "error", text: "Please fill all fields"})
            setTimeout(()=> setMessage({}), 5000);
            return;
        }
        try {
            const resp = await ApiService.registerUser(formData);
            if (resp.status === 200) {
                setMessage({type: "success", text: "User Registered successfully"})
                setTimeout(()=> navigate("/login"), 3000);
            }
            
        } catch (error) {
            setMessage({type: "error", text: error.response?.data?.message || error.message})
            setTimeout(()=> setMessage({}), 5000);
            
        }
    }


    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                {message.text && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        message.type === "error" 
                            ? "bg-red-100 border border-red-400 text-red-700" 
                            : "bg-green-100 border border-green-400 text-green-700"
                    }`}>
                        {message.text}
                    </div>
                )}

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Register</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {["firstName", "lastName", "email", "phoneNumber", "password"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <input 
                                type={field === "email" ? "email" : field === "password" ? "password" : "text"} 
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1").trim().toLowerCase()}`}
                            />
                        </div>
                    ))}
                    
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] mt-6"
                    >
                        Register
                    </button>
                </form>
                
                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )

}

export default RegisterPage;