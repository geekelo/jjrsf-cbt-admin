import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, User } from "lucide-react";
import "../../Stylesheets/Nav.css";
const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/help">
            Help <HelpCircle size={32} />
          </Link>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <Link to="/profile">
                Profile <User size={32} />
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
