import { lazy } from "react";
import PrivateRoute from "./PrivateRoute.component";
import ProtectedRoute from "./ProtectedRoute";

export const routes = {
  login: {
    name: "Login",
    path: "/login",
    component: lazy(() => import("../modules/login/Login")),
    type: ProtectedRoute,
  },
  explorer: {
    name: "Explorer",
    path: "/explorer",
    component: lazy(() => import("../modules/explorer/Explorer")),
    type: PrivateRoute,
  },
  emptyRoute: {
    name: "Login",
    path: "/",
    component: lazy(() => import("../modules/login/Login")),
    type: ProtectedRoute,
  },
};

export const renderRoutes = Object.entries(routes);
