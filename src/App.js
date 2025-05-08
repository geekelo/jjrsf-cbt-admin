import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Basics/Navbar";
import Exams from "./components/Exams";
import ExamDetails from "./components/Exams/ExamDetails"; // Import ExamDetails
import Login from "./components/Basics/Login";
import Footer from "./components/Basics/Footer";
import Layout from "./components/Basics/Layout";
import UserProfile from "./components/Exams/User";
import QuestionDetail from "./components/Exams/QuestionDetail";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState([
    { email: "john@example.com", score: 85 },
    { email: "jane@example.com", score: 0 },
    { email: "mark@example.com", score: 72 },
  ]);

  const handleAddCandidate = () => {
    const newCandidate = {
      email: `newuser${candidates.length + 1}@example.com`,
      score: null,
    };
    setCandidates([...candidates, newCandidate]);
  };
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
              <Route
                path="/"
                element={isLoggedIn ? <Exams /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
              />

              {/* Exam Details Route (Only accessible when logged in) */}
              <Route
                path="/exam/:id"
                element={
                  isLoggedIn ? <ExamDetails /> : <Navigate to="/login" />
                }
              />
              <Route path="/exams/:id" element={<ExamDetails />} />
      
<Route path="/exams/:examId/questions/:questionId" element={<QuestionDetail />} />


              <Route
                path="/user"
                element={
                  isLoggedIn ? (
                    <UserProfile
                      candidates={candidates}
                      onAddCandidate={handleAddCandidate}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
