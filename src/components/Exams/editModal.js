import React, { useState, useEffect } from "react";

const EditAnswerModal = ({ isOpen, onClose, answer, onSave }) => {
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (answer) {
      setAnswerText(answer.answer_text);
      setIsCorrect(answer.correct);
    }
  }, [answer]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ answerText, isCorrect });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Answer</h3>
        <form onSubmit={handleSave}>
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter your answer"
            rows={3}
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={isCorrect}
                onChange={() => setIsCorrect(!isCorrect)}
              />
              Correct Answer
            </label>
          </div>
          <div className="modal-actions">
<button type="submit">Save</button>
<button type="button" onClick={onClose}>
Cancel
</button>
</div>
</form>
</div>
</div>
);
};

export default EditAnswerModal;
