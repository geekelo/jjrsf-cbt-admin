// src/components/Exams.jsx

import React, { useEffect, useState } from "react";
import { Eye, Plus, User2, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ExamForm from "./ExamForm";
import "../../Stylesheets/Exams.css";
import { fetchExams, deleteExam } from "../../redux/slice/exam";

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
  const [editingExam, setEditingExam] = useState(null);

  // Fetch exams on mount
  useEffect(() => {
    dispatch(fetchExams());
  }, [dispatch]);

  // Open form for new exam
  const handleAddExam = () => {
    setEditingExam(null);
    setShowForm(true);
  };

  // Open form for editing existing exam
  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };

  // Close form after add/edit
  const handleCloseForm = () => {
    setEditingExam(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      dispatch(deleteExam(id))
        .then((res) => {
          // Optional: check res.meta.requestStatus === "fulfilled"
          toast.success("Exam deleted successfully!");
        })
        .catch(() => {
          toast.error("Failed to delete exam. Please try again.");
        });
    }
  };

  return (
    <div className="exams-container">
      <div className="exambox">
        <h2>Exams List</h2>
        <button className="add-exam-btn" onClick={handleAddExam}>
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
            <User2 className="viewuser-icon" size={24} onClick={() => navigate(`/user/${exam.id}`)} />
            <Pencil className="edit-icon" size={24} onClick={() => handleEditExam(exam)} />
            <Trash className="delete-icon" size={24} onClick={() => handleDelete(exam.id)} />
          </li>
        ))}
      </ul>

      {showForm && (
        <ExamForm
          initialData={editingExam}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchExams()); // Refresh list after add/edit
            toast.success(editingExam ? "Exam updated successfully!" : "Exam created successfully!");
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

export default Exams;
