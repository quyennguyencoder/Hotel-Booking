import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../service/ApiService";



function Navbar() {
    const isAuthenticated = ApiService.isAthenticated();
    const isCustomer = ApiService.isCustomer();
    const isAdmin = ApiService.isAdmin();

    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?")
        if (isLogout) {
            ApiService.logout();
            navigate("/home");
        }
    }

    return(
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Brand */}
                    <div className="text-2xl font-bold">
                        <NavLink 
                            to="/home" 
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Hotel California
                        </NavLink>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex items-center space-x-6">
                        <li>
                            <NavLink 
                                to="/home" 
                                className={({isActive}) => 
                                    `font-medium transition-colors ${
                                        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/rooms" 
                                className={({isActive}) => 
                                    `font-medium transition-colors ${
                                        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Rooms
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/find-booking" 
                                className={({isActive}) => 
                                    `font-medium transition-colors ${
                                        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                    }`
                                }
                            >
                                Find My Bookings
                            </NavLink>
                        </li>

                        {isCustomer && (
                            <li>
                                <NavLink 
                                    to="/profile" 
                                    className={({isActive}) => 
                                        `font-medium transition-colors ${
                                            isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                        }`
                                    }
                                >
                                    Profile
                                </NavLink>
                            </li>
                        )}
                        
                        {isAdmin && (
                            <li>
                                <NavLink 
                                    to="/admin" 
                                    className={({isActive}) => 
                                        `font-medium transition-colors ${
                                            isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                                        }`
                                    }
                                >
                                    Admin
                                </NavLink>
                            </li>
                        )}

                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink 
                                        to="/login" 
                                        className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink 
                                        to="/register" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {isAuthenticated && (
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;