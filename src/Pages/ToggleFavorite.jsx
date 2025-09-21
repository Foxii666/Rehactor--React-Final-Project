import { useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FavoritesContext } from '../context/FavoritesProvider';

export default function ToggleFavorite({ data }) {
  const context = useContext(FavoritesContext);

  // Controllo di sicurezza fondamentale
  if (!context) {
    console.error(
      'FavoritesContext non disponibile. Assicurati che il componente sia dentro FavoritesProvider'
    );
    return (
      <button
        disabled
        title="Funzione non disponibile"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'not-allowed',
          color: '#ccc',
          fontSize: '24px',
          padding: '5px',
        }}
      >
        <FaRegHeart />
      </button>
    );
  }

  const { favorites, addFavorite, removeFavorite, isFavorite } = context;

  // Controllo aggiuntivo per dati mancanti
  if (!data || !data.id) {
    return (
      <button
        disabled
        title="Dati gioco non disponibili"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'not-allowed',
          color: '#ccc',
          fontSize: '24px',
          padding: '5px',
        }}
      >
        <FaRegHeart />
      </button>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite(data.id)) {
      removeFavorite(data.id);
    } else {
      addFavorite(data);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: isFavorite(data.id) ? '#ff4444' : '#666',
        fontSize: '24px',
        padding: '5px',
        transition: 'color 0.3s ease',
        borderRadius: '50%',
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = isFavorite(data.id)
          ? '#ffeeee'
          : '#f0f0f0';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = 'transparent';
      }}
      title={
        isFavorite(data.id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'
      }
      aria-label={
        isFavorite(data.id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'
      }
    >
      {isFavorite(data.id) ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
