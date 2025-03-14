import React, { useMemo } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Required for accessibility

const AnswerModal = ({ isOpen, onClose, question, answers, setAnswers, newAnswer, setNewAnswer, handleAddAnswer }) => {
  if (!question) return null;

  // Check if answer form should be disabled
  const isAnswerFormDisabled = useMemo(() => answers.length >= 5, [answers]);

  // Handle existing answer updates
  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index][e.target.name] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAnswers(updatedAnswers);
  };

  // Handle new answer form input
  const handleNewAnswerChange = (e) => {
    setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>{question.question}</h2>
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>
            <input
              type="text"
              name="option"
              value={answer.option}
              onChange={(e) => handleAnswerChange(e, index)}
            />
            <input
              type="text"
              name="answer_text"
              value={answer.answer_text}
              onChange={(e) => handleAnswerChange(e, index)}
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

      {/* Add Answer Form */}
      <form onSubmit={handleAddAnswer}>
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
            onChange={(e) => setNewAnswer({ ...newAnswer, correct: e.target.checked })}
            disabled={isAnswerFormDisabled}
          />
          Correct
        </label>
        <button type="submit" disabled={isAnswerFormDisabled}>Add Answer</button>
      </form>

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default AnswerModal;
