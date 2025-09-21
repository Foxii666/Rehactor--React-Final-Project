import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FaStar, FaCalendarAlt, FaGamepad, FaLaptop } from 'react-icons/fa';
import ToggleFavorite from './ToggleFavorite';
import Chatbox from '../components/Chatbox';

export default function GamePage() {
  // Get the game ID from the URL parameters
  const { id } = useParams();

  // State for game data, loading state, and errors
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your RAWG API key
  const rawgApiKey = '9269195f491e44539d7a2d10ce87ab15';

  // Fetch game details when the component mounts or the ID changes
  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError('Game ID not found.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${rawgApiKey}`
        );
        if (!response.ok) {
          throw new Error('API response failed.');
        }
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetails();
  }, [id, rawgApiKey]);

  // Loading, error, and no-data states
  if (loading) {
    return (
      <p className="text-gray-400 text-center text-lg mt-8">
        Loading game details...
      </p>
    );
  }
  if (error) {
    return (
      <article className="text-red-400 text-center text-lg mt-8">
        Error: {error}
      </article>
    );
  }
  if (!game) {
    return (
      <p className="text-gray-400 text-center text-lg mt-8">Game not found.</p>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 text-gray-200">
      {/* Game Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-center md:text-left">
        {game.name}
      </h1>

      {/* Main Game Image */}
      <div className="w-full rounded-lg overflow-hidden shadow-2xl mb-8">
        {game.background_image && (
          <img
            src={game.background_image}
            alt={game.name || 'game'}
            className="w-full h-96 object-cover object-center"
          />
        )}
      </div>

      {/* Game Details & Favorite Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8 gap-4">
        <div className="flex items-center space-x-6">
          {/* Rating */}
          <div className="flex items-center space-x-2 text-yellow-400">
            <FaStar size={20} />
            <span className="text-lg font-semibold">{game.rating} / 5</span>
          </div>
          {/* Release Date */}
          <div className="flex items-center space-x-2 text-gray-400">
            <FaCalendarAlt size={20} />
            <span className="text-lg font-semibold">{game.released}</span>
          </div>
        </div>
        {/* Favorite Button */}
        <ToggleFavorite data={game} />
      </div>

      {/* Game Description & Chatbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Game Description & Details */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About the Game</h2>
          {/* Using dangerouslySetInnerHTML for raw HTML descriptions from the API */}
          <div
            className="text-gray-400 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: game.description }}
          />

          {/* Additional Info (Platforms, Genres, etc.) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-1">
                <FaGamepad className="mr-2 text-green-400" /> Genres
              </h3>
              <p className="text-gray-400">
                {game.genres.map((g) => g.name).join(', ')}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 flex items-center mb-1">
                <FaLaptop className="mr-2 text-purple-400" /> Platforms
              </h3>
              <p className="text-gray-400">
                {game.platforms.map((p) => p.platform.name).join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Game Chatbox */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Game Chat</h2>
          <Chatbox data={game} />
        </div>
      </div>
    </main>
  );
}
