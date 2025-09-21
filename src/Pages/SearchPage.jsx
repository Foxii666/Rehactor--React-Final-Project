import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { FaStar, FaCalendarAlt, FaGamepad } from 'react-icons/fa';

// CardGame component - HomePage'dekiyle TAMAMEN AYNI
const CardGame = ({ game }) => {
  return (
    <div className="group bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={
            game.background_image ||
            'https://placehold.co/400x250/4a5568/fff?text=No+Image'
          }
          alt={game.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/400x250/4a5568/fff?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-sm font-bold px-2 py-1 rounded-md flex items-center">
          <FaStar className="mr-1 text-yellow-300" />
          {game.rating || 'N/A'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 h-14">
          {game.name}
        </h3>

        <div className="flex items-center text-gray-400 mb-3">
          <FaCalendarAlt className="mr-2" />
          <span className="text-sm">{game.released || 'TBA'}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {game.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 mt-2">
        <Link
          to={`/game/${game.id}`}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <FaGamepad className="mr-2" />
          View Details
        </Link>
      </div>
    </div>
  );
};

// useFetchSolution hook
const useFetchSolution = (initialUrl) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [url, setUrl] = React.useState(initialUrl);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (url) {
      fetchData();
    }
  }, [url]);

  return { loading, data, error, updateUrl: setUrl };
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const game = searchParams.get('query');

  const initialUrl = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&search=${game}`;

  const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    if (game) {
      updateUrl(
        `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&search=${game}`
      );
    }
  }, [game, updateUrl]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-8 flex items-center">
        <svg
          className="w-8 h-8 mr-3 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        Search Results for: <span className="text-indigo-400 ml-2">{game}</span>
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading games...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-200 text-lg font-semibold mb-2">
            An error occurred
          </p>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {data && data.results && data.results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.results.map((gameResult) => (
            <CardGame key={gameResult.id} game={gameResult} />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-gray-400 text-lg">
                No results found for "{game}"
              </p>
              <p className="text-gray-500 mt-2">Try a different search term.</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
