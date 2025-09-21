import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SessionContext from '../context/SessionContext';
import { FavoritesContext } from '../context/FavoritesProvider';
import supabase from '../supabase/supabase-client';
import Avatar from '../components/Avatar';
import {
  FaTrashAlt,
  FaHeart,
  FaRegHeart,
  FaUser,
  FaCog,
  FaSave,
  FaExclamationCircle,
} from 'react-icons/fa';

function AccountPage() {
  const context = useContext(SessionContext);
  const favoritesContext = useContext(FavoritesContext);
  const navigate = useNavigate();

  const session = context?.session || null;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!session?.user?.id) return;

    let ignore = false;

    const getProfile = async () => {
      try {
        setLoading(true);
        setMessage('');

        const { data, error } = await supabase
          .from('profiles')
          .select('username, first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          if (!ignore) {
            setMessage('Error loading profile');
            setMessageType('error');
          }
          return;
        }

        if (!ignore && data) {
          setUsername(data.username || '');
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        if (!ignore) {
          setMessage('Unexpected error occurred');
          setMessageType('error');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  const updateProfile = async (event) => {
    event.preventDefault();

    if (!session) {
      setMessage('No active session');
      setMessageType('error');
      return;
    }

    setUpdating(true);
    setMessage('');

    try {
      if (!username.trim()) {
        throw new Error('Username is required');
      }
      if (!first_name.trim()) {
        throw new Error('First name is required');
      }
      if (!last_name.trim()) {
        throw new Error('Last name is required');
      }

      const updates = {
        id: session.user.id,
        username: username.trim(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        onConflict: 'id',
      });

      if (error) {
        throw error;
      }

      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Update error:', error);
      setMessage(error.message || 'Error updating profile');
      setMessageType('error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = (url) => {
    setAvatarUrl(url);
    setMessage('Avatar updated! Remember to save your changes.');
    setMessageType('success');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header - Simplified */}
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {first_name} {last_name}
                </h1>
                <p className="text-gray-600">@{username}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Profile Information
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeTab === 'favorites'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ❤️ Favorite Games
              </button>
            </nav>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mx-6 mt-6 p-4 rounded-lg ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              <div className="flex items-center">
                {messageType === 'error' ? (
                  <FaExclamationCircle className="flex-shrink-0 mr-3" />
                ) : (
                  <FaHeart className="flex-shrink-0 mr-3" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Profile Picture
                    </h3>
                    <div className="flex justify-center mb-4">
                      <Avatar
                        url={avatarUrl}
                        size={150}
                        onUpload={handleAvatarUpload}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      JPG, GIF or PNG files. Max size 5MB.
                    </p>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <form onSubmit={updateProfile} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="text"
                        value={session.user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username *
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        disabled={updating}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name *
                        </label>
                        <input
                          id="first_name"
                          type="text"
                          value={first_name}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          disabled={updating}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name *
                        </label>
                        <input
                          id="last_name"
                          type="text"
                          value={last_name}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          disabled={updating}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Favorite Games
                </h3>

                {!favoritesContext ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <FaExclamationCircle className="text-red-500 text-2xl mx-auto mb-3" />
                    <p className="text-red-700">
                      Favorites system is currently unavailable. Please try
                      again later.
                    </p>
                  </div>
                ) : favoritesContext.favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaRegHeart className="text-gray-400 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No favorites yet
                    </h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Click the heart icon on game pages to add them to your
                      favorites.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-96 overflow-y-auto py-1">
                    {favoritesContext.favorites.map((game) => (
                      <div
                        key={game.id || game.game_id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <img
                            width={50}
                            height={50}
                            src={game.game_image || game.image}
                            alt={game.game_name || game.game?.name}
                            className="rounded-lg object-cover flex-shrink-0 shadow-sm"
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/50x50/6366f1/ffffff?text=🎮';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {game.game_name || game.game?.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              Added to favorites
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            favoritesContext.removeFavorite(
                              game.game_id || game.id
                            )
                          }
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors duration-200 hover:bg-red-50"
                          title="Remove from favorites"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
