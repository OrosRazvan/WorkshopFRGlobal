import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { ListaZboruri } from "../pages/ListaZboruri/ListaZboruri";

export const router = createBrowserRouter([
  {

    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ListaZboruri />,
      }
    ],
  },
]);