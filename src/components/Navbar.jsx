import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router'; // v5 için bıraktım
import supabase from '../supabase/supabase-client';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';

// LogoutButton component
function LogoutButton({ setSession }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout: ' + error.message);
      return;
    }
    setSession(null);
    navigate('/Homepage');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  );
}

// Searchbar component
function Searchbar({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setQuery('');
      if (onClose) onClose();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <input
        type="text"
        placeholder="Search for games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Mevcut session'ı al
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) navigate('/Homepage'); // sayfa yenilenince yönlendirme
    });

    // Auth değişikliklerini dinle
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession) navigate('/Homepage'); // login olduğunda yönlendir
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-gray-200 shadow-lg relative">
      <h2 className="ms-10 text-2xl font-bold">
        <Link to="/Homepage" className="hover:text-gray-400 transition-colors">
          GameHub
        </Link>
      </h2>

      <div className="flex items-center space-x-4">
        {/* Desktop Searchbar */}
        <div className="hidden md:block">
          <Searchbar />
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden text-gray-200 text-xl"
        >
          <FaSearch />
        </button>

        {session ? (
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center focus:outline-none hover:text-gray-400 transition-colors"
            >
              <FaUserCircle className="mr-2 text-2xl" />
              <span className="hidden md:inline">
                Hello, {session.user.email}
              </span>
            </button>
            <div
              className={`absolute right-0 mt-2 py-2 w-48 bg-gray-800 rounded-md shadow-xl z-20 ${
                isUserMenuOpen ? 'block' : 'hidden'
              }`}
            >
              <Link
                to="/AccountPage"
                className="flex items-center px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <FaUserCircle className="mr-2" />
                My Account
              </Link>
              <div className="border-t border-gray-700 my-1" />
              <LogoutButton setSession={setSession} />
            </div>
          </div>
        ) : (
          <ul className="flex items-center space-x-4">
            <li>
              <Link
                to="/login"
                className="flex items-center hover:text-gray-400 transition-colors"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center hover:text-gray-400 transition-colors"
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Mobile full-screen search bar */}
      <div
        className={`fixed inset-0 bg-gray-900 z-50 p-4 transition-transform duration-300 ease-in-out ${
          isSearchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-white text-3xl"
          >
            <FaTimes />
          </button>
        </div>
        <Searchbar onClose={() => setIsSearchOpen(false)} />
      </div>
    </nav>
  );
}
