import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import Logout from './logout';
import "./scss/nav.scss";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {useNavigate} from "react-router-dom"

const GoogleLoginButton = ({ onLogin }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const credentialResponseDecode = jwtDecode(credentialResponse.credential);
      const sessionId = uuidv4();
      const uniqueUserId = uuidv4();
      // Add the session ID to the user data
      const userDataWithSessionId = {
        ...credentialResponseDecode,
        sessionId,
        uniqueUserId,
      };

      setUser(userDataWithSessionId);
      const response = await fetch('http://localhost:3001/api/checkLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isLoggedIn: true,
          sessionId,
          name: userDataWithSessionId.name,
          email: userDataWithSessionId.email,
          uniqueUserId: userDataWithSessionId.uniqueUserId,
          picture: userDataWithSessionId.picture
        }),
      });
      console.log('Setting isLoggedIn to true');
      setLoggedIn(true);
      const resInfo = {
        isLoggedIn: true,
        sessionId,
        name: userDataWithSessionId.name,
        email: userDataWithSessionId.email,
        uniqueUserId: userDataWithSessionId.uniqueUserId,
        picture: userDataWithSessionId.picture
      }
      localStorage.setItem("AuthKey",JSON.stringify(resInfo));
      navigate("/dashboard")
      // Check the response and handle accordingly
      if (response.ok) {
        const responseData = await response.json();
        console.log('User data saved successfully:', responseData);
      } else {
        // Check if the response has content before trying to parse it
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorResponse = await response.json();
          console.error('Failed to save user data:', response.status, errorResponse);
        } else {
          console.error('Failed to save user data:', response.status);
        }
      }

      // Call the onLogin prop passed from the parent component
      if (onLogin) {
        onLogin(userDataWithSessionId, handleLogout);
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Error handling login success:', error.message);
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

GoogleLoginButton.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default GoogleLoginButton;