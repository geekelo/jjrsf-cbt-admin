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
import {
  fetchAnswers,
  createAnswer,
  updateAnswer,
} from "../../redux/slice/answer";
import CreateAnswerModal from "./createanswer";
import { ArrowLeft, Edit, Trash, PlusCircle, Check, X, Award, Save, ChevronLeft } from "lucide-react";

const QuestionDetail = () => {
  const { examId, questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => {
    const exam = state.exams.exams.find((e) => e.id === examId);
    return exam ? exam.clacbt_questions : [];
  });

  const answers = useSelector((state) =>
    state.answers.answers.filter((a) => a.clacbt_question_id === questionId)
  );

  const question = questions.find((q) => q.id === questionId);

  const [questionText, setQuestionText] = useState("");
  const [mark, setMark] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    mark: "",
  });
  console.log(editedQuestion);
  
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerData, setEditedAnswerData] = useState({
    answer_text: "",
    correct: false,
  });
  
  useEffect(() => {
    if (questionId) {
      dispatch(fetchAnswers({ questionId }));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setMark(question.mark);
    }
  }, [question]);

  if (!question) {
    return (
      <div className="question-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  const handleSaveQuestion = () => {
    const updatedData = { question: editedQuestion.question, mark: editedQuestion.mark };
    dispatch(updateClacbtQuestion({ examId, questionId, updatedData }))
      .unwrap()
      .then(() => {
        dispatch(fetchClacbtQuestions(examId));
        toast.success("Question updated!");
      })

      .catch(() => toast.error("Failed to update question."));
      closeEditModal()
  };

  const handleDeleteQuestion = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteClacbtQuestion({ examId, questionId }))
        .unwrap()
        .then(() => {
          toast.success("Question deleted!");
          navigate(`/exam/${examId}`);
        })
        .catch(() => toast.error("Failed to delete question."));
    }
  };

  const openEditAnswer = (answer) => {
    setEditingAnswerId(answer.id);
    setEditedAnswerData({
      answer_text: answer.answer_text,
      correct: answer.correct,
    });
  };

  const openEditModal = () => {
    setEditedQuestion({ question: questionText, mark: mark });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const openCreateAnswerModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateAnswerModal = () => {
    setIsCreateModalOpen(false);
  };
  
  const handleCreateAnswer = ({ option, answerText, correct }) => {
    const trimmedOption = option.trim().toUpperCase(); 
    const trimmedAnswerText = answerText.trim();

    if (!trimmedOption || !/^[A-E]$/.test(trimmedOption)) {
      toast.error("Option must be a letter between A and E.");
      return;
    }

    const existingAnswer = answers.find(
      (a) => a.option.toUpperCase() === trimmedOption
    );

    const answerData = {
      clacbt_answer: {
        option: trimmedOption,
        answer_text: trimmedAnswerText,
        correct,
      },
    };

    if (existingAnswer) {
      dispatch(
        updateAnswer({
          examId,
          questionId,
          answerId: existingAnswer.id,
          answerData,
        })
      )
        .unwrap()
        .then(() => {
          toast.success(`Answer option ${trimmedOption} updated!`);
          dispatch(fetchAnswers({ questionId }));
          setIsCreateModalOpen(false);
        })
        .catch(() => toast.error("Failed to update answer."));
    } else {
      dispatch(createAnswer({ examId, questionId, answerData }))
        .unwrap()
        .then(() => {
          toast.success(`Answer option ${trimmedOption} created!`);
          dispatch(fetchAnswers({ questionId }));
          setIsCreateModalOpen(false);
        })
        .catch(() => toast.error("Failed to create answer."));
    }
  };

  const handleSaveAnswer = (answerId) => {
    const answerToUpdate = answers.find((a) => a.id === answerId);
    if (!answerToUpdate) {
      toast.error("Answer not found.");
      return;
    }
    const answerData = {
      clacbt_answer: {
        option: answerToUpdate.option, 
        answer_text: editedAnswerData.answer_text.trim(),
        correct: editedAnswerData.correct,
      },
    };

     dispatch(
      updateAnswer({
        examId,
        questionId,
        answerId: answerToUpdate.id,
        answerData,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Answer updated!");
        dispatch(fetchAnswers({ questionId }));
        setEditingAnswerId(null);
      })
      .catch(() => toast.error("Failed to update answer."));
  };

  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
  };

  return (
    <div className="question-detail-container">
      <div className="question-detail-header">
        <button 
          className="back-button" 
          onClick={() => navigate(`/exam/${examId}`)}
        >
          <ChevronLeft size={20} />
          <span>Back to Exam</span>
        </button>
        
        <h2 className="question-detail-title">Question Details</h2>
      </div>
      
      <div className="question-card">
        <div className="question-card-header">
          <div className="mark-badge">
            <Award size={16} />
            <span>{mark} {mark === '1' ? 'mark' : 'marks'}</span>
          </div>
          <div className="question-actions">
            <button 
              className="action-button edit-button" 
              onClick={openEditModal}
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button 
              className="action-button delete-button" 
              onClick={handleDeleteQuestion}
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        <div className="question-content">
          <h3 className="content-title">Question</h3>
          <div className="question-text">{questionText}</div>
        </div>
      </div>

      <div className="answers-container">
        <div className="answers-header">
          <h3 className="answers-title">Answer Options</h3>
          <button 
            className="add-answer-button" 
            onClick={openCreateAnswerModal}
          >
            <PlusCircle size={16} />
            <span>Add Answer</span>
          </button>
        </div>

        {answers.length > 0 ? (
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div 
                key={answer.id} 
                className={`answer-card ${answer.correct ? 'correct-answer' : ''}`}
              >
                <div className="answer-card-header">
                  <div className="option-badge">
                    Option {answer.option || String.fromCharCode(65 + index)}
                  </div>
                  {answer.correct && (
                    <div className="correct-badge">
                      <Check size={14} />
                      <span>Correct</span>
                    </div>
                  )}
                </div>

                {editingAnswerId === answer.id ? (
                  <div className="edit-answer-form">
                    <textarea
                      className="answer-textarea"
                      rows={3}
                      value={editedAnswerData.answer_text}
                      onChange={(e) =>
                        setEditedAnswerData({
                          ...editedAnswerData,
                          answer_text: e.target.value,
                        })
                      }
                      placeholder="Enter answer text"
                    />

                    <div className="answer-form-actions">
                      <div className="correct-toggle">
                        <label>
                          <input
                            type="checkbox"
                            checked={editedAnswerData.correct}
                            onChange={(e) =>
                              setEditedAnswerData({
                                ...editedAnswerData,
                                correct: e.target.checked,
                              })
                            }
                          />
                          <span>Mark as correct</span>
                        </label>
                      </div>
                      
                      <div className="form-buttons">
                        <button 
                          className="save-button"
                          onClick={() => handleSaveAnswer(answer.id)}
                        >
                          <Save size={16} />
                          <span>Save</span>
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={cancelEditAnswer}
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="answer-content">
                    <p className="answer-text">{answer.answer_text}</p>
                    <button
                      className="edit-answer-button"
                      onClick={() => openEditAnswer(answer)}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-answers">
            <p>No answer options added yet.</p>
            <button 
              className="add-first-answer" 
              onClick={openCreateAnswerModal}
            >
              <PlusCircle size={16} />
              <span>Add your first answer option</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Question Modal */}
      <EditQuestionModal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        editedQuestion={editedQuestion}
        handleEditChange={(e) => {
          const { name, value } = e.target;
          setEditedQuestion({ ...editedQuestion, [name]: value });
        }}
        handleSave={handleSaveQuestion}
      />

      {/* Create Answer Modal */}
      <CreateAnswerModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateAnswerModal}
        onSave={handleCreateAnswer}
      />
    </div>
  );
};

export default QuestionDetail;