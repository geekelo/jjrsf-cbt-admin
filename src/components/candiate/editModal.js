import React, { useState, useEffect } from 'react';

const EditCandidateModal = ({ isOpen, onClose, candidate, clacbt_exam_id, onSave }) => {
  const [score, setScore] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (candidate) {
      setScore(candidate.score || '');
      setEmail(candidate.email || '');
    }
  }, [candidate]);

  const handleSave = () => {
    const candidateData = {
      clacbt_candidate: {
        email: email.trim(),
        score: score !== '' ? parseInt(score, 10) : null,  // handle empty as null
      },
    };
    onSave(clacbt_exam_id, candidate.id, candidateData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Candidate</h3>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditCandidateModal;
