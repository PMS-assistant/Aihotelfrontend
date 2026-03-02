import { createBrowserRouter, redirect } from 'react-router';
import { Root } from './components/layout/Root';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import IntegrationsPage from './pages/IntegrationsPage';
import StaffPage from './pages/StaffPage';
import AlertsPage from './pages/AlertsPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        loader: () => redirect('/dashboard'),
      },
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: 'chat',
        Component: ChatPage,
      },
      {
        path: 'integrations',
        Component: IntegrationsPage,
      },
      {
        // Legacy redirect for any bookmarked /connect links
        path: 'connect',
        loader: () => redirect('/integrations'),
      },
      {
        path: 'staff',
        Component: StaffPage,
      },
      {
        path: 'alerts',
        Component: AlertsPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
