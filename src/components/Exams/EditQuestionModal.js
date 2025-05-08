// src/components/EditQuestionModal.jsx
import React from "react";
import Modal from "react-modal";
import '../../Stylesheets/Questionmodal.css';

Modal.setAppElement("#root");

const EditQuestionModal = ({ isOpen, onClose, editedQuestion, handleEditChange, handleSave }) => {
  if (!editedQuestion) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="customOverlay">
      <div className="customModal">
        <div className="modalHeader">
          <h2>Edit Question</h2>
          <button className="closeButton" onClick={onClose}>&times;</button>
        </div>
        <form className="modalForm" onSubmit={handleSave}>
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            name="question"
            rows={4}
            value={editedQuestion.question}
            onChange={handleEditChange}
            placeholder="Enter question"
            required
          />
          <label htmlFor="mark">Mark:</label>
          <input
            type="number"
            id="mark"
            name="mark"
            value={editedQuestion.mark}
            onChange={handleEditChange}
            placeholder="Mark"
            required
          />
          <div className="buttonGroup">
            <button type="button" className="cancelButton" onClick={onClose}>Cancel</button>
            <button type="submit" className="saveButton">Save</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;
