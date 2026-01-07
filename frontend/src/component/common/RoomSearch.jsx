import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";

const RoomSearch = ({ handSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndtDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  //state for controlling calander visibility
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.log("Error fetching RoomTypes" + error);
      }
    };
    fetchRoomTypes();
  }, []);

  const haandleClickOutside = (event) => {
    if (startDateRef.current && !startDateRef.current.contains(event.target)) {
      setStartDatePickerVisible(false);
    }
    if (endDateRef.current && !endDateRef.current.contains(event.target)) {
      setEndDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", haandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", haandleClickOutside);
    };
  }, []);

  //shoe error
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, timeout);
  };

  //this will fetch the rooms avialbale from our api
  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Please select fields");
      return false;
    }

    try {
      const formattedStartDate = startDate
        ? startDate.toLocaleDateString("en-CA")
        : null;
      const formattedEndDate = endDate
        ? endDate.toLocaleDateString("en-CA")
        : null;


      const resp = await ApiService.getAvailableRooms(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (resp.status === 200) {
        if (resp.rooms.length === 0) {
          showError("Room type not cuttently available for the selected date");
          return;
        }
        handSearchResult(resp.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };


return (
    <section className="my-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Check-in date and calendar field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
            <input
              type="text"
              value={startDate ? startDate.toLocaleDateString() : ""}
              placeholder="Select Check-In Date"
              onFocus={() => setStartDatePickerVisible(true)}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
            />
    
            {isStartDatePickerVisible && (
              <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200" ref={startDateRef}>
                <DayPicker
                  selected={startDate}
                  onDayClick={(date) => {
                    setStartDate(date);
                    setStartDatePickerVisible(false);
                  }}
                  month={startDate}
                />
              </div>
            )}
          </div>
    
          {/* Check-out date and calendar field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date</label>
            <input
              type="text"
              value={endDate ? endDate.toLocaleDateString() : ""}
              placeholder="Select Check-Out Date"
              onFocus={() => setEndDatePickerVisible(true)}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
            />
    
            {isEndDatePickerVisible && (
              <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200" ref={endDateRef}>
                <DayPicker
                  selected={endDate}
                  onDayClick={(date) => {
                    setEndtDate(date);
                    setEndDatePickerVisible(false);
                  }}
                  month={startDate}
                />
              </div>
            )}
          </div>
    
          {/* Room type selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select 
              value={roomType} 
              onChange={(e)=> setRoomType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option disabled value="">Select Room Type</option>
              {roomTypes.map((roomType) =>(
                <option value={roomType} key={roomType}>
                  {roomType}
                </option>
              ))}
            </select>
          </div>
    
          {/* Search button */}
          <div className="flex items-end">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200" 
              onClick={handleInternalSearch}
            >
              Search Rooms
            </button>
          </div>
        </div>
      </div>
    
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </section>
  );
};


export default RoomSearch;
