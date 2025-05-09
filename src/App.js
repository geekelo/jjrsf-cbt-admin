import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Exams from "./components/Exams";
import ExamDetails from "./components/Exams/ExamDetails";
import Login from "./components/Basics/Login";
import Layout from "./components/Basics/Layout";
import UserProfile from "./components/candiate/User";
import QuestionDetail from "./components/Exams/QuestionDetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // ✅ check localStorage now
    setIsLoggedIn(!token);
  }, []);

  return (
    <Router>
      <Layout>
        <div className="App">
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <Exams /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/login"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route
                path="/exam/:id"
                element={isLoggedIn ? <ExamDetails /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/exams/:id"
                element={isLoggedIn ? <ExamDetails /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/exams/:examId/questions/:questionId"
                element={isLoggedIn ? <QuestionDetail /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/user/:id"
                element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </main>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
