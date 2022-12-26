import { Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/register";

export default [
  {
    path: "/",
    element: <Navigate to="/register"></Navigate>,
  },

  {
    path: "register",
    element: <Register></Register>,
  },
  {
    path: "login",
    element: <Login></Login>,
  },
];
