import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import Logout from './logout';
import "./scss/nav.scss";
import PropTypes from 'prop-types';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const credentialResponseDecode = jwtDecode(credentialResponse.credential);
      console.log('User logged in:', credentialResponseDecode);
      setUser(credentialResponseDecode);



      // Call the onLogin prop passed from the parent component
      if (onLogin) {
        onLogin(credentialResponseDecode, handleLogout); // Pass the updated user data
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  };

  const handleLogout = async () => {
    try {

      setUser({});
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserName = () => {
    // Assuming you have a field like 'name' in your user object
    const { name } = user;
    return name || ''; // Return the user's name, or an empty string if not available
  };

  return (
    <>
      <div id="signInDiv">
        {isLoggedIn && <Logout logoutHandler={handleLogout} userName={getUserName()} userPicture={user.picture} />}
      </div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Login Failed!!!!');
        }}
        buttontext=""
        className="hidden-google-login"
      />
    </>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
