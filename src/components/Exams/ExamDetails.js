import React from "react";
import { useParams } from "react-router-dom";
import data from "../../data/exams.json";

const ExamDetails = () => {
  const { id } = useParams();
  const exam = data.clacbt_exams.find((e) => e.id === parseInt(id));

  if (!exam) {
    return <h2>Exam not found</h2>;
  }

  return (
    <div className="exam-details">
      <h2>{exam.name}</h2>
      <p>Duration: {exam.duration}</p>
      <p>Start Time: {exam.start_time}</p>
      <p>End Time: {exam.end_time}</p>
    </div>
  );
};

export default ExamDetails;
