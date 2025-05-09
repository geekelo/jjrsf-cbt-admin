import React, { useState } from "react";
import "../../Stylesheets/Answermodal.css";
const CreateAnswerModal = ({ isOpen, onClose, onSave }) => {
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [option, setOption] = useState(""); 

  const handleSave = (e) => {
    e.preventDefault();
    if (answerText.trim() === "" || option.trim() === "") {
      alert("Please enter an option and answer text.");
      return;
    }
    onSave({ option, answerText, correct: isCorrect });
    setAnswerText("");
    setIsCorrect(false); 
    setOption(""); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-header">Create New Answer</h3>
        <form onSubmit={handleSave} className="modal-form">
          <div className="modal-field">
            <label className="create-answer__label">Option (A–E):</label>
            <input
              type="text"
              className="create-answer__input"
              value={option}
              maxLength={1}
              onChange={(e) => {
                const input = e.target.value.toUpperCase();
                // Allow only A–E or empty string (so they can delete)
                if (/^[A-E]?$/.test(input)) {
                  setOption(input);
                }
              }}
              placeholder="A"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Answer Text</label>
            <textarea
              className="modal-textarea"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Enter your answer"
              rows={3}
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-checkbox-label">
              <input
                type="checkbox"
                checked={isCorrect}
                onChange={() => setIsCorrect(!isCorrect)}
                className="modal-checkbox"
              />
              Correct Answer
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-btn save-btn">
              Save Answer
            </button>
            <button
              type="button"
              className="modal-btn close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnswerModal;
