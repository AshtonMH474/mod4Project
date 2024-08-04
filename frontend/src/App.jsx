import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Home from './components/Home';
import SpotDetails from './components/SpotDetails';
import SpotForm from './components/NewSpot';
import ManageSpots from './components/ManageSpots';
import ManageReviews from './components/ManageReviews';




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
      },
      {
        path:'/reviews/current',
        element:<ManageReviews/>
      }
    ]
  }
]);

function App() {

    useEffect(() => {
      document.title = "ashton's airbnb"

    }, [])
  return <RouterProvider router={router} />;
}

export default App;
