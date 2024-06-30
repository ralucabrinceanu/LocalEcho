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
  ForgotPassword,
  ResetPassword,
  TestimonialsPage,
  EditVenue,
  Tickets,
  AddTicket,
  EventTickets,
  Cart,
  Orders,
  OrdersAdmin,
  ChangeRole,
  EventsCrudAdmin,
  AddTestimonial,
  EventTicketsAdminEp,
  EditTicket,
  Checkout,
} from './pages'

import { ErrorElement } from './components'
import { store } from './store'

// loaders
import { loader as landingLoader } from './pages/Landing'
import { loader as singleEventLoader } from './pages/SingleEvent'
import { loader as eventsLoader } from './pages/Events'
import { loader as eventsCrudLoader } from './pages/EventsCrud'
import { loader as eventsCrudAdminLoader } from './pages/EventsCrudAdmin'
import { loader as editEventLoader } from './pages/EditEvent'
import { loader as usersLoader } from './pages/Users'
import { loader as venuesLoader } from './pages/Venues'
import { loader as verifyEmailLoader } from './pages/Verify'
import { loader as resetPasswordLoader } from './pages/ResetPassword'
import { loader as adminLoader } from './pages/Admin'
import { loader as testimonialsLoader } from './pages/Testimonials'
import { loader as editVenueLoader } from './pages/EditVenue'
import { loader as eventTicketLoader } from './pages/EventTickets'
import { loader as cartLoader } from './pages/Cart'
import { loader as ordersLoader } from './pages/Orders'
import { loader as ordersAdminLoader } from './pages/OrdersAdmin'
import { loader as adminepLoader } from './pages/EventTicketsAdminEp'

// actions
import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { action as addEventAction } from './pages/AddEvents'
import { action as deleteEventAction } from './pages/DeleteEvent'
import { action as editEventAction } from './pages/EditEvent'
import { action as deleteUserAction } from './pages/DeleteUser'
import { action as profileAction } from './pages/Profile'
import { action as addVenueAction } from './pages/AddVenue'
import { action as deleteVenueAction } from './pages/DeleteVenue'
import { action as forgotPasswordAction } from './pages/ForgotPassword'
import { action as resetPasswordAction } from './pages/ResetPassword'
import { action as userRoleAction } from './pages/Users'
import { action as deleteTestimonial } from './pages/DeleteTestimonial'
import { action as editVenueAction } from './pages/EditVenue'
import { action as createTicketAction } from './pages/AddTicket'
import { action as changeRoleAction } from './pages/ChangeRole'
import { action as deleteTicketsAction } from './pages/DeleteTickets'
import { action as editTicketAction } from './pages/EditTicket'

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
        path: '/about',
        element: <About />,
      },
      {
        path: 'cart',
        element: <Cart />,
        loader: cartLoader,
      },
      {
        path: 'checkout',
        element: <Checkout />,
        errorElement: <ErrorElement />,
      },
      {
        path: 'orders/showAllMyOrders',
        element: <Orders />,
        errorElement: <ErrorElement />,
        loader: ordersLoader(store),
      },
      {
        path: 'orders/allOrders',
        element: <OrdersAdmin />,
        errorElement: <ErrorElement />,
        loader: ordersAdminLoader,
      },
      {
        path: '/admin',
        element: <Admin />,
        errorElement: <ErrorElement />,
        loader: adminLoader,
      },
      {
        path: '/testimonials',
        element: <TestimonialsPage />,
        errorElement: <ErrorElement />,
        loader: testimonialsLoader,
        children: [
          {
            path: 'delete-testimonial/:id',
            action: deleteTestimonial,
          },
        ],
      },
      {
        path: '/user/add-testimonial',
        element: <AddTestimonial />,
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
        ],
      },
      {
        path: '/events-crud-admin',
        element: <EventsCrudAdmin />,
        errorElement: <ErrorElement />,
        loader: eventsCrudAdminLoader,
        children: [
          {
            path: 'delete-event/:id',
            action: deleteEventAction,
          },
        ],
      },
      {
        path: '/edit-event/:id',
        element: <EditEvent />,
        loader: editEventLoader,
        action: editEventAction,
      },
      {
        path: 'users',
        element: <AllUsers />,
        loader: usersLoader,
        action: userRoleAction,
        children: [
          {
            path: 'delete-user/:id',
            action: deleteUserAction,
          },
          {
            path: 'update-user-role/:id',
            action: changeRoleAction,
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
      {
        path: '/edit-venue/:id',
        element: <EditVenue />,
        loader: editVenueLoader,
        action: editVenueAction,
      },
      {
        path: '/add-ticket/:id',
        element: <AddTicket />,
        errorElement: <ErrorElement />,
        action: createTicketAction,
      },
      {
        path: '/events/:id/tickets',
        element: <EventTickets />,
        errorElement: <ErrorElement />,
        loader: eventTicketLoader,
      },
      {
        path: '/admin-ep/:id/tickets',
        element: <EventTicketsAdminEp />,
        errorElement: <ErrorElement />,
        loader: adminepLoader,
      },
      {
        path: '/delete-tickets/:id',
        errorElement: <ErrorElement />,
        action: deleteTicketsAction,
      },
      {
        path: '/edit-ticket/:id',
        errorElement: <ErrorElement />,
        action: editTicketAction,
      },
      {
        path: '/update-profile',
        element: <Profile />,
        errorElement: <Error />,
        action: profileAction,
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
    path: '/user/verify-email',
    element: <Verify />,
    loader: verifyEmailLoader,
  },
  {
    path: '/user/reset-password',
    element: <ResetPassword />,
    loader: resetPasswordLoader,
    action: resetPasswordAction,
  },
  {
    path: '/user/forgot-password',
    element: <ForgotPassword />,
    action: forgotPasswordAction,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
