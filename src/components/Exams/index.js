// src/components/Exams.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Plus,
  User2,
  Pencil,
  Trash,
  Clock,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ExamForm from "./ExamForm";
import "../../Stylesheets/Exams.css";
import { fetchExams, deleteExam } from "../../redux/slice/exam";
import Apploader from "../loader/Apploader";
import EmptyState from "../EmptyState/EmptyState";

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Exams = () => {
  const { exams, loading, error } = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Function to toggle action menu for an exam
  const toggleActionMenu = (examId) => {
    if (activeMenu === examId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(examId);
    }
  };

  // Fetch exams on mount
  useEffect(() => {
    if (!hasLoadedOnce || exams.length === 0) {
      dispatch(fetchExams()).then(() => {
        setHasLoadedOnce(true);
      });
    }
  }, [dispatch, hasLoadedOnce, exams.length]);

  // Open form for new exam
  const handleAddExam = () => {
    setEditingExam(null);
    setShowForm(true);
  };

  // Open form for editing existing exam
  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };

  // Close form after add/edit
  const handleCloseForm = () => {
    setEditingExam(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      dispatch(deleteExam(id))
        .then((res) => {
          // Optional: check res.meta.requestStatus === "fulfilled"
          toast.success("Exam deleted successfully!");
        })
        .catch(() => {
          toast.error("Failed to delete exam. Please try again.");
        });
    }
  };

  const sortedExams = useMemo(() => {
  return [...exams].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );
}, [exams]);

  const shouldShowLoading = loading && !hasLoadedOnce;
  return (
    <div className="exams-container">
      <div className="exams-header">
        <h2>Exams Dashboard</h2>
        <button className="add-exam-btn" onClick={handleAddExam}>
          <Plus size={18} />
          <span>New Exam</span>
        </button>
      </div>

      {shouldShowLoading && <Apploader />}

      {error && <div className="error-message">{error}</div>}

      {!shouldShowLoading && exams.length === 0 && (
        <EmptyState message="No exams available. Create your first exam!" />
      )}

      <div className="exam-list">
        {sortedExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <h3>{exam.name}</h3>
                <div className="exam-actions">
                  <button
                    className="icon-button more-button"
                    onClick={() => toggleActionMenu(exam.id)}
                    title="More Actions"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {activeMenu === exam.id && (
                    <div className="action-dropdown">
                      <button
                        className="action-item"
                        onClick={() => {
                          navigate(`/exam/${exam.id}`);
                          setActiveMenu(null);
                        }}
                      >
                        <Eye size={18} />
                        <span>View Exam</span>
                      </button>
                      <button
                        className="action-item"
                        onClick={() => {
                          navigate(`/user/${exam.id}`);
                          setActiveMenu(null);
                        }}
                      >
                        <User2 size={18} />
                        <span>View Users</span>
                      </button>
                      <button
                        className="action-item"
                        onClick={() => {
                          handleEditExam(exam);
                          setActiveMenu(null);
                        }}
                      >
                        <Pencil size={18} />
                        <span>Edit Exam</span>
                      </button>
                      <button
                        className="action-item delete"
                        onClick={() => {
                          handleDelete(exam.id);
                          setActiveMenu(null);
                        }}
                      >
                        <Trash size={18} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="exam-card-content">
                <div className="exam-info">
                  <div className="exam-duration-badge">
                    <Clock size={16} />
                    <span>{exam.duration} mins</span>
                  </div>

                  <div className="exam-time-info">
                    <div className="time-row">
                      <Calendar size={16} />
                      <div className="time-details">
                        <span className="time-label">Start:</span>
                        <span className="time-value">
                          {formatDateTime(exam.start_time)}
                        </span>
                      </div>
                    </div>
                    <div className="time-row">
                      <Calendar size={16} />
                      <div className="time-details">
                        <span className="time-label">End:</span>
                        <span className="time-value">
                          {formatDateTime(exam.end_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ExamForm
              initialData={editingExam}
              onClose={handleCloseForm}
              onSuccess={() => {
                // Don't reload exams, just update the Redux store
                toast.success(
                  editingExam
                    ? "Exam updated successfully!"
                    : "Exam created successfully!"
                );
                handleCloseForm();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
