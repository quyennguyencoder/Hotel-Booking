import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";


const HomePage = () => {

    const [roomSearchResult, setRoomSearchResult] = useState([]);

    //funtion to handle search result
    const handleSearchResult = (results) => {
        setRoomSearchResult(results);
        console.log("ReSILT IS: " + results)
    }


    return(
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[600px] overflow-hidden">
                <img 
                    src="./images/bg.jpg" 
                    alt="Hotel" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        Welcome to <span className="text-blue-400">Hotel California</span>
                    </h1>
                    <h3 className="text-xl md:text-2xl font-light">Step into a haven of comfort and care</h3>
                </div>
            </section>

            {/* Search Section */}
            <div className="container mx-auto px-4 py-8">
                <RoomSearch handSearchResult={handleSearchResult}/>
                <RoomResult roomSearchResults={roomSearchResult}/>

                <div className="text-center my-8">
                    <a 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg" 
                        href="/rooms"
                    >
                        View All Rooms
                    </a>
                </div>

                {/* Services Section */}
                <h2 className="text-3xl md:text-4xl font-bold text-center my-12">
                    Services at <span className="text-blue-600">Hotel California</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="./images/ac.png" 
                            alt="Air Conditioning" 
                            className="w-16 h-16 mx-auto mb-4"
                        />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Air Conditioning</h3>
                            <p className="text-gray-600 text-sm">
                                Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="./images/mini-bar.png" 
                            alt="Mini Bar" 
                            className="w-16 h-16 mx-auto mb-4"
                        />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Mini Bar</h3>
                            <p className="text-gray-600 text-sm">
                                Enjoy a convenient selection of beverages and snacks stocked in your room's mini bar with no additional cost.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="./images/parking.png" 
                            alt="Parking" 
                            className="w-16 h-16 mx-auto mb-4"
                        />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Parking</h3>
                            <p className="text-gray-600 text-sm">
                                We offer on-site parking for your convenience. Please inquire about valet parking options if available.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                        <img 
                            src="./images/wifi.png" 
                            alt="WiFi" 
                            className="w-16 h-16 mx-auto mb-4"
                        />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">WiFi</h3>
                            <p className="text-gray-600 text-sm">
                                Stay connected throughout your stay with complimentary high-speed Wi-Fi access available in all guest rooms and public areas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default HomePage
