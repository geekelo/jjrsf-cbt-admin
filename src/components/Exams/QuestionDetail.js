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
        <button
          className="question-detail__button question-detail__button--create-answer"
          onClick={openCreateAnswerModal}
        >
          Create New Answer
        </button>
      </div>

      {answers.length > 0 && (
        <>
          <h3 className="question-detail__subtitle">Answers (Options)</h3>

          {answers.map((answer, index) => (
            <div key={answer.id} className="answer-item">
              <label className="answer-item__label">
                {String.fromCharCode(65 + index)}.
              </label>

              {editingAnswerId === answer.id ? (
                <>
                  <textarea
                    className="answer-item__text"
                    rows={2}
                    value={editedAnswerData.answer_text}
                    onChange={(e) =>
                      setEditedAnswerData({
                        ...editedAnswerData,
                        answer_text: e.target.value,
                      })
                    }
                  />

                  <select
                    className="answer-item__select"
                    value={editedAnswerData.correct ? "correct" : "incorrect"}
                    onChange={(e) =>
                      setEditedAnswerData({
                        ...editedAnswerData,
                        correct: e.target.value === "correct",
                      })
                    }
                  >
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                  </select>

                  <button onClick={() => handleSaveAnswer(answer.id)}>
                    Save
                  </button>
                  <button onClick={cancelEditAnswer}>Cancel</button>
                </>
              ) : (
                <>
                  <textarea
                    className="answer-item__text"
                    rows={2}
                    value={answer.answer_text}
                    readOnly
                  />

                  <select
                    className="answer-item__select"
                    value={answer.correct ? "correct" : "incorrect"}
                    disabled
                  >
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                  </select>

                  <button onClick={() => openEditAnswer(answer)}>Edit</button>
                </>
              )}
            </div>
          ))}
        </>
      )}

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
