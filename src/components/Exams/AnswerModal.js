import React from "react";
import Modal from "react-modal";
import { X, Save, Check } from "lucide-react";
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
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="answer-modal-container"
      overlayClassName="answer-modal-overlay"
    >
      <div className="answer-modal-content">
        <div className="answer-modal-header">
          <h2 className="answer-modal-title">Edit Answer Option</h2>
          <button className="answer-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="answer-modal-body">
          <div className="form-group">
            <label className="form-label">Option</label>
            <select 
              className="form-select" 
              value={option} 
              onChange={handleOptionChange}
            >
              {optionElements()}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Answer Text</label>
            <textarea
              className="form-textarea"
              value={answer_text}
              onChange={handleAnswerChange}
              rows={4}
              placeholder="Enter the answer text..."
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={correct}
                onChange={handleCorrectChange}
              />
              <div className="checkbox-text">
                <span>Mark as correct answer</span>
                <p className="checkbox-help">Select this if this option is the correct answer to the question</p>
              </div>
            </label>
          </div>
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
            onClick={() => handleSave(answerData)}
          >
            <Save size={16} />
            <span>Save Answer</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AnswerModal;