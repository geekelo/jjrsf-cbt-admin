
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Clock, Calendar, FileText, Award, Edit, Eye, MoreVertical } from "lucide-react";
import AnswerModal from "./AnswerModal";
import EditQuestionModal from "./EditQuestionModal";
import AddQuestionModal from "../addQuestionModal";
import { toast } from 'react-toastify';
import { createClacbtQuestion, fetchClacbtQuestions } from "../../redux/slice/question";
import { fetchExams } from "../../redux/slice/exam";
import '../../Stylesheets/Examdetail.css';

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

const ExamDetails = () => {
  const { id: examId } = useParams();
  const dispatch = useDispatch();
  const exams = useSelector((state) => state.exams.exams);
  const questions = useSelector((state) => state.questions.questionsByExam[examId]);
  const exam = exams.find((e) => e.id === examId);

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ option: "", answer_text: "", correct: false });
  const [newQuestionData, setNewQuestionData] = useState({ question: '', mark: '' });
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  useEffect(() => {
    if (examId) {
      dispatch(fetchClacbtQuestions(examId)); // Ensure it fetches the questions for this exam
    }
  }, [dispatch, examId]);

  // Toggle action menu for a question
  const toggleActionMenu = (questionId) => {
    if (activeActionMenu === questionId) {
      setActiveActionMenu(null);
    } else {
      setActiveActionMenu(questionId);
    }
  };

  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswers(question.answers || []);
    setIsAnswerModalOpen(true);
  };

  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setSelectedQuestion(null);
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
  };

  const openAddModal = () => {
    setNewQuestionData({ question: '', mark: '' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewQuestion = (e) => {
    e.preventDefault();
    dispatch(createClacbtQuestion({
      examId: examId,
      questionData: newQuestionData,
    }))
      .unwrap()
      .then(() => {
        dispatch(fetchExams());
        toast.success("Question added successfully!");
        closeAddModal();
      })
      .catch((err) => {
        toast.error("Failed to add question");
        console.error(err);
      });
  };

  if (!exam) {
    return (
      <div className="exam-not-found">
        <h2>Exam not found</h2>
        <Link to="/" className="back-link">
          Return to Exams
        </Link>
      </div>
    );
  }

  const totalQuestions = questions ? questions.length : 0;

  return (
    <div className="exam-details-container">
      <div className="exam-details-header">
        <h1 className="exam-title">{exam.name}</h1>
        <button className="add-question-btn" onClick={openAddModal}>
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="exam-info-card">
        <div className="exam-info-content">
          <div className="exam-info-item">
            <Clock className="info-icon" size={20} />
            <div className="info-text">
              <span className="info-label">Duration</span>
              <span className="info-value">{exam.duration} minutes</span>
            </div>
          </div>
          
          <div className="exam-info-item">
            <Calendar className="info-icon" size={20} />
            <div className="info-text">
              <span className="info-label">Start Time</span>
              <span className="info-value">{formatDateTime(exam.start_time)}</span>
            </div>
          </div>
          
          <div className="exam-info-item">
            <Calendar className="info-icon" size={20} />
            <div className="info-text">
              <span className="info-label">End Time</span>
              <span className="info-value">{formatDateTime(exam.end_time)}</span>
            </div>
          </div>
          
          <div className="exam-info-item">
            <FileText className="info-icon" size={20} />
            <div className="info-text">
              <span className="info-label">Questions</span>
              <span className="info-value">{totalQuestions} total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="questions-section">
        <div className="section-header">
          <h2>Questions</h2>
          <div className="question-count">
            <FileText size={16} />
            <span>{totalQuestions} questions</span>
          </div>
        </div>

        {questions && questions.length > 0 ? (
          <ul className="question-list">
            {questions.map((question, index) => (
              <li key={question.id} className="question-card">
                <div className="question-card-header">
                  <div className="question-number">Q{index + 1}</div>
                  <div className="card-menu">
                    <button 
                      className="card-menu-btn"
                      onClick={() => toggleActionMenu(question.id)}
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {activeActionMenu === question.id && (
                      <div className="card-menu-dropdown">
                        <Link 
                          to={`/exams/${examId}/questions/${question.id}`} 
                          className="menu-item"
                          onClick={() => setActiveActionMenu(null)}
                        >
                          <Eye size={18} />
                          <span>View Question</span>
                        </Link>
                        <button 
                          className="menu-item"
                          onClick={() => {
                            openEditModal(question);
                            setActiveActionMenu(null);
                          }}
                        >
                          <Edit size={18} />
                          <span>Edit Question</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="question-card-content">
                  <div className="question-text">{question.question}</div>
                  <div className="question-mark">
                    <Award size={16} />
                    <span>{question.mark} {question.mark === 1 ? 'mark' : 'marks'}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-questions">
            <p>No questions added yet.</p>
            <button className="add-first-question-btn" onClick={openAddModal}>
              <Plus size={16} /> Add Your First Question
            </button>
          </div>
        )}
      </div>

      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={closeAnswerModal}
        question={selectedQuestion}
        answers={answers}
        setAnswers={setAnswers}
        newAnswer={newAnswer}
        setNewAnswer={setNewAnswer}
      />

      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        question={selectedQuestion}
      />

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        questionData={newQuestionData}
        setQuestionData={setNewQuestionData}
        handleSave={handleSaveNewQuestion}
      />
    </div>
  );
};

export default ExamDetails;