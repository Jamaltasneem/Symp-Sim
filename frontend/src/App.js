import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [view, setView] = useState('login'); // 'login' | 'register' | 'dashboard'

  // switch to dashboard automatically if logged in
  React.useEffect(() => {
    if (isLoggedIn) setView('dashboard');
  }, [isLoggedIn]);

  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setView={setView}
      />

      <main className="container">
        {isLoggedIn && view === 'dashboard' ? (
          <Dashboard />
        ) : view === 'register' ? (
          <Register setIsLoggedIn={setIsLoggedIn} onSuccess={() => setView('dashboard')} />
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} onSuccess={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}
