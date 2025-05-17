import React, { useState } from "react";
import { X, Save, Check } from "lucide-react";
import "../../Stylesheets/Answermodal.css";

const CreateAnswerModal = ({ isOpen, onClose, onSave }) => {
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [option, setOption] = useState("");
  
  // Available options for the select dropdown
  const availableOptions = ["A", "B", "C", "D", "E"];
  
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
    <div className="answer-modal-overlay">
      <div className="answer-modal-container">
        <div className="answer-modal-content">
          <div className="answer-modal-header">
            <h2 className="answer-modal-title">Create New Answer</h2>
            <button className="answer-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="answer-modal-body">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Select Option</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    required
                  >
                    <option value="" disabled>Choose an option</option>
                    {availableOptions.map((opt) => (
                      <option key={opt} value={opt}>
                         {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Answer Text</label>
                <textarea
                  className="form-textarea"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Enter the answer text here..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={() => setIsCorrect(!isCorrect)}
                    className="form-checkbox"
                  />
                  <div className="checkbox-text">
                    <span>Mark as correct answer</span>
                    <p className="checkbox-help">Select this if this option is the correct answer to the question</p>
                  </div>
                </label>
              </div>
            </form>
          </div>
          
          <div className="answer-modal-footer">
            <button 
              className="cancel-button" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="save-button" 
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Save Answer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAnswerModal;