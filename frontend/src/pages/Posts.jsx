// src/pages/Posts.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Posts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText]   = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch("http://localhost:5213/api/Posts", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Error fetching posts", data);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, [userId, navigate]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await fetch("http://localhost:5213/api/Posts/createPost", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title,
          text,
          userId: parseInt(userId, 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchPostsAgain();
        setTitle("");
        setText("");
      } else {
        setMessage(data.message || "Post creation failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server.");
    }
  };

  const fetchPostsAgain = async () => {
    try {
      const res = await fetch("http://localhost:5213/api/Posts", { method: "GET" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };

  return (
    <div className="posts-page">
      <h2>Posts</h2>

      <div className="create-post-container">
        <h3>Create a New Post</h3>
        <form onSubmit={handleCreatePost}>
          <div className="form-field">
            <label>Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Text</label>
            <input
              required
              type="text"
              value={text}
              onChange={(e)=>setText(e.target.value)}
            />
          </div>

          <button className="btn-submit" type="submit">Create Post</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="posts-list">
        <h3>All Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="post-card">
              <h4>{p.title}</h4>
              <p>{p.text}</p>
              <small>Posted by User #{p.userId}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Posts;
