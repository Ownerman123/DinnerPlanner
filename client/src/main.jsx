import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styles/themIndex.js';

import App from './App.jsx';
import Home from "./pages/home.jsx";
import _404 from "./pages/404.jsx";
import Recipe from './pages/Recipe.jsx';
import Registration from './pages/Registration.jsx'
import Recipes from './pages/Recipes.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import NewRecipe from './pages/NewRecipe.jsx';
import UsersRecipes from './pages/UsersRecipes.jsx';
import MyBook from './pages/MyBook.jsx'
import Plan from './pages/Plan.jsx';
import TchTch from './pages/tchtch.jsx';
import EditRecipe from './pages/EditRecipe.jsx';

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
      {
        path: "/recipes",
        element: <Recipes />
      },
      {
        path: "/tchtch",
        element: <TchTch />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/newrecipe",
            element: <NewRecipe />,
          },
          {
            path: "/editrecipe/:id",
            element: <EditRecipe />,
          },
          {
            path: "/userrecipes",
            element: <UsersRecipes />,
          },
          {
            path: "/userbook",
            element: <MyBook/>,
          },
          {
            path: "/plan",
            element: <Plan/>,
          },
          // {
          //   path: "/Dashboard",
          //   element: <Dashboard />,
          // },
        ],
      },
      // {
      //   path: "/Support",
      //   element: <CustomerService />
      // },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <RouterProvider router={reactRouter}/>
    </ChakraProvider>
  </React.StrictMode>,
)
