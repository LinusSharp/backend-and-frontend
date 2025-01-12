import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import SignUp from './pages/Signup';
import Login from './pages/Login';
import Posts from './pages/Posts';

function App() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const onAuthSuccess = (id) => {
    setUserId(id);
    navigate('/posts');
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<SignUp onAuthSuccess={onAuthSuccess} />} />
        <Route path="/login" element={<Login onAuthSuccess={onAuthSuccess} />} />
        <Route path="/posts" element={<Posts userId={userId} />} />
      </Routes>
    </div>
  );
}

export default App;
