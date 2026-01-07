import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const myProfileResponse = await ApiService.myProfile();
                setUser(myProfileResponse.user)
                // Fetch user bookings using the fetched user ID
                const myBookingResponse = await ApiService.myBookings();
                setBookings(myBookingResponse.bookings)

            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {user && <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome, {user.firstName}</h2>}
                
                <div className="flex gap-4 mb-8">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200" 
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                
                {user && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">My Profile Details</h3>
                        <div className="space-y-2">
                            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-600"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                        </div>
                    </div>
                )}
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">My Booking History</h3>
                    <div className="space-y-6">
                        {bookings && bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-600"><strong>Booking Code:</strong> {booking.bookingReference}</p>
                                            <p className="text-gray-600"><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                            <p className="text-gray-600"><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                            <p className="text-gray-600"><strong>Room Number:</strong> {booking.room.roomNumber}</p>
                                            <p className="text-gray-600"><strong>Room Type:</strong> {booking.room.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600"><strong>Payment Status:</strong> <span className={booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{booking.paymentStatus}</span></p>
                                            <p className="text-gray-600"><strong>Booking Status:</strong> {booking.bookingStatus}</p>
                                            <p className="text-gray-600"><strong>Amount:</strong> <span className="text-blue-600 font-bold text-xl">${booking.totalPrice}</span></p>
                                        </div>
                                    </div>
                                    <img src={booking.room.imageUrl} alt="Room" className="w-full h-48 object-cover rounded-lg" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">No bookings found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
