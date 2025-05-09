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
    start_time: "",
    end_date: "",
    end_time: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  // Combine date and time into 'YYYY-MM-DD HH:MM:SS'
  const combineDateTime = (date, time) => {
    if (!date || !time) return "";
    return `${date} ${time}:00`;  // Ensure both date and time are combined
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Formatting the exam data with the combined date and time
    const formattedExam = {
      name: newExam.name,
      duration: newExam.duration,
      start_time: combineDateTime(newExam.start_date, newExam.start_time),
      end_time: combineDateTime(newExam.end_date, newExam.end_time),
    };

    console.log(formattedExam);

    // Dispatch the createExam action
    const res = await dispatch(createExam(formattedExam));

    // Optionally log the response from the async action
    console.log(res);

    setSubmitting(false);
    setNewExam({ name: "", duration: "", start_date: "", start_time: "", end_date: "", end_time: "" });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Exam</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="exam-form">
          <input
            type="text"
            name="name"
            placeholder="Exam Name"
            value={newExam.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (in minutes)"
            value={newExam.duration}
            onChange={handleChange}
            required
          />
          
          <label>Start Date and Time</label>
          <div className="datetime-group">
            <input
              type="date"
              name="start_date"
              value={newExam.start_date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="start_time"
              value={newExam.start_time}
              onChange={handleChange}
              required
            />
          </div>

          <label>End Date and Time</label>
          <div className="datetime-group">
            <input
              type="date"
              name="end_date"
              value={newExam.end_date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="end_time"
              value={newExam.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="add-exam-btn" disabled={submitting}>
            {submitting ? "Adding..." : "Add Exam"}
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
