import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const EditQuestionModal = ({ isOpen, onClose, question, handleEditChange, handleSave }) => {
  if (!question) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>Edit Question</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="question"
          value={question.question}
          onChange={handleEditChange}
          placeholder="Enter question"
          required
        />
        <input
          type="number"
          name="mark"
          value={question.mark}
          onChange={handleEditChange}
          placeholder="Mark"
          required
        />
        <button type="submit">Save</button>
      </form>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default EditQuestionModal;
