import { useState } from "react";

import { useAuth } from "../hooks/use_auth";

export const LoginForm = () => {
  const { login, loading, error, session } = useAuth();
  const [email, setEmail] = useState("demo@acrylicboard.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </label>
      <label>
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      {error && <p role="alert">{error}</p>}
      {session && <p>Welcome, {session.email}</p>}
    </form>
  );
};
