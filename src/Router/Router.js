import { createBrowserRouter } from 'react-router';
import Layout from '../Layout/Layout';
import AuthLayout from '../Layout/AuthLayout';

import Homepage from '../Pages/HomePage';
import Errorpage from '../error/ErrorPage';
import GenrePage from '../Pages/GenrePage';
import GamePage from '../Pages/GamePage';
import SearchPage from '../Pages/SearchPage';
import Register from '../auth/Register';
import Login from '../auth/Login';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'Homepage',
        Component: Homepage,
      },
      {
        path: 'games/:genr',
        Component: GenrePage,
      },
      {
        path: 'games/:slug/:id',
        Component: GamePage,
      },
      {
        path: 'search',
        Component: SearchPage,
      },
      {
        path: '*',
        Component: Errorpage,
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
    ],
  },
]);

export default router;
