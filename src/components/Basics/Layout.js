import React, { useState } from "react";
import "../../Stylesheets/Layout.css"; 
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="layout">
    <Navbar /> 
    <main className="content">{children}</main> 
    <Footer /> 
  </div>
  );
};

export default Layout;