import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import PlayersList from '../pages/PlayersList';
import PlayerDetail from '../pages/PlayerDetail';
import GamesList from '../pages/GamesList';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout><Dashboard /></Layout>,
    },
    {
        path: '/players',
        element: <Layout><PlayersList /></Layout>,
    },
    {
        path: '/players/:playerId',
        element: <Layout><PlayerDetail /></Layout>,
    },
    {
        path: '/games',
        element: <Layout><GamesList /></Layout>,
    },
], { basename: import.meta.env.BASE_URL });

export function AppRouter() {
    return <RouterProvider router={router} />;
}
