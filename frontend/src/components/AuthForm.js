import React, { useState } from "react";
import API from "../api";

const AuthForm = ({ mode = "login", setIsLoggedIn, onSuccess }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";

      const res = await API.post(endpoint, form);

      if (mode === "register") {
        // ✅ After registration, we can directly log user in OR just notify
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        setForm({ username: "", password: "" }); // clear fields
        if (onSuccess) onSuccess();
      } else {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        setForm({ username: "", password: "" }); // clear fields
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      // optional: clear only password if login fails
      setForm((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="auth-card">
      <h2>{mode === "register" ? "Create Account" : "Welcome Back"}</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={change}
          autoComplete="new-username"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={change}
          autoComplete="new-password"
          required
        />
        <button className="primary">
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AuthForm;
