import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCandidate } from '../../redux/slice/candidate';
import { toast } from 'react-toastify'; // Import toast

const AddCandidateModal = ({ isOpen, onClose, clacbt_exam_id }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  // Handle save and dispatch action to add the candidate
  const handleSave = async () => {
    if (!email.trim()) {
      toast.error('Please enter a valid email!'); // Show error toast if email is empty
      return;
    }

    try {
      // Dispatch the addCandidate action
      const candidateData = {
        clacbt_candidate: {
          email,
          score: null,
        },
      };

      // Dispatch the action and wait for response (assuming it's async)
      const res = await dispatch(addCandidate({ clacbt_exam_id, candidateData }));

      // Show success toast
      toast.success('Candidate added successfully!');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add candidate:', error);
      toast.error('Failed to add candidate. Please try again.'); // Show error toast
    }
  };

  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Candidate</h3>
        <input
          type="email"
          placeholder="Enter candidate email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
