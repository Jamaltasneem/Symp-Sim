import React from 'react';

const Navbar = ({ isLoggedIn, setIsLoggedIn, setView }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setView('login');
  };

  return (
    <nav className="nav">
      <div className="brand">Symptom Simulator</div>
      <div className="nav-links">
        {!isLoggedIn && (
          <>
            <button className="link-btn" onClick={() => setView('register')}>Register</button>
            <button className="link-btn" onClick={() => setView('login')}>Login</button>
            <button className="link-btn" onClick={() => localStorage.getItem("token") ? setView('dashboard') : alert("Please log in first")}>Dashboard</button>

          </>
        )}

        {isLoggedIn && (
          <>
            
            <button className="logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
