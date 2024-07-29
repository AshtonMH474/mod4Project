import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Home from './components/Home';
import SpotDetails from './components/SpotDetails';
import SpotForm from './components/NewSpot';
import ManageSpots from './components/ManageSpots';




function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path:'/spots/:spotId',
        element:<SpotDetails/>
      },
      {
        path:'/spots/new',
        element:<SpotForm/>
      },
      {
      path:'/spots/current',
      element:<ManageSpots/>
      },
      {
        path:'/spots/:spotId/edit',
        element:<SpotForm/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
