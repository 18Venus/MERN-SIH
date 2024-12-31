import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "../App";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import Singup from "../components/Singup";
import PrivateRoute from "../Privateroute/PrivateRoute";
import Login from "../components/login";
import Logout from "../components/Logout";
import Tests from "../tests/test";
import Home from "../home/Home";
import MapComponent from "../components/MapComponent";
import Calendar from "../components/Calendar"; // Import the Calendar component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/tests",
    element: <PrivateRoute><Tests /></PrivateRoute>,
  },
  {
    path: "/map",
    element: <PrivateRoute><MapComponent /></PrivateRoute>,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
    ],
  },
  {
    path: "/calendar",
    element: <PrivateRoute><Calendar /></PrivateRoute>,
  },
  {
    path: "sign-up",
    element: <Singup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default router;
