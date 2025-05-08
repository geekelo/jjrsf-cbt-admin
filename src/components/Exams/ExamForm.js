// src/components/ExamForm.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../Stylesheets/examform.css";
import { createExam } from "../../redux/slice/exam";

const ExamForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.exams);

  const [newExam, setNewExam] = useState({
    name: "",
    duration: "",
    start_date: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await dispatch(createExam(newExam));
    setSubmitting(false);
    setNewExam({ name: "", duration: "", start_date: "", end_date: "" });
    onClose();
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
          <button type="button" className="close-btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
