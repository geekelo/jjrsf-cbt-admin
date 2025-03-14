import React, { useState } from "react";

const Exams = () => {
  // Initial dummy exam data
  const [exams, setExams] = useState([
    { id: 1, name: "Mathematics", duration: "60 mins", start_time: "10:00 AM", end_time: "11:00 AM" },
    { id: 2, name: "Science", duration: "90 mins", start_time: "12:00 PM", end_time: "1:30 PM" }
  ]);

  const [newExam, setNewExam] = useState({ name: "", duration: "", start_time: "", end_time: "" });

  // Handle input changes
  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExam.name && newExam.duration && newExam.start_time && newExam.end_time) {
      setExams([...exams, { id: exams.length + 1, ...newExam }]);
      setNewExam({ name: "", duration: "", start_time: "", end_time: "" });
    }
  };

  return (
    <div className="exams-container">
      <h2>Exams List</h2>
      <ul className="exam-list">
        {exams.map((exam) => (
          <li key={exam.id} className="exam-item">
            <strong>{exam.name}</strong> - {exam.duration} (From {exam.start_time} to {exam.end_time})
          </li>
        ))}
      </ul>

      {/* Add New Exam Form */}
      <h3>Add New Exam</h3>
      <form onSubmit={handleSubmit} className="exam-form">
        <input type="text" name="name" placeholder="Exam Name" value={newExam.name} onChange={handleChange} required />
        <input type="text" name="duration" placeholder="Duration (e.g., 60 mins)" value={newExam.duration} onChange={handleChange} required />
        <input type="text" name="start_time" placeholder="Start Time (e.g., 10:00 AM)" value={newExam.start_time} onChange={handleChange} required />
        <input type="text" name="end_time" placeholder="End Time (e.g., 11:00 AM)" value={newExam.end_time} onChange={handleChange} required />
        <button type="submit" className="add-exam-btn">Add Exam</button>
      </form>
    </div>
  );
};

export default Exams;
