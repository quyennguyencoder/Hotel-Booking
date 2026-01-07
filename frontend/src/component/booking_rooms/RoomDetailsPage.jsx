import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  //state management
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDaysToStay, setTotalDaysToStay] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBookingPreview, setShowBookingPreview] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //fetch room details

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const resp = await ApiService.getRoomById(roomId);
        setRoom(resp.room);

        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomDetails();
  }, []);

  //Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const oneDay = 24 * 60 * 60 * 1000; ///this is number in milisec

    const totalDays = Math.round(
      Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)
    ); //give the difference in millsec

    setTotalDaysToStay(totalDays);

    return room?.pricePerNight * totalDays || 0;
  };

  //handle booking confirmation
  const handleConfirmation = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setTotalPrice(calculateTotalPrice());
    setShowBookingPreview(true);
  };

  const acceptBooking = async () => {
    console.log("Inside acceptBooking()");
    try {
      const formattedCheckInDate = checkInDate.toLocaleDateString("en-CA");
      const formatterdCheckOutDate = checkOutDate.toLocaleDateString("en-CA");

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formatterdCheckOutDate,
        roomId: room.id,
      };

      const resp = await ApiService.bookRoom(booking);

      if (resp.status === 200) {
        setShowMessage(
          "Your Booking is Successful. Your booking details have been sent to your email . Please proceeed for payment"
        );
        setTimeout(() => {
          setShowMessage(null);
          navigate("/rooms");
        }, 8000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  // If room is null, show loading
  if (!room) {
    return <div>Loading...</div>;
  }

  const { roomNumber, type, pricePerNight, capacity, description, imageUrl } = room;

  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Success and Error Messages */}
        {showMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {showMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Room Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 p-6 border-b">Room Details</h2>
          <img src={imageUrl} alt={type} className="w-full h-96 object-cover" />
          <div className="p-6 space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">{type}</h3>
            <p className="text-gray-600"><span className="font-semibold">Room Number:</span> {roomNumber}</p>
            <p className="text-gray-600"><span className="font-semibold">Capacity:</span> {capacity} guests</p>
            <p className="text-gray-600"><span className="font-semibold">Price:</span> <span className="text-blue-600 text-xl font-bold">${pricePerNight}</span> / night</p>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>

        {/* Booking Controls */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            onClick={() => setShowDatePicker(true)}
          >
            Select Dates
          </button>
          
          {showDatePicker && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                <DayPicker
                  selected={checkInDate}
                  onDayClick={setCheckInDate}
                  disabled={(date) => checkOutDate && date > checkOutDate}
                  className="mx-auto"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                <DayPicker
                  selected={checkOutDate}
                  onDayClick={setCheckOutDate}
                  disabled={(date) => checkInDate && date < checkInDate}
                  className="mx-auto"
                />
              </div>

              <div className="md:col-span-2">
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200" 
                  onClick={handleConfirmation}
                >
                  Proceed
                </button>
              </div>
            </div>
          )}

          {/* Booking Preview and submit */}
          {showBookingPreview && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Preview</h3>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <strong>Check-in Date:</strong>{" "}
                  {checkInDate?.toLocaleDateString("en-CA")}
                </p>
                <p className="text-gray-700">
                  <strong>Check-out Date:</strong>{" "}
                  {checkOutDate?.toLocaleDateString("en-CA")}
                </p>
                <p className="text-gray-700">
                  <strong>Total Days To Stay:</strong> {totalDaysToStay}
                </p>
                <p className="text-gray-700">
                  <strong>Total Price:</strong> <span className="text-blue-600 text-xl font-bold">${totalPrice}</span>
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={acceptBooking}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Confirm and Book
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  onClick={() => setShowBookingPreview(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
