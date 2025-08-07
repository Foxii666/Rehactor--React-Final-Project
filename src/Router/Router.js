import { createBrowserRouter } from 'react-router';
import Layout from '../Layout/Layout';
import Homepage from '../Pages/HomePage';
import Errorpage from '../error/ErrorPage';
import { Component } from 'react';
import GenrePage from '../Pages/GenrePage';
import GamePage from '../Pages/GamePage';
import SearchPage from '../Pages/SearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '/Homepage',
        Component: Homepage,
      },
      {
        path: '*',
        Component: Errorpage,
      },
      {
        path: '/games/:genr',
        Component: GenrePage,
      },
      {
        path: '/games/:slug/:id',
        Component: GamePage,
      },
      {
        path: '/search',
        Component: SearchPage,
      },
    ],
  },
]);
export default router;
