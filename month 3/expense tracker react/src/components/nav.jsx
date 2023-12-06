// Nav.jsx
import { useState, useEffect } from 'react';
import '../components/scss/nav.css';
import { NavLink } from 'react-router-dom';
import GoogleLoginButton from './googleLoginButton';
import PropTypes from 'prop-types';
import Logout from './logout';

const Nav = ({ onLogin }) => {
  const [clicked, setClicked] = useState(false);
  const toggleClicked = () => {
    setClicked(!clicked);
  };

  const [dark, setDark] = useState(false);
  const toggleDark = () => {
    setDark(!dark);
    document.body.classList.toggle('dark-mode', !dark);
  };

  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#fff' : '#7b7554';
  }, [dark]);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({}); // Add state to store user data, including picture

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUser(userData);
    console.log('User logged in:', userData);
    if (onLogin) {
      onLogin(userData);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser({}); // Clear user data on logout
    console.log('User logged out');
  };

  return (
    <>
      <div className="wrappper">
        <nav>
          <NavLink to="/" id="logo">
            ExpenseMapper
          </NavLink>
          <ul className={clicked ? 'navLinks active' : 'navLinks '} id='navbar'>
            <li id='links'>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li id='links'>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li id='links'>
              <NavLink to="/tracker">Tracker</NavLink>
            </li>
            <li id='links'>
              <NavLink to="/contact">ContactUs</NavLink>
            </li>
            <div className="login-container">
              {isLoggedIn ? (
                <Logout logoutHandler={handleLogout} userPicture={user.picture} />
              ) : (
                <GoogleLoginButton onLogin={handleLogin} />
              )}
            </div>
          </ul>
          <div className="hamburger">
            <i
              id='bar'
              className={clicked ? 'fas fa-times fa-2x' : 'fa-duotone fa-bars fa-2xl'}
              onClick={toggleClicked}
            ></i>
          </div>
          <div className={`dark ${dark ? 'active' : ''}`} onClick={toggleDark}>
            <i
              id='bar'
              className={dark ? 'fa-regular fa-sun-bright fa-2xl' : 'fa-solid fa-moon-stars fa-2xl'}
            ></i>
          </div>
        </nav>
        <hr />
      </div>
    </>
  );
};

Nav.propTypes = {
  onLogin: PropTypes.func,
};

export default Nav;
