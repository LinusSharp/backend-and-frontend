import React, { useState } from 'react';

function App() {
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postUserId, setPostUserId] = useState("");
  const [postMessage, setPostMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage("");

    try {
      const response = await fetch("http://localhost:5213/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSignupMessage(data.message);
      } else {
        setSignupMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupMessage("Error connecting to server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");

    try {
      const response = await fetch("http://localhost:5213/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoginMessage(data.message);
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("Error connecting to server.");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setPostMessage("");

    try {
      const response = await fetch("http://localhost:5213/api/Posts/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          text: postText,
          userId: parseInt(postUserId, 10),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPostMessage(`Success: ${data.message}. New Post ID: ${data.postId}`);
      } else {
        setPostMessage(data.message || "Post creation failed.");
      }
    } catch (error) {
      console.error("CreatePost error:", error);
      setPostMessage("Error connecting to server.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + .NET Backend Demo</h1>
      <section style={{ marginBottom: '2rem' }}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        {signupMessage && <p>{signupMessage}</p>}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {loginMessage && <p>{loginMessage}</p>}
      </section>

      <section>
        <h2>Create Post</h2>
        <form onSubmit={handleCreatePost}>
          <div>
            <label>Title: </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Text: </label>
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
            />
          </div>
          <div>
            <label>User ID: </label>
            <input
              type="number"
              value={postUserId}
              onChange={(e) => setPostUserId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Post</button>
        </form>
        {postMessage && <p>{postMessage}</p>}
      </section>
    </div>
  );
}

export default App;
