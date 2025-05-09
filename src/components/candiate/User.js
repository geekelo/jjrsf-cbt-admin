import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../Stylesheets/User.css";
import { Mail, Edit, Trash } from "lucide-react";
import AddCandidateModal from "./addModal";
import EditCandidateModal from "./editModal";
import { addCandidate, deleteCandidate, fetchCandidates } from "../../redux/slice/candidate";

const UserProfile = () => {
  const { id: clacbt_exam_id } = useParams(); // Get the clacbt_exam_id from the URL
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector((state) => state.clacbtCandidates); // Access candidates state

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState(null); // For storing the candidate to edit

  // Fetch candidates when component mounts
  useEffect(() => {
   const res =  dispatch(fetchCandidates(clacbt_exam_id));
   console.log(res)
  }, [dispatch, clacbt_exam_id]);
console.log(candidates)
  const handleDeleteCandidate = (email) => {
    dispatch(deleteCandidate({ clacbt_exam_id, email }));
  };

  const handleEditCandidate = (candidate) => {
    setEditCandidate(candidate);
    setEditModalOpen(true);
  };

  const handleAddCandidate = (candidateData) => {
    dispatch(addCandidate({ clacbt_exam_id, candidateData }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      <div className="candidateadd">
        <h2>Candidates</h2>
        <button className="add-btn" onClick={() => setAddModalOpen(true)}>
          + Add Candidate
        </button>
      </div>

      <div className="candidates-list">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.email} className="candidate-card">
              <p className="candidateemail">
                <strong>
                  <Mail />
                </strong>{" "}
                {candidate.email}
              </p>
              <p>
                <strong>Score:</strong> {candidate.score ?? "Pending"}
              </p>
              <div className="candidate-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditCandidate(candidate)}
                >
                  <Edit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCandidate(candidate.email)}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-candidates">No candidates have taken the exam yet.</p>
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
          candidate={editCandidate}
          onEditCandidate={editCandidate}
        />
      )}
    </div>
  );
};

export default UserProfile;
