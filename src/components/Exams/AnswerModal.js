import React, { useMemo } from "react";
import Modal from "react-modal";
import "../../Stylesheets/Answermodal.css";

Modal.setAppElement("#root");

const AnswerModal = ({
  isOpen,
  onClose,
  question,
  answers,
  setAnswers,
  newAnswer,
  setNewAnswer,
  handleAddAnswer,
}) => {
  const isAnswerFormDisabled = useMemo(() => answers.length >= 5, [answers]);

  if (!question) return null;

  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index][e.target.name] =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleNewAnswerChange = (e) => {
    setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="customOverlay">
      <div className="customModal">
        <div className="modal-header">
          <h2>{question.question}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <ul className="answer-list">
          {answers.map((answer, index) => (
            <li key={index}>
              <input
                type="text"
                name="option"
                value={answer.option}
                onChange={(e) => handleAnswerChange(e, index)}
                placeholder="Option"
              />
              <input
                type="text"
                name="answer_text"
                value={answer.answer_text}
                onChange={(e) => handleAnswerChange(e, index)}
                placeholder="Answer Text"
              />
              <label>
                <input
                  type="checkbox"
                  name="correct"
                  checked={answer.correct}
                  onChange={(e) => handleAnswerChange(e, index)}
                />
                Correct
              </label>
            </li>
          ))}
        </ul>

        <form className="add-answer-form" onSubmit={handleAddAnswer}>
          <input
            type="text"
            name="option"
            placeholder="Option"
            value={newAnswer.option}
            onChange={handleNewAnswerChange}
            disabled={isAnswerFormDisabled}
          />
          <input
            type="text"
            name="answer_text"
            placeholder="Answer Text"
            value={newAnswer.answer_text}
            onChange={handleNewAnswerChange}
            disabled={isAnswerFormDisabled}
          />
          <label>
            <input
              type="checkbox"
              name="correct"
              checked={newAnswer.correct}
              onChange={(e) =>
                setNewAnswer({ ...newAnswer, correct: e.target.checked })
              }
              disabled={isAnswerFormDisabled}
            />
            Correct
          </label>
          <button type="submit" disabled={isAnswerFormDisabled}>
            Add Answer
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AnswerModal;
