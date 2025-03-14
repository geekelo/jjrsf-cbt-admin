import React, { useState } from "react";

const ExamForm = ({ onClose, onSubmit }) => {
  const [newExam, setNewExam] = useState({
    name: "",
    duration: "",
    start_time: "",
    end_time: ""
  });

  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExam.name && newExam.duration && newExam.start_time && newExam.end_time) {
      onSubmit(newExam);
      setNewExam({ name: "", duration: "", start_time: "", end_time: "" });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Exam</h3>
        <form onSubmit={handleSubmit} className="exam-form">
          <input type="text" name="name" placeholder="Exam Name" value={newExam.name} onChange={handleChange} required />
          <input type="text" name="duration" placeholder="Duration (e.g., 60 mins)" value={newExam.duration} onChange={handleChange} required />
          <input type="text" name="start_time" placeholder="Start Time (e.g., 10:00 AM)" value={newExam.start_time} onChange={handleChange} required />
          <input type="text" name="end_time" placeholder="End Time (e.g., 11:00 AM)" value={newExam.end_time} onChange={handleChange} required />
          <button type="submit" className="add-exam-btn">Add Exam</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
