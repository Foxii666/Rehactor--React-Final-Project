import { useParams } from 'react-router';
import CardGame from '../components/CardGame';
import useFetchSolution from '../hook/useFetchSolution';

export default function GenrePage() {
  const { genre } = useParams();

  const initialUrl = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&dates=2024-01-01,2024-12-31&genres=${genre}&page=1`;

  //  custom hook
  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <>
      <h1>Welcome to {genre} page</h1>

      {loading && <p>Loading...</p>}
      {error && <article>{error}</article>}

      <div className="grid-games-list">
        {data?.results?.map((game) => (
          <CardGame key={game.id} game={game} />
        ))}
      </div>
    </>
  );
}
