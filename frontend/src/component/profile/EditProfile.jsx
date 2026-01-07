import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.myProfile();
                setUser(response.user);
                console.log(response.user)
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your account?. If you delete your account you will loose access to your profile and booking history')) {
            return;
        }
        try {
            await ApiService.deleteAccount();
            navigate('/signup');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Edit Profile</h2>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                
                {user && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="space-y-4 mb-8">
                            <div className="border-b pb-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold text-gray-800">First Name:</span> {user.firstName}
                                </p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold text-gray-800">Last Name:</span> {user.lastName}
                                </p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold text-gray-800">Email:</span> {user.email}
                                </p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold text-gray-800">Phone Number:</span> {user.phoneNumber}
                                </p>
                            </div>
                        </div>
                        <button 
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200" 
                            onClick={handleDeleteProfile}
                        >
                            Delete My Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfilePage;
