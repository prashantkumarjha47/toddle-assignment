import React from "react";
import { Route, Redirect } from "react-router-dom";
import { routes } from "./routes";

const PrivateRoute = (props) => {
  const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: routes.login.path,
        state: { from: props.location },
      }}
    />
  );
};

export default PrivateRoute;
