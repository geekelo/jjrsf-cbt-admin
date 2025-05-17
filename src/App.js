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
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("authToken"); 
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken"); // ✅ check localStorage now
  //   // setIsLoggedIn(!token);
  // }, []);

  return (
    <Router>
      <Layout>
        <div className="App">
          <main className="content">
            <Routes>
              <Route
                path="/"
                element={token ? <Exams /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/login"
                element={<Login  />}
              />
              <Route
                path="/exam/:id"
                element={token ? <ExamDetails /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/exams/:id"
                element={token ? <ExamDetails /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/exams/:examId/questions/:questionId"
                element={token ? <QuestionDetail /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/user/:id"
                element={token ? <UserProfile /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </main>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
