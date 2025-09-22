import { useState } from 'react';
import { Link } from 'react-router';
import useFetchSolution from '../hook/useFetchSolution';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function GenresSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const initialUrl =
    'https://api.rawg.io/api/genres?key=9269195f491e44539d7a2d10ce87ab15';
  const { data, loading, error } = useFetchSolution(initialUrl);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobil Görünüm İçin Buton */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 absolute top-4 left-4 z-50 text-gray-800"
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar - Mobil ve Masaüstü Konumlandırması */}
      <div
        className={`fixed inset-y-0 left-0 bg-white z-40 w-64 p-4 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobil Görünüm İçin Kapatma Butonu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 text-gray-800"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Genres</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Genre listesi - Eksik kısım eklendi */}
        {data?.results && (
          <ul className="space-y-2">
            {data.results.map((genre) => (
              <li key={genre.id}>
                <Link
                  to={`/games/${genre.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  {genre.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
