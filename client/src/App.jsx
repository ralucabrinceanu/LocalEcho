import React from 'react'
import { Router, RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddEvent,
  Stats,
  AllEvents,
  Profile,
  Admin,
  EditEvent,
} from './pages'

import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { loader as dashboardLoader } from './pages/DashboardLayout'
import { loader as allEventsLoader } from './pages/AllEvents'
import { action as deleteEventAction } from './pages/DeleteEvent'
import { loader as adminLoader } from './pages/Admin'
import { action as profileAction } from './pages/Profile'
import { action as addEventAction } from './pages/AddEvent'
import { loader as editEventLoader } from './pages/EditEvent'
import { action as editEventAction } from './pages/EditEvent'
import { loader as statsLoader } from './pages/Stats'

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme)
  return isDarkTheme
}
checkDefaultTheme()

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AddEvent />,
            action: addEventAction,
          },
          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: 'all-events',
            element: <AllEvents />,
            loader: allEventsLoader,
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: 'edit-event/:id',
            element: <EditEvent />,
            loader: editEventLoader,
            action: editEventAction,
          },
          {
            path: 'delete-event/:id',
            action: deleteEventAction,
          },
        ],
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App

// TODO NODEJS: crud user - delete account?, (review, ratings)
// TODO NODEJS: 4 unit tests,
// TODO NODEJS optional: OAuth

// TODO REACT: add + edit venues, edit events
