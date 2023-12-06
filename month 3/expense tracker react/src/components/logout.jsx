// logout.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';

const Logout = ({ logoutHandler, userPicture }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="logout-container">
      <div className="user-info" onClick={toggleDropdown}>
        {userPicture && <img src={userPicture} alt="User" />}
      </div>
      {showDropdown && (
        <div className="dropdown">
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  );
};

Logout.propTypes = {
  logoutHandler: PropTypes.func.isRequired,
  userPicture: PropTypes.string.isRequired,
};

export default Logout;
