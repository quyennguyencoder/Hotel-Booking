import React from "react";

const Pagination = ({ roomPerPage, totalRooms, currentPage, paginate }) => {

    const pageNumber = [];

    for(let i = 1; i <= Math.ceil(totalRooms / roomPerPage); i++){
        pageNumber.push(i);
    }

    return(
        <div className="flex justify-center my-8">
            <ul className="flex space-x-2">
                {pageNumber.map((number)=>(
                    <li key={number}>
                        <button 
                            onClick={()=> paginate(number)} 
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                currentPage === number 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default Pagination;
