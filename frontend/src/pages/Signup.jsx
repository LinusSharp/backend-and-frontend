import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5213/api/Auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        if (data.userId) {
          onAuthSuccess(data.userId);
        }
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <div className="form-field">
          <label>Username</label>
          <input
            required
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button className="btn-submit" type="submit">Sign Up</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
    </div>
  );
}

export default SignUp;
