import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import download from '../../public/images/download.png';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <header className="bg-white shadow-md py-6">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/">
          <div className="flex items-center space-x-2 ml-2">
            <img
              src={download} // Replace with your logo URL
              alt="Blog Verse Logo"
              className="h-10"
            />
            <span className="text-black font-bold text-lg">MEMO</span>
          </div>
        </Link>
        <div className="flex space-x-4 mr-4">
          {user ? (
            <div className="relative">
              {/* User Section with Dropdown */}
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <FaUserCircle className="text-2xl text-black" />
                <span className="text-black">{user.name}</span>
                <FaCaretDown className="text-gray-500" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Sign In Link */}
              <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600">
                <FaSignInAlt className="mr-2" />
                Sign In
              </Link>
              {/* Sign Up Link */}
              <Link to="/register" className="flex items-center text-gray-700 hover:text-blue-600">
                <FaSignInAlt className="mr-2" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
