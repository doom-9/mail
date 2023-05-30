import { createBrowserRouter, Link } from "react-router-dom";
import Login from "../views/login/login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
]);

export default router;
