import { RouterProvider } from 'react-router';
import router from './Router/Router';
import SessionProvider from './context/SessionProvider';
import FavoritesProvider from './context/FavoritesProvider';

function App() {
  return (
    <SessionProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </SessionProvider>
  );
}

export default App;
