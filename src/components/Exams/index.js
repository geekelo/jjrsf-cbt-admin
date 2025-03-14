import React, { useEffect, useState } from "react";
import { Eye, Plus, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExamForm from "./ExamForm";
import "../../Stylesheets/Exams.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Fetching exams from:", `${API_BASE_URL}/clacbt_exams`);

        const response = await fetch(`${API_BASE_URL}/clacbt_exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }

        const data = await response.json();
        
        console.log("Fetched Exams:", data);
        console.log(exams)
        setExams(data);
        console.log(exams)
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const addExam = (newExam) => {
    setExams([...exams, { id: exams.length + 1, ...newExam }]);
    setShowForm(false);
  };

  return (
    <div className="exams-container">
      <div className="exambox">
        <h2>Exams List</h2>
        <button className="add-exam-btn" onClick={() => setShowForm(true)}>
          <Plus /> Add New Exam
        </button>
      </div>

      {loading && <p>Loading exams...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="exam-list">
        {exams.map((exam) => (
          <li key={exam.id} className="exam-item">
            <div className="exam-details">
              <h3 className="exam-title">{exam.name}</h3>
              <p className="exam-duration">⏳ {exam.duration} mins</p>
              <p className="exam-time">
                🕒 <span className="exam-time-label">From:</span> {formatDateTime(exam.start_time)}
                <br />
                🕒 <span className="exam-time-label">To:</span> {formatDateTime(exam.end_time)}
              </p>
            </div>
            <Eye className="view-icon" size={24} onClick={() => navigate(`/exam/${exam.id}`)} />
            <User2 className="viewuser-icon" size={24} onClick={() => navigate(`/user`)} />
          </li>
        ))}
      </ul>

      {showForm && <ExamForm onClose={() => setShowForm(false)} onSubmit={addExam} />}
    </div>
  );
};

export default Exams;