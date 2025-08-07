import { useParams } from 'react-router';
import useFetchSolution from '../hook/useFetchSolution';

export default function GamePage() {
  const { id } = useParams();

  // Se id è presente creiamo l'URL, altrimenti null
  const initialUrl = id
    ? `https://api.rawg.io/api/games/${id}?key=9269195f491e44539d7a2d10ce87ab15`
    : null;

  // custom hook
  const { data, loading, error } = useFetchSolution(initialUrl);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div className="style-gamepage">
      <div className="style-game-info">
        <p>{data?.released}</p>
        <h1>{data?.name}</h1>
        <p>Rating: {data?.rating}</p>
        <p>About:</p>
        <p>{data?.description_raw}</p>
      </div>

      <div className="style-game-image">
        {data?.background_image && (
          <img src={data.background_image} alt={data?.name || 'game'} />
        )}
      </div>
    </div>
  );
}
