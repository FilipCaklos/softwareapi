import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setPage('dashboard');
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setPage('login');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Subscription Service</h1>
        {currentUser && (
          <div className="user-info">
            <span>Welcome, {currentUser.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>

      <main className="app-main">
        {page === 'login' && !currentUser && (
          <div className="page-container">
            <Login onLoginSuccess={handleLoginSuccess} apiUrl={API_URL} />
            <div className="page-divider">
              <p>Don't have an account?</p>
              <button onClick={() => setPage('register')} className="link-btn">
                Create one here
              </button>
            </div>
          </div>
        )}

        {page === 'register' && !currentUser && (
          <div className="page-container">
            <Register onRegisterSuccess={handleRegisterSuccess} apiUrl={API_URL} />
            <div className="page-divider">
              <p>Already have an account?</p>
              <button onClick={() => setPage('login')} className="link-btn">
                Login here
              </button>
            </div>
          </div>
        )}

        {page === 'dashboard' && currentUser && (
          <Dashboard user={currentUser} setUser={setCurrentUser} apiUrl={API_URL} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Subscription Service. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
