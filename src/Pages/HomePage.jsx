import CardGame from '../components/CardGame';
import useFetchSolution from '../hook/useFetchSolution';

export default function HomePage() {
  const initialUrl =
    'https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&dates=2024-01-01,2024-12-31&page=1';

  const { data, loading, error } = useFetchSolution(initialUrl);

  return (
    <>
      <h1>Home Page</h1>

      {loading && <p>Loading...</p>}
      {error && <article>{error}</article>}

      <div className="grid grid-flow-col grid-rows-4 gap-4">
        {data?.results?.map((game) => (
          <CardGame key={game.id} game={game} />
        ))}
      </div>
    </>
  );
}
