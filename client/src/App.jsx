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
  AddEvents,
  EventsCrud,
  EditEvent,
  AllUsers,
  Profile,
  Verify,
  Venues,
  AddVenue,
  Admin,
  EventPlanner,
} from './pages'

import { ErrorElement } from './components'
import { store } from './store'

// loaders
import { loader as landingLoader } from './pages/Landing'
import { loader as singleEventLoader } from './pages/SingleEvent'
import { loader as eventsLoader } from './pages/Events'
import { loader as eventsCrudLoader } from './pages/EventsCrud'
import { loader as editEventLoader } from './pages/EditEvent'
import { loader as usersLoader } from './pages/Users'
import { loader as venuesLoader } from './pages/Venues'
// import { loader as updateUserLoader } from './pages/Profile'

// actions
import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { action as addEventAction } from './pages/AddEvents'
import { action as deleteEventAction } from './pages/DeleteEvent'
import { action as editEventAction } from './pages/EditEvent'
import { action as deleteUserAction } from './pages/DeleteUser'
import { action as updateUserAction } from './pages/Profile'
import { action as addVenueAction } from './pages/AddVenue'
import { action as deleteVenueAction } from './pages/DeleteVenue'

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
        path: '/admin',
        element: <Admin />,
        errorElement: <ErrorElement />,
      },
      {
        path: '/event-planner',
        element: <EventPlanner />,
        errorElement: <ErrorElement />,
      },
      {
        path: '/events-crud',
        element: <EventsCrud />,
        errorElement: <ErrorElement />,
        loader: eventsCrudLoader,
        children: [
          {
            path: 'delete-event/:id',
            action: deleteEventAction,
          },
          {
            path: 'edit-event/:id',
            element: <EditEvent />,
            loader: editEventLoader,
            action: editEventAction,
          },
        ],
      },
      {
        path: 'users',
        element: <AllUsers />,
        loader: usersLoader,
        children: [
          {
            path: 'delete-user/:id',
            action: deleteUserAction,
          },
          {
            path: 'update-role',
          },
        ],
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
      {
        path: '/add-event',
        element: <AddEvents />,
        errorElement: <ErrorElement />,
        action: addEventAction,
      },
      {
        path: '/venues',
        element: <Venues />,
        errorElement: <ErrorElement />,
        loader: venuesLoader,
        children: [
          {
            path: 'delete-venue/:id',
            action: deleteVenueAction,
          },
        ],
      },
      {
        path: '/add-venue',
        element: <AddVenue />,
        errorElement: <ErrorElement />,
        action: addVenueAction,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: '/update-profile',
    element: <Profile />,
    errorElement: <Error />,
    // loader: updateUserLoader,
    action: updateUserAction,
  },

  {
    path: '/user/verify-email',
    element: <Verify />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
