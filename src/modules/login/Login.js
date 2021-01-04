import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import AuthSrv from "../../services/auth.service";

import "./Login.scss";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    try {
      const response = await AuthSrv.login({ username, password });
      localStorage.setItem("token", response.token);
      history.push("/explorer");
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <form onSubmit={onFormSubmit} className="modal-content animate">
          {showError && <p className="error-message">Login Failed!</p>}
          <div className="container">
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
