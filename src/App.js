import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Basics/Navbar";
import Exams from "./components/Exams";
import ExamDetails from "./components/Exams/ExamDetails"; // Import ExamDetails
import Login from "./components/Basics/Login";
import Footer from "./components/Basics/Footer";
import Layout from "./components/Basics/Layout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login state from localStorage
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Layout>
      <div className="App">
        
    

        <main className="content">
          <Routes>
            {/* Redirect to login if not logged in */}
            <Route path="/" element={isLoggedIn ? <Exams /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            
            {/* Exam Details Route (Only accessible when logged in) */}
            <Route
              path="/exam/:id"
              element={isLoggedIn ? <ExamDetails /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

       
      </div>
      </Layout>
    </Router>
  );
}

export default App;
