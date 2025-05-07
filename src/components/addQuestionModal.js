import React from 'react';
import '../Stylesheets/question.css';

const AddQuestionModal = ({ isOpen, onClose, questionData, setQuestionData, handleSave }) => {
  if (!isOpen) return null;

  return (
    <div className="add-question-overlay">
      <div className="add-question-modal">
        <h2 className="add-question-title">Add New Question</h2>
        <form className="add-question-form" onSubmit={handleSave}>
          <label className="add-question-label">Question:</label>
          <textarea
            className="add-question-textarea"
            name="question"
            value={questionData.question}
            onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
            required
          />
          <label className="add-question-label">Mark:</label>
          <input
            className="add-question-input"
            type="number"
            name="mark"
            value={questionData.mark}
            onChange={(e) => setQuestionData({ ...questionData, mark: parseInt(e.target.value, 10) })}
            required
          />
          <div className="add-question-actions">
            <button className="add-question-save-btn" type="submit">Save</button>
            <button className="add-question-cancel-btn" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
