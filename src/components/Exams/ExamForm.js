import React, { useState } from "react";
import '../../Stylesheets/examform.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ExamForm = ({ onClose, onExamAdded }) => {
  const [newExam, setNewExam] = useState({
    name: "",
    duration: "",
    start_date: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      // Append default time (midnight start and end of day)
      const start_time = new Date(`${newExam.start_date}T00:00:00`).toISOString();
      const end_time = new Date(`${newExam.end_date}T23:59:59`).toISOString();

      const response = await fetch(`${API_BASE_URL}/clacbt_exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clacbt_exam: {
            name: newExam.name,
            duration: parseInt(newExam.duration),
            start_time,
            end_time,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add exam");
      }

      const createdExam = await response.json();
      onExamAdded(createdExam); // Update parent with the new exam
      setNewExam({ name: "", duration: "", start_date: "", end_date: "" });
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Exam</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="exam-form">
          <input type="text" name="name" placeholder="Exam Name" value={newExam.name} onChange={handleChange} required />
          <input type="number" name="duration" placeholder="Duration (in minutes)" value={newExam.duration} onChange={handleChange} required />
          <label>Start Date</label>
          <input type="date" name="start_date" value={newExam.start_date} onChange={handleChange} required />
          <label>End Date</label>
          <input type="date" name="end_date" value={newExam.end_date} onChange={handleChange} required />
          <button type="submit" className="add-exam-btn" disabled={submitting}>
            {submitting ? "Adding..." : "Add Exam"}
          </button>
          <button type="button" className="close-btn" onClick={onClose} disabled={submitting}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
