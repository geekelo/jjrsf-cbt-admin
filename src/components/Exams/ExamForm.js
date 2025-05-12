// src/components/ExamForm.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="exam-form-title">
      <div className="modal-content">
        <h3 id="exam-form-title">{isEditMode ? "Edit Exam" : "Add New Exam"}</h3>

        {(error || formError) && (
          <p className="error-message">{formError ? formError : error}</p>
        )}

        <form onSubmit={handleSubmit} className="exam-form">
          <input
            type="text"
            name="name"
            placeholder="Exam Name"
            value={examData.name}
            onChange={handleChange}
            required
            autoFocus
            disabled={submitting}
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (in minutes)"
            value={examData.duration}
            onChange={handleChange}
            min="1"
            required
            disabled={submitting}
          />

          <label>Start Date and Time</label>
          <div className="datetime-group">
            <input
              type="date"
              name="start_date"
              value={examData.start_date}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <input
              type="time"
              name="start_time"
              value={examData.start_time}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <label>End Date and Time</label>
          <div className="datetime-group">
            <input
              type="date"
              name="end_date"
              value={examData.end_date}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <input
              type="time"
              name="end_time"
              value={examData.end_time}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <button type="submit" className="add-exam-btn" disabled={submitting}>
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Exam"
              : "Add Exam"}
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamForm;
