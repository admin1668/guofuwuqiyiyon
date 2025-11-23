import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_home from '../pages/p-home';
import P_scene_generation from '../pages/p-scene_generation';
import P_video_generation from '../pages/p-video_generation';
import P_works_management from '../pages/p-works_management';
import P_user_center from '../pages/p-user_center';
import P_help_tutorial from '../pages/p-help_tutorial';
import P_asset_library from '../pages/p-asset_library';
import P_login_register from '../pages/p-login_register';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/home' replace={true} />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/scene-generation',
    element: (
      <ErrorBoundary>
        <P_scene_generation />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/video-generation',
    element: (
      <ErrorBoundary>
        <P_video_generation />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/works-management',
    element: (
      <ErrorBoundary>
        <P_works_management />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/user-center',
    element: (
      <ErrorBoundary>
        <P_user_center />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/help-tutorial',
    element: (
      <ErrorBoundary>
        <P_help_tutorial />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/asset-library',
    element: (
      <ErrorBoundary>
        <P_asset_library />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/login-register',
    element: (
      <ErrorBoundary>
        <P_login_register />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;