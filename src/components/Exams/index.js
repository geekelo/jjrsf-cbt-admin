// src/components/Exams.jsx

import React, { useEffect, useState } from "react";
import { Eye, Plus, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ExamForm from "./ExamForm";
import "../../Stylesheets/Exams.css";
import { fetchExams } from "../../redux/slice";

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
  const { exams, loading, error } = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

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

      {showForm && <ExamForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Exams;
