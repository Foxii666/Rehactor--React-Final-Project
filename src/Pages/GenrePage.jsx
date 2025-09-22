import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CardGame from '../components/CardGame';

export default function GenrePage() {
  const { genre } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch games when the component mounts or when the genre changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&genres=${genre}&dates=2024-01-01,2024-12-31&page=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (genre) {
      fetchData();
    }
  }, [genre]);

  // Format genre name for display
  const formatGenreName = (slug) => {
    if (!slug) return 'Games';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-8">
        {formatGenreName(genre)} Games
      </h1>

      {loading && (
        <p className="text-gray-400 text-center text-lg">Loading games...</p>
      )}

      {error && (
        <article className="text-red-400 text-center text-lg">
          Error: {error}
        </article>
      )}

      {/* Game Cards - Using the EXACT same pattern as HomePage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.results?.length > 0
          ? data.results.map((game) => <CardGame key={game.id} game={game} />)
          : !loading &&
            !error && (
              <p className="text-gray-400 text-center text-lg col-span-full">
                No games found for this genre.
              </p>
            )}
      </div>
    </main>
  );
}
