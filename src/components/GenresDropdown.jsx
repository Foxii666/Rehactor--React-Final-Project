import { Link } from 'react-router';
import useFetchSolution from '../hook/useFetchSolution';

export default function GenresSidebar() {
  const initialUrl =
    'https://api.rawg.io/api/genres?key=9269195f491e44539d7a2d10ce87ab15';

  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Genres</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {data?.results?.map((genre) => (
          <li key={genre.id}>
            <Link
              to={`/games/${genre.slug}`}
              className="block px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
