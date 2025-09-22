import React, { useState, useEffect } from 'react';
import CardGame from '../components/CardGame';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Her page değişiminde veri çek
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&dates=2024-01-01,2024-12-31&page=${page}`;
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

    fetchData();
  }, [page]);

  const nextPage = () => {
    if (data?.next) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-8">
        Latest Games
      </h1>

      {loading && (
        <p className="text-gray-400 text-center text-lg">Loading games...</p>
      )}

      {error && (
        <article className="text-red-400 text-center text-lg">{error}</article>
      )}

      {/* Oyun Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.results?.length > 0
          ? data.results.map((game) => <CardGame key={game.id} game={game} />)
          : !loading &&
            !error && (
              <p className="text-gray-400 text-center text-lg col-span-full">
                No games found.
              </p>
            )}
      </div>

      {/* Sayfalama Butonları */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>

        <span className="text-gray-300 self-center">Page {page}</span>

        <button
          onClick={nextPage}
          disabled={!data?.next}
          className={`px-4 py-2 rounded ${
            !data?.next
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
}
