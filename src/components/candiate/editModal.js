import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editCandidate } from '../../redux/slice/candidate';

const EditCandidateModal = ({ isOpen, onClose, candidate, clacbt_exam_id }) => {
  const [score, setScore] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (candidate) {
      setScore(candidate.score || '');
    }
  }, [candidate]);

  const handleSave = () => {
    const candidateData = {
      clacbt_candidate: {
        score: parseInt(score, 10),
      },
    };
    dispatch(editCandidate({ clacbt_exam_id, id: candidate.id, candidateData }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Candidate</h3>
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
