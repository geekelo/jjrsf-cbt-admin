import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteClacbtQuestion,
  fetchClacbtQuestions,
  updateClacbtQuestion,
} from "../../redux/slice/question";
import EditQuestionModal from "./EditQuestionModal";
import "../../Stylesheets/question.css";

const QuestionDetail = () => {
  const { examId, questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => {
    const exam = state.exams.exams.find((e) => e.id === examId);
    return exam ? exam.clacbt_questions : [];
  });

  const question = questions.find((q) => q.id === questionId);

  const [questionText, setQuestionText] = useState("");
  const [mark, setMark] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    mark: "",
  });

  useEffect(() => {
    if (!question) {
      dispatch(fetchClacbtQuestions(examId));
    }
  }, [dispatch, examId, question]);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setMark(question.mark);

      const filledAnswers = Array.isArray(question.answers)
        ? [...question.answers]
        : [];

      while (filledAnswers.length < 5) {
        filledAnswers.push({ option: "", answer_text: "", correct: false });
      }
      setAnswers(filledAnswers.slice(0, 5));
    }
  }, [question]);

  if (!question) return <p>Loading question...</p>;

  const handleSaveQuestion = () => {
    const updatedData = { question: questionText, mark };
    dispatch(updateClacbtQuestion({ examId, questionId, updatedData }))
      .unwrap()
      .then(() => {
        dispatch(fetchClacbtQuestions(examId));
        toast.success("Question updated!");
      })
      .catch(() => toast.error("Failed to update question."));
  };

  const handleDeleteQuestion = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
  const res =    dispatch(deleteClacbtQuestion({ examId, questionId }))
        .unwrap()
        .then(() => {
          toast.success("Question deleted!");
          navigate(`/exam/${examId}`);
        })
        .catch(() => toast.error("Failed to delete question."));
        
    
    }
  };

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = field === "option" ? value.toUpperCase() : value;
    setAnswers(updated);
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...answers];
    updated[index].correct = value === "correct";
    setAnswers(updated);
  };

  const handleSaveAnswers = () => {
    const updatedData = { answers_attributes: answers };
    dispatch(updateClacbtQuestion({ examId, questionId, updatedData }))
      .unwrap()
      .then(() => {
        dispatch(fetchClacbtQuestions(examId));
        toast.success("Answers updated!");
      })
      .catch(() => toast.error("Failed to update answers."));
  };

  const openEditModal = () => {
    setEditedQuestion({ question: questionText, mark: mark });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({ ...editedQuestion, [name]: value });
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    const updatedData = {
      question: editedQuestion.question,
      mark: editedQuestion.mark,
    };
    dispatch(updateClacbtQuestion({ examId, questionId, updatedData }))
      .unwrap()
      .then(() => {
        dispatch(fetchClacbtQuestions(examId));
        toast.success("Question updated!");
        setQuestionText(editedQuestion.question);
        setMark(editedQuestion.mark);
        closeEditModal();
      })
      .catch(() => toast.error("Failed to update question."));
  };

  return (
    <div className="question-detail">
      <h2 className="question-detail__title">Question Detail</h2>

      <div className="question-detail__field">
        <label className="question-detail__label">Question Text:</label>
        <textarea
          className="question-detail__textarea"
          rows={4}
          value={questionText}
          readOnly
        />
      </div>

      <div className="question-detail__field">
        <label className="question-detail__label">Mark:</label>
        <input
          className="question-detail__input"
          type="number"
          value={mark}
          readOnly
        />
      </div>

      <div className="question-detail__actions">
        <button className="question-detail__button" onClick={openEditModal}>
          Edit Question
        </button>
        <button
          className="question-detail__button question-detail__button--delete"
          onClick={handleDeleteQuestion}
        >
          Delete Question
        </button>
      </div>

      {answers.length > 0 && (
        <>
          <h3 className="question-detail__subtitle">Answers (Options)</h3>

          {answers.map((answer, index) => (
            <div key={index} className="answer-item">
              <label className="answer-item__label">
                {String.fromCharCode(65 + index)}.
              </label>

              <textarea
                className="answer-item__text"
                rows={2}
                value={answer.answer_text}
                onChange={(e) =>
                  handleAnswerChange(index, "answer_text", e.target.value)
                }
                placeholder="Answer text"
              />

              <select
                className="answer-item__select"
                value={answer.correct ? "correct" : "incorrect"}
                onChange={(e) => handleCorrectChange(index, e.target.value)}
              >
                <option value="correct">Correct</option>
                <option value="incorrect">Incorrect</option>
              </select>
            </div>
          ))}

          <button
            className="question-detail__button question-detail__button--save"
            onClick={handleSaveAnswers}
          >
            Save Answers
          </button>
        </>
      )}

      {/* Modal */}
      <EditQuestionModal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        editedQuestion={editedQuestion}
        handleEditChange={handleEditChange}
        handleSave={handleModalSave}
      />
    </div>
  );
};

export default QuestionDetail;
