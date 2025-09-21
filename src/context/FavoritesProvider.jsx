import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import supabase from '../supabase/supabase-client';
import SessionContext from '../context/SessionContext';

const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFavorites = useCallback(async () => {
    if (!session?.user?.id) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const { data: favourites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Errore nel caricamento preferiti:', error);
      } else {
        setFavorites(favourites || []);
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const addFavorite = useCallback(
    async (game) => {
      if (!session?.user?.id) {
        alert('Devi essere loggato per aggiungere ai preferiti');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: session.user.id,
              game_id: game.id,
              game_name: game.name,
              game_image: game.background_image,
            },
          ])
          .select();

        if (error) {
          console.error("Errore nell'aggiunta preferiti:", error);
          alert("Errore durante l'aggiunta ai preferiti");
        } else if (data && data.length > 0) {
          setFavorites((prev) => [...prev, data[0]]);
        }
      } catch (error) {
        console.error('Errore:', error);
      }
    },
    [session]
  );

  const removeFavorite = useCallback(
    async (gameId) => {
      if (!session?.user?.id) return;

      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('game_id', gameId)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Errore nella rimozione preferiti:', error);
        } else {
          setFavorites((prev) => prev.filter((fav) => fav.game_id !== gameId));
        }
      } catch (error) {
        console.error('Errore:', error);
      }
    },
    [session]
  );

  const isFavorite = useCallback(
    (gameId) => {
      return favorites.some((fav) => fav.game_id === gameId);
    },
    [favorites]
  );

  useEffect(() => {
    if (session) {
      getFavorites();
    }
  }, [session, getFavorites]);

  useEffect(() => {
    let channel;

    if (session?.user?.id) {
      channel = supabase
        .channel('favorites-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorites',
            filter: `user_id=eq.${session.user.id}`,
          },
          () => {
            getFavorites();
          }
        )
        .subscribe();

      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [session, getFavorites]);

  const value = {
    favorites,
    loading,
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesContext };
export default FavoritesProvider;
