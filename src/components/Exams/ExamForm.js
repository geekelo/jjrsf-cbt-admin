import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar,X, Save, AlertCircle } from "lucide-react";
import "../../Stylesheets/examform.css";
import { createExam, updateExam } from "../../redux/slice/exam";
import { toast } from "react-toastify";

const ExamForm = ({ initialData = null, onClose }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.exams);

  const isEditMode = Boolean(initialData);

  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track form changes

  // Pre-fill form in edit mode
  useEffect(() => {
    if (initialData) {
      const parseDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return { date: "", time: "" };
        const dt = new Date(dateTimeStr);
        if (isNaN(dt)) return { date: "", time: "" };
        const date = dt.toISOString().slice(0, 10);
        const time = dt.toTimeString().slice(0, 5);
        return { date, time };
      };
    
      const start = parseDateTime(initialData.start_time);
      const end = parseDateTime(initialData.end_time);
    
      setExamData({
        name: initialData.name,
        duration: initialData.duration,
        start_date: start.date,
        start_time: start.time,
        end_date: end.date,
        end_time: end.time,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    return `${date} ${time}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    setSubmitting(true);

    const formattedExam = {
      name: examData.name.trim(),
      duration: Number(examData.duration),
      start_time: combineDateTime(examData.start_date, examData.start_time),
      end_time: combineDateTime(examData.end_date, examData.end_time),
    };
    
    try {
      if (isEditMode) {
        await dispatch(updateExam({ id: initialData.id, ...formattedExam })).unwrap();
        toast.success("Exam updated successfully!");
      } else {
        await dispatch(createExam(formattedExam)).unwrap();
        toast.success("Exam added successfully!");
      }
    
      // Reset form and close
      setExamData({
        name: "",
        duration: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
      });
      setIsDirty(false);
      onClose();
    } catch (err) {
      toast.error("Failed to save exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !submitting) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="exam-modal" role="dialog" aria-modal="true" aria-labelledby="exam-form-title">
      <div className="exam-modal-content">
        <div className="exam-modal-header">
          <h3 id="exam-form-title" className="exam-modal-title">
            {isEditMode ? "Edit Exam" : "Add New Exam"}
          </h3>
          <button 
            type="button" 
            className="exam-modal-close" 
            onClick={handleCancel} 
            aria-label="Close"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {(error || formError) && (
          <div className="exam-form-error">
            <AlertCircle size={18} />
            <p>{formError ? formError : error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label htmlFor="exam-name" className="form-label">Exam Name</label>
            <input
              id="exam-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter the exam name"
              value={examData.name}
              onChange={handleChange}
              required
              autoFocus
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="exam-duration" className="form-label">Duration (minutes)</label>
            <input
              id="exam-duration"
              type="number"
              name="duration"
              className="form-input"
              placeholder="Enter duration in minutes"
              value={examData.duration}
              onChange={handleChange}
              min="1"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date and Time</label>
            <div className="datetime-group">
              <div className="datetime-input">
      
                <input
                  type="date"
                  name="start_date"
                  className="date-input"
                  value={examData.start_date}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="datetime-input">
      
                <input
                  type="time"
                  name="start_time"
                  className="time-input"
                  value={examData.start_time}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">End Date and Time</label>
            <div className="datetime-group">
              <div className="datetime-input">
              
                <input
                  type="date"
                  name="end_date"
                  className="date-input"
                  value={examData.end_date}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="datetime-input">
            
                <input
                  type="time"
                  name="end_time"
                  className="time-input"
                  value={examData.end_time}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCancel} 
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={submitting}
            >
              <Save size={18} />
              <span>
                {submitting
                  ? isEditMode ? "Updating..." : "Adding..."
                  : isEditMode ? "Update Exam" : "Add Exam"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;