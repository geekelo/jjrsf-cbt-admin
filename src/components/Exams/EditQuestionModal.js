import React from "react";
import Modal from "react-modal";
import { X, Save, XCircle } from "lucide-react";
import '../../Stylesheets/Questionmodal.css';

Modal.setAppElement("#root");

const EditQuestionModal = ({ isOpen, onClose, editedQuestion, handleEditChange, handleSave }) => {
  if (!editedQuestion) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="custom-modal-overlay"
      overlayClassName="modal-overlay"
    >
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Edit Question</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form className="modal-form" onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}>
          <div className="form-group">
            <label htmlFor="question" className="form-label">Question Text</label>
            <textarea
              id="question"
              name="question"
              className="form-textarea"
              rows={5}
              value={editedQuestion.question}
              onChange={handleEditChange}
              placeholder="Enter the question text here..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mark" className="form-label">Points</label>
            <input
              type="number"
              id="mark"
              name="mark"
              className="form-input"
              value={editedQuestion.mark}
              onChange={handleEditChange}
              placeholder="Enter point value"
              min="1"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
            >
              <XCircle size={18} />
              <span>Cancel</span>
            </button>
            <button 
              type="submit" 
              className="save-button"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;