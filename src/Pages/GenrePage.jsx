import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CardGame from '../components/CardGame';

export default function GenrePage() {
  // Get the genre slug from the URL parameters
  const { genre } = useParams();

  // State to hold fetched data, loading state, and any errors
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your RAWG API key (make sure it's correct)
  const rawgApiKey = '9269195f491e44539d7a2d10ce87ab15';

  // Fetch games when the component mounts or when the genre changes
  useEffect(() => {
    const initialUrl = `https://api.rawg.io/api/games?genres=${genre}&key=${rawgApiKey}&dates=2024-01-01,2024-12-31&page=1`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(initialUrl);
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        // Set the games data to the results array
        setGames(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genre]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-8 capitalize">
        {genre} Oyunları
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-400 text-center text-lg">
          Oyunlar yükleniyor...
        </p>
      )}

      {/* Error State */}
      {error && (
        <article className="text-red-400 text-center text-lg">
          Hata: {error}
        </article>
      )}

      {/* No Games Found State */}
      {!loading && !error && games.length === 0 && (
        <p className="text-gray-400 text-center text-lg col-span-full">
          Bu türde oyun bulunamadı.
        </p>
      )}

      {/* The responsive grid container for game cards */}
      {/* This is the key fix that ensures a correct layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map((game) => (
          <CardGame key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
