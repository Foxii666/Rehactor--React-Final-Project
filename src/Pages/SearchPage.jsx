import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import CardGame from '../components/CardGame';
import useFetchSolutions from '../hook/useFetchSolution';

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const game = searchParams.get('query');

  // Correzione: rimosso `${id}` e usato solo il parametro di ricerca
  const initialUrl = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&search=${game}`;

  const { loading, data, error, updateUrl } = useFetchSolutions(initialUrl);

  useEffect(() => {
    updateUrl(initialUrl);
  }, [initialUrl, updateUrl]);
  return (
    <div className="container">
      <h1>Risultati per: {game}</h1>
      {loading && <p>Loading...</p>}
      {error && <h1>{error}</h1>}
      <div>
        {data &&
          data.results.map((game) => <CardGame key={game.id} game={game} />)}
      </div>
    </div>
  );
}
