import React, { useState } from "react";
import "../../Stylesheets/User.css";
import { useParams } from "react-router-dom";
import { Mail } from "lucide-react";

const UserProfile = ({ candidates, onAddCandidate }) => {
  const { user } = useParams();
  const candidate = candidates.find((c) => c.email === user);

  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const handleAddCandidate = () => {
    if (email.trim() && subject.trim()) {
      onAddCandidate({ email, subject, score: null });
      setModalOpen(false);
      setEmail("");
      setSubject("");
    }
  };

  return (
    <div className="profile-container">
      <div className="candidateadd">
        <h2> Candidates</h2>
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          + Add Candidate
        </button>
      </div>

      <div className="candidates-list">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.email} className="candidate-card">
              <p className="candidateemail">
                <strong>
                  {" "}
                  <Mail />{" "}
                </strong>{" "}
                {candidate.email}
              </p>
              <p>
                <strong>Score:</strong> {candidate.score ?? "Pending"}
              </p>
            </div>
          ))
        ) : (
          <p className="no-candidates">
            No candidates have taken the exam yet.
          </p>
        )}
      </div>

      <h3>Candidates Yet to Write</h3>
      <div className="pending-list">
        {candidates.filter((c) => c.score === null || c.score === undefined)
          .length > 0 ? (
          candidates
            .filter((c) => c.score === null || c.score === undefined)
            .map((c) => (
              <div key={c.email} className="pending-card">
                <p>
                  <strong>Email:</strong> {c.email}
                </p>
                <p className="pending">Not Taken</p>
              </div>
            ))
        ) : (
          <p className="no-pending">All candidates have written the exam.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Candidate</h3>
            <input
              type="email"
              placeholder="Candidate Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAddCandidate}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
