import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';


const AdminPage = () => {

    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate()


    useEffect(() =>{
        const fetchAdminName = async () => {
            try {
                const resp = await ApiService.myProfile();
                setAdminName(resp.user.firstName)
                
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchAdminName();
    }, []);


    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold text-white text-center mb-12">
                    Welcome, {adminName}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <button 
                        className="bg-white hover:bg-gray-100 rounded-2xl shadow-2xl p-8 transition-all duration-300 transform hover:scale-105" 
                        onClick={()=> navigate('/admin/manage-rooms')}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">🛏️</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Rooms</h2>
                            <p className="text-gray-600">Add, edit, or delete hotel rooms</p>
                        </div>
                    </button>
                    <button 
                        className="bg-white hover:bg-gray-100 rounded-2xl shadow-2xl p-8 transition-all duration-300 transform hover:scale-105" 
                        onClick={()=> navigate('/admin/manage-bookings')}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Bookings</h2>
                            <p className="text-gray-600">View and manage all bookings</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )

}
export default AdminPage;