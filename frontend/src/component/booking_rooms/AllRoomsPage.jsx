 import React, { useState, useEffect } from "react";
 import ApiService from "../../service/ApiService";
 import Pagination from "../common/Pagination";
 import RoomResult from "../common/RoomResult";
 import RoomSearch from "../common/RoomSearch";


 
 const AllRoomsPage =() => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(9);


    const handleSearchResult = (results) => {
        setRooms(results)
        setFilteredRooms(results)
    }

    useEffect(() => {

        //get all rooms
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                setRooms(resp.rooms)
                setFilteredRooms(resp.rooms)
            } catch (error) {
                console.log(error)
            }
        }

        //get room types
        const ftechRoomsType = async() =>{

            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types)
                
            } catch (error) {
                
                console.log(error)
            }
        };
        fetchRooms();
        ftechRoomsType();
    }, []);


    //handle changes to room type filter
    const handleRoomTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedRoomType(selectedType)
        filterRooms(selectedType)
    }

    //filter rooms by type
    const filterRooms = (type) => {
        if (type === "") {
            setFilteredRooms(rooms)
        }else{
            const filtered = rooms.filter((room) => room.type === type)
            setFilteredRooms(filtered)
        }
        setCurrentPage(1)
    }

    //pagination calculation
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return(
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">All Rooms</h2>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter By Room Type</label>
                    <select 
                        value={selectedRoomType} 
                        onChange={handleRoomTypeChange}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="">All</option>
                        {roomTypes.map((type) => (
                            <option value={type} key={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <RoomSearch handSearchResult={handleSearchResult}/>
                <RoomResult roomSearchResults={currentRooms}/>

                <Pagination
                    roomPerPage={roomsPerPage}
                    totalRooms={filteredRooms.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </div>
        </div>
    )

 }

 export default AllRoomsPage;