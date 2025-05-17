import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../Stylesheets/User.css";
import { Mail, Edit, Trash, Plus, User } from "lucide-react";
import AddCandidateModal from "./addModal";
import EditCandidateModal from "./editModal";
import {
  addCandidate,
  deleteCandidate,
  fetchCandidates,
  editCandidate,
} from "../../redux/slice/candidate";

const UserProfile = () => {
  const { id: clacbt_exam_id } = useParams(); // Get the clacbt_exam_id from the URL
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector(
    (state) => state.clacbtCandidates
  ); // Access candidates state

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editCandidateData, setEditCandidateData] = useState(null); // For storing the candidate to edit

  // Fetch candidates when component mounts
  useEffect(() => {
    dispatch(fetchCandidates(clacbt_exam_id));
  }, [dispatch, clacbt_exam_id]);

  const handleDeleteCandidate = (id) => {
    dispatch(deleteCandidate({ clacbt_exam_id, id }))
      .then(() => {
        toast.success("Candidate deleted successfully!");
        dispatch(fetchCandidates(clacbt_exam_id)); 
      })
      .catch((err) => {
        toast.error(`Error deleting candidate: ${err.message}`);
      });
  };

  const handleEditCandidate = (clacbt_exam_id, id, candidateData) => {
    dispatch(editCandidate({ clacbt_exam_id, id, candidateData }))
      .then(() => {
        toast.success("Candidate updated successfully!");
        dispatch(fetchCandidates(clacbt_exam_id)); 
      })
      .catch((err) => {
        toast.error(`Error updating candidate: ${err.message}`);
      });
  };

  const handleAddCandidate = (candidateData) => {
    dispatch(addCandidate({ clacbt_exam_id, candidateData }))
      .then(() => {
        toast.success("Candidate added successfully!");
        dispatch(fetchCandidates(clacbt_exam_id)); 
      })
      .catch((err) => {
        toast.error(`Error adding candidate: ${err.message}`);
      });
  };

  if (loading) return (
    <div className="profile-container">
      <div className="loading-indicator">
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="profile-container">
      <div className="error-message">
        <p>Error: {error.message || "An unknown error occurred"}</p>
        <button className="retry-btn" onClick={() => dispatch(fetchCandidates(clacbt_exam_id))}>
          Try Again
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="profile-container">
      <div className="candidateadd">
        <h2>
          Candidates {candidates.length > 0 && (
            <span className="candidate-count">{candidates.length}</span>
          )}
        </h2>
        <button className="add-btn" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      <div className="candidates-list">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.email} className="candidate-card">
              <div className="candidate-info">
                <p className="candidateemail">
                  <Mail size={18} />
                  {candidate.email}
                </p>
                <p>
                  <strong>Score:</strong> 
                  {candidate.score !== null && candidate.score !== undefined ? (
                    <span className="score-value">{candidate.score}</span>
                  ) : (
                    <span className="score-pending">Pending</span>
                  )}
                </p>
              </div>
              <div className="candidate-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditCandidateData(candidate);
                    setEditModalOpen(true);
                  }}
                  title="Edit candidate"
                >
                  <Edit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCandidate(candidate.id)}
                  title="Delete candidate"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-candidates">
            <User size={32} />
            <p>No candidates have taken the exam yet.</p>
            <p>Add candidates to get started.</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddCandidateModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddCandidate={handleAddCandidate}
        />
      )}

      {isEditModalOpen && (
        <EditCandidateModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          candidate={editCandidateData}
          clacbt_exam_id={clacbt_exam_id}
          onSave={handleEditCandidate} // Pass handleEditCandidate as onSave prop
        />
      )}
    </div>
  );
};

export default UserProfile;