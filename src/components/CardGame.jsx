import LazyLoadGameImage from './LazyLoadGameImage';
import { Link } from 'react-router';
export default function CardGame({ game }) {
  const genres = game.genres.map((genre) => genre.name).join(', ');

  const { background_image: image } = game;

  return (
    <main className="flex mx-5 my-5 shadow-2xl ">
      <article key={game.id}>
        <LazyLoadGameImage image={image} />
        <strong>{game.name}</strong>
        <small>{genres}</small>
        <p>{game.released}</p>
        <button>
          <Link to={`/games/${game.slug}/${game.id}`}> click</Link>
        </button>
      </article>
    </main>
  );
}
