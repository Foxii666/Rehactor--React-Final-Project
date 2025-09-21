import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import supabase from '../supabase/supabase-client';
import GenresDropdown from './GenresDropdown';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import Searchbar from './Searchbar';

// LogoutButton bileşeni (stil güncellendi)
function LogoutButton({ setSession }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Errore durante il logout: ' + error.message);
      return;
    }
    setSession(null);
    navigate('/');
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

function Navbar() {
  const [session, setSession] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-gray-200 shadow-lg relative">
      <h2 className="text-2xl font-bold">
        <Link to="/Homepage" className="hover:text-gray-400 transition-colors">
          GameHub
        </Link>
      </h2>

      {/* Ana menü ve arama çubuğu */}
      <div className="flex items-center space-x-4">
        {/* Masaüstü arama çubuğu */}
        <div className="hidden md:block">
          <Searchbar />
        </div>

        {/* Mobil için arama butonu */}
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
                Ciao, {session.user.email}
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
                Il mio account
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

      {/* Mobil tam ekran arama çubuğu */}
      <div
        className={`fixed inset-0 bg-gray-900 z-50 p-4 transition-transform ${
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
      </div>
    </nav>
  );
}

export default Navbar;
