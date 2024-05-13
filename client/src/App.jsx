import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
  About,
  Error,
  Events,
  HomeLayout,
  Landing,
  Login,
  Register,
  SingleEvent,
} from './pages'

import { ErrorElement } from './components'

// loaders
import { loader as landingLoader } from './pages/Landing'
import { loader as singleEventLoader } from './pages/SingleEvent'
import { loader as eventsLoader } from './pages/Events'

// actions

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader,
      },
      {
        path: '/events',
        element: <Events />,
        errorElement: <ErrorElement />,
        loader: eventsLoader,
      },
      {
        path: '/events/:id',
        element: <SingleEvent />,
        errorElement: <ErrorElement />,
        loader: singleEventLoader,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
