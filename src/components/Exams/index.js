import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import data from "../../data/exams.json";
import ExamForm from "./ExamForm";

const Exams = () => {
  const [exams, setExams] = useState(data.clacbt_exams);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const addExam = (newExam) => {
    setExams([...exams, { id: exams.length + 1, ...newExam }]);
    setShowForm(false);
  };

  return (
    <div className="exams-container">
      <h2>Exams List</h2>
      <ul className="exam-list">
        {exams.map((exam) => (
          <li key={exam.id} className="exam-item">
            <strong>{exam.name}</strong> - {exam.duration} (From {exam.start_time} to {exam.end_time})
            <Eye className="view-icon" size={24} onClick={() => navigate(`/exam/${exam.id}`)} />
          </li>
        ))}
      </ul>

      <button className="add-exam-btn" onClick={() => setShowForm(true)}>
        Add New Exam
      </button>

      {showForm && <ExamForm onClose={() => setShowForm(false)} onSubmit={addExam} />}
    </div>
  );
};

export default Exams;
