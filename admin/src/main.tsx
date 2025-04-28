import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from 'react-router'
import  Home  from './pages/home/Home.tsx'
import Register from './pages/register/Register.tsx'
import Login from './pages/login/Login.tsx'
import ErrorPage from './pages/error-page/Error-page.tsx'
import Rooms from './pages/rooms/Rooms.tsx'
import Bookings from './pages/bookings/Bookings.tsx'
import WorkspaceRooms from './pages/rooms/WorkspaceRooms.tsx'
import ConferenceRooms from './pages/rooms/ConferenceRooms.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <Home/>
      },
      {
        path: 'rooms',
        element: <Rooms/>,
      },
      {
        path: 'rooms:workspace',
        element: <WorkspaceRooms/>
      },
      {
        path: 'rooms:conference',
        element: <ConferenceRooms/>
      },
      {
        path: 'bookings',
        element: <Bookings/>
      },
      {
        path: 'register',
        element: <Register/>
      },
      {
        path: 'login',
        element: <Login/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
 