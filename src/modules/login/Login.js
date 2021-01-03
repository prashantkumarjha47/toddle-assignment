import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import AuthSrv from "../../services/auth.service";

import "./Login.scss";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const response = await AuthSrv.login({ username, password });
      console.log(response);
      localStorage.setItem("token", response.token);
      history.push("/explorer");
      console.log(response);
    } catch (error) {}
  };

  return (
    <div className="login">
      <div className="login-form">
        <form onSubmit={onFormSubmit} className="modal-content animate">
          <div className="container">
            <label forName="uname">
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

            <label forName="psw">
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
