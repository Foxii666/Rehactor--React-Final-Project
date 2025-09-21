import React, { useContext } from 'react';
import {
  FaTrashAlt,
  FaHeartBroken,
  FaExclamationTriangle,
} from 'react-icons/fa';
// Assuming these contexts are provided by a parent component
import SessionContext from './contexts/SessionContext';
import { FavoritesContext } from './contexts/FavoritesContext';

// This component uses Tailwind CSS for styling.
// Custom CSS for the loading spinner, as it's not a standard Tailwind component.
const loadingSpinnerStyle = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
`;

export default function ProfilePage() {
  const { session } = useContext(SessionContext);
  const favoritesContext = useContext(FavoritesContext);

  // Check if context is available to prevent errors
  if (!favoritesContext) {
    return (
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Hey {session?.user?.user_metadata?.first_name || 'User'}
        </h2>
        <div className="flex flex-col items-center justify-center bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-6 text-center text-red-800 dark:text-red-200 mt-6">
          <FaExclamationTriangle size={24} className="mb-4 text-red-500" />
          <h3 className="text-xl font-semibold">
            Favorites System Unavailable
          </h3>
          <p className="mt-2 text-sm">
            Your favorite games cannot be displayed at the moment. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  const { favorites, removeFavorite, loading } = favoritesContext;

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <style>{loadingSpinnerStyle}</style>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Hey {session?.user?.user_metadata?.first_name || 'User'}
        </h2>
        <div className="flex flex-col items-center justify-center p-10">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your favorite games...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Hey {session?.user?.user_metadata?.first_name || 'User'}
      </h2>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 shadow-md">
        <h3 className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Your Favorite Games
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
            {' '}
            ({favorites.length})
          </span>
        </h3>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-gray-500 dark:text-gray-400">
            <FaHeartBroken size={32} className="mb-4 opacity-50" />
            <p className="text-center">
              You haven't added any favorite games yet.
            </p>
            <p className="text-sm text-center mt-2">
              You can add games to your favorites by clicking the heart icon on
              their pages.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {favorites.map((game) => (
              <div
                key={game.id || game.game_id}
                className="flex items-center gap-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <img
                  width={50}
                  height={50}
                  src={game.game_image || game.image}
                  alt={game.game?.name || game.game_name || 'Game'}
                  className="rounded-md object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/50x50/333/fff?text=🎮';
                  }}
                />
                <span className="text-gray-900 dark:text-white font-medium flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {game.game?.name || game.game_name}
                </span>
                <button
                  onClick={() => removeFavorite(game.game_id || game.id)}
                  className="text-red-500 p-2 rounded-full transition-colors duration-200 ease-in-out hover:bg-red-100 dark:hover:bg-red-900"
                  title="Remove from favorites"
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
