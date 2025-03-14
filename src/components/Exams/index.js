import React, { useState } from "react";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import data from "../../data/exams.json";
import ExamForm from "./ExamForm";
import "../../Stylesheets/Exams.css";

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
  const [exams, setExams] = useState(data.clacbt_exams);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

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
       </li>
       
        
        ))}
      </ul>

    

      {showForm && <ExamForm onClose={() => setShowForm(false)} onSubmit={addExam} />}
    </div>
  );
};

export default Exams;
