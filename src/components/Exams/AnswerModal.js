import React from "react";
import Modal from "react-modal";
import "../../Stylesheets/Answermodal.css";

const AnswerModal = ({ isOpen, onClose, answerData, handleSave, options }) => {
  // Early return if modal is not open or answerData is missing
  if (!isOpen || !answerData || !answerData.clacbt_answer) return null;

  const { option, answer_text, correct } = answerData.clacbt_answer;

  const handleAnswerChange = (e) => {
    const newAnswer = { ...answerData };
    newAnswer.clacbt_answer.answer_text = e.target.value;
    handleSave(newAnswer);
  };

  const handleOptionChange = (e) => {
    const newAnswer = { ...answerData };
    newAnswer.clacbt_answer.option = e.target.value;
    handleSave(newAnswer);
  };

  const handleCorrectChange = () => {
    const newAnswer = { ...answerData };
    newAnswer.clacbt_answer.correct = !correct;
    handleSave(newAnswer);
  };

  // Dynamically generate option elements (useMemo is always called)
  const optionElements = () => {
    return options.map((opt, index) => (
      <option key={index} value={opt}>
        {opt}
      </option>
    ));
  } // Re-run memoization when 'options' changes

  return (
    <div className="answer-modal">
      <div className="answer-modal__content">
        <button className="answer-modal__close" onClick={onClose}>X</button>
        <div className="answer-modal__form-group">
          <label className="answer-modal__label">Option:</label>
          <select className="answer-modal__select" value={option} onChange={handleOptionChange}>
            {optionElements} {/* Render dynamic options here */}
          </select>
        </div>
        <div className="answer-modal__form-group">
          <label className="answer-modal__label">Answer Text:</label>
          <input
            className="answer-modal__input"
            type="text"
            value={answer_text}
            onChange={handleAnswerChange}
          />
        </div>
        <div className="answer-modal__form-group">
          <label className="answer-modal__label">Correct Answer:</label>
          <input
            className="answer-modal__checkbox"
            type="checkbox"
            checked={correct}
            onChange={handleCorrectChange}
          />
        </div>
        <button className="answer-modal__save-button" onClick={() => handleSave(answerData)}>Save Answer</button>
      </div>
    </div>
  );
};

export default AnswerModal;
