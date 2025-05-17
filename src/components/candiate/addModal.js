import React, { useState } from 'react';

const AddCandidateModal = ({ isOpen, onClose, onAddCandidate }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass email wrapped inside candidate object with score null
    onAddCandidate({
      clacbt_candidate: {
        email: email,
        score: null,
      },
    });
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Candidate</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group add-form">
        <label>Email:</label>
        <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="candidate@example.com"
          />
          </div>
        
      
          <div className="modal-actions">
            <button      className="save-button" type="submit">Add</button>
            <button           className="cancel-button"  type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
