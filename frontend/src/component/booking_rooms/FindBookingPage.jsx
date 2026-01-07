import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState(''); // State variable for confirmation code
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please Enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            // Call API to get booking details
            const response = await ApiService.getBookingByReference(confirmationCode);
            setBookingDetails(response.booking);
            setError(null); // Clear error if successful
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Find Booking</h2>
                
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex gap-4">
                        <input
                            required
                            type="text"
                            placeholder="Enter your booking confirmation code"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Find
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                
                {bookingDetails && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-gray-600"><span className="font-semibold">Booking Code:</span> {bookingDetails.bookingReference}</p>
                                <p className="text-gray-600"><span className="font-semibold">Check-in Date:</span> {bookingDetails.checkInDate}</p>
                                <p className="text-gray-600"><span className="font-semibold">Check-out Date:</span> {bookingDetails.checkOutDate}</p>
                            </div>
                            <div>
                                <p className="text-gray-600"><span className="font-semibold">Payment Status:</span> <span className={bookingDetails.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{bookingDetails.paymentStatus}</span></p>
                                <p className="text-gray-600"><span className="font-semibold">Amount:</span> <span className="text-blue-600 font-bold">${bookingDetails.totalPrice}</span></p>
                                <p className="text-gray-600"><span className="font-semibold">Booking Status:</span> {bookingDetails.bookingStatus}</p>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        <h3 className="text-xl font-bold text-gray-800 mb-4">Booker Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <p className="text-gray-600"><span className="font-semibold">First Name:</span> {bookingDetails.user.firstName}</p>
                            <p className="text-gray-600"><span className="font-semibold">Last Name:</span> {bookingDetails.user.lastName}</p>
                            <p className="text-gray-600"><span className="font-semibold">Email:</span> {bookingDetails.user.email}</p>
                            <p className="text-gray-600"><span className="font-semibold">Phone Number:</span> {bookingDetails.user.phoneNumber}</p>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        <h3 className="text-xl font-bold text-gray-800 mb-4">Room Details</h3>
                        <div className="space-y-2 mb-4">
                            <p className="text-gray-600"><span className="font-semibold">Room Number:</span> {bookingDetails.room.roomNumber}</p>
                            <p className="text-gray-600"><span className="font-semibold">Room Type:</span> {bookingDetails.room.type}</p>
                            <p className="text-gray-600"><span className="font-semibold">Room Capacity:</span> {bookingDetails.room.capacity} guests</p>
                        </div>
                        <img 
                            src={bookingDetails.room.imageUrl} 
                            alt="Room" 
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindBookingPage;
