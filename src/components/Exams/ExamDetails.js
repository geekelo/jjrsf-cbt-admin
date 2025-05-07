import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, Edit } from "lucide-react"; // Import icons
import data from "../../data/exams.json";
import AnswerModal from "./AnswerModal";
import EditQuestionModal from "./EditQuestionModal";
import '../../Stylesheets/Examdetail.css'

const ExamDetails = () => {
  const { id } = useParams();
  const exam = data.clacbt_exams.find((e) => e.id === parseInt(id));

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ option: "", answer_text: "", correct: false });
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  
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
  if (!exam) {
    return <h2>Exam not found</h2>;
  }

  // Open answer modal
  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswers(question.answers);
    setIsAnswerModalOpen(true);
  };

  // Close answer modal
  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setSelectedQuestion(null);
  };

  // Open edit question modal
  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  // Close edit question modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
  };

  // Handle editing question details
  const handleEditChange = (e) => {
    setSelectedQuestion({ ...selectedQuestion, [e.target.name]: e.target.value });
  };

  // Save edited question
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  return (
    <div className="exams-details">
      <h2 className="examdetailname">{exam.name}</h2>
      <p className="examdetailtime">⏳ Duration: {exam.duration} mins</p>
      <p className="examdetailtime">Start Time:  {formatDateTime(exam.start_time)} </p>
      <p className="examdetailtime">End Time:  {formatDateTime(exam.start_time)}</p>

      
      <ul className="question-list">
      <h3>Questions</h3>
        {exam.questions.map((question) => (
          <li key={question.id} className="question-item">
            <div>
            {question.question} (Mark: {question.mark})
            </div>
            <div>
            <Eye className="icon" onClick={() => openAnswerModal(question)} />
            <Edit className="icon" onClick={() => openEditModal(question)} />
              </div>
          </li>
        ))}
      </ul>

      {/* Answer Modal */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={closeAnswerModal}
        question={selectedQuestion}
        answers={answers}
        setAnswers={setAnswers}
        newAnswer={newAnswer}
        setNewAnswer={setNewAnswer}
        handleAddAnswer={(e) => {
          e.preventDefault();
          if (answers.length < 5) {
            setAnswers([...answers, { ...newAnswer, id: answers.length + 1 }]);
            setNewAnswer({ option: "", answer_text: "", correct: false });
          }
        }}
      />

      {/* Edit Question Modal */}
      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        question={selectedQuestion}
        handleEditChange={handleEditChange}
        handleSave={handleSaveEdit}
      />
    </div>
  );
};

export default ExamDetails;
