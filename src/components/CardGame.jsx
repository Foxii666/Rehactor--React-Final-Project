import LazyLoadGameImage from './LazyLoadGameImage';
import { Link } from 'react-router';
import { FaCalendarAlt, FaGamepad, FaInfoCircle } from 'react-icons/fa'; // Add some icons for clarity

export default function CardGame({ game }) {
  const genres = game.genres.map((genre) => genre.name).join(', ');
  const { background_image: image } = game;

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Game Image Section */}
      <div className="relative h-48 md:h-56">
        {' '}
        {/* Set a fixed height for image consistency */}
        <LazyLoadGameImage image={image} />
        {/* Optional overlay for text readability on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col justify-between h-auto">
        {/* Game Name */}
        <h3 className="text-xl font-bold text-gray-100 mb-2 leading-tight">
          {game.name}
        </h3>

        {/* Genres */}
        <p className="text-sm text-gray-400 mb-3 flex items-center">
          <FaGamepad className="mr-2 text-base" /> {genres}
        </p>

        {/* Release Date */}
        <p className="text-sm text-gray-400 mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-base" /> Released: {game.released}
        </p>

        {/* Details Button */}
        <div className="mt-auto">
          {' '}
          {/* Pushes the button to the bottom */}
          <Link
            to={`/games/${game.slug}/${game.id}`}
            className="w-full inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
          >
            <FaInfoCircle className="mr-2" /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
