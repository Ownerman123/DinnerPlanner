import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';

import App from './App.jsx';
import Home from "./pages/home.jsx";
import _404 from "./pages/404.jsx";
import Recipe from './pages/Recipe.jsx';
import Registration from './pages/Registration.jsx'

import './index.css';

const reactRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <_404 pageErr="page could not be found" />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <_404 pageErr="page could not be found" />,
      },
      {
        path: "/recipe/:id",
        element: <Recipe />,
       
      },
      {
        path: "/login",
        element: <Registration />
      },
      // {
      //   element: <ProtectedRoute />,
      //   children: [
      //     {
      //       path: "/Post",
      //       element: <CreatePost />,
      //     },
      //     {
      //       path: "/Dashboard",
      //       element: <Dashboard />,
      //     },
      //   ],
      // },
      // {
      //   path: "/Support",
      //   element: <CustomerService />
      // },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
    <RouterProvider router={reactRouter}/>
    </ChakraProvider>
  </React.StrictMode>,
)
