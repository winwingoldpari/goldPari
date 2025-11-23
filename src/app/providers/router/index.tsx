import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout'
import HomePage from '@/pages/home'
import SportPage from '@/pages/sport'
import NotFoundPage from '@/pages/not-found'
import CasinoPage from '@/pages/casino'

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sport', element: <SportPage /> },
      { path: 'casino', element: <CasinoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
const basename =
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/promocreator/goldpari')
    ? '/promocreator/goldpari'
    : '/'

const router = createBrowserRouter(routes, { basename })

export default function AppRouterProvider() {
  return <RouterProvider router={router} />
}


