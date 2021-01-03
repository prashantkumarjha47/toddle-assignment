import React from "react";
import { Route, Redirect } from "react-router-dom";
import { routes } from "./routes";

const ProtectedRoute = (props) => {
  const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn ? (
    <Redirect
      to={{
        pathname: routes.explorer.path,
      }}
    />
  ) : (
    <Route {...props} />
  );
};

export default ProtectedRoute;
