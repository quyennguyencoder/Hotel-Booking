import React from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";


const RoomResult = ({roomSearchResults}) => {
    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();

    return (
        <section className="my-8">
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomSearchResults.map(room=>(
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300" key={room.id}>
                            <img 
                                className="w-full h-48 object-cover" 
                                src={room.imageUrl} 
                                alt={room.roomNumber} 
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{room.type}</h3>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold text-blue-600">${room.pricePerNight}</span>/Night
                                </p>
                                <p className="text-gray-600 text-sm mb-4">{room.description}</p>

                                <div className="mt-4">
                                    {isAdmin ? (
                                        <button 
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200" 
                                            onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                                        >
                                            Edit Room
                                        </button>
                                    ): (
                                        <button 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200" 
                                            onClick={() => navigate(`/room-details/${room.id}`)}
                                        >
                                            View/Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );

}
export default RoomResult;