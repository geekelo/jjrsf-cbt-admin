import React from 'react';
import { X, Save, HelpCircle } from 'lucide-react';
import '../Stylesheets/question.css';

const AddQuestionModal = ({ isOpen, onClose, questionData, setQuestionData, handleSave }) => {
  if (!isOpen) return null;

  // Stop propagation to prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container-add" onClick={handleModalClick}>
        <div className="modal-content-add">
          <div className="modal-header-add">
            <h2 className="modal-title-add">Add New Question</h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">
                  Question Text
                  <span className="required-indicator">*</span>
                </label>
                <textarea
                  className="form-textarea-add"
                  name="question"
                  value={questionData.question}
                  onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
                  placeholder="Enter the question text here..."
                  rows={5}
                  required
                />
                <small className="form-help-text">
                  <HelpCircle size={14} />
                  <span>This is the question that will be presented to students</span>
                </small>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Points
                  <span className="required-indicator">*</span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="mark"
                  min="1"
                  max="100"
                  value={questionData.mark}
                  onChange={(e) => setQuestionData({ 
                    ...questionData, 
                    mark: parseInt(e.target.value, 10) || '' 
                  })}
                  placeholder="Enter point value"
                  required
                />
                <small className="form-help-text">
                  <HelpCircle size={14} />
                  <span>Number of points this question is worth</span>
                </small>
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-button" 
              type="button" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="save-button" 
              type="button" 
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Save Question</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;