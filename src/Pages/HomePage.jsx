import CardGame from '../components/CardGame';
import useFetchSolution from '../hook/useFetchSolution';

export default function HomePage() {
  const initialUrl =
    'https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&dates=2024-01-01,2024-12-31&page=1';

  const { data, loading, error } = useFetchSolution(initialUrl);

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
    </main>
  );
}
