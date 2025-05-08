import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import AnswerModal from "./AnswerModal";
import EditQuestionModal from "./EditQuestionModal";
import AddQuestionModal from "../addQuestionModal";
import { toast } from 'react-toastify';
import { createClacbtQuestion, fetchClacbtQuestions } from "../../redux/slice/question";
import { fetchExams } from "../../redux/slice/exam";
import '../../Stylesheets/Examdetail.css';

const ExamDetails = () => {
  const { id: examId } = useParams();
  const dispatch = useDispatch();
  const exams = useSelector((state) => state.exams.exams);
  const questions = useSelector((state) => state.questions.questionsByExam[examId]);
  const exam = exams.find((e) => e.id === examId);

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ option: "", answer_text: "", correct: false });
  const [newQuestionData, setNewQuestionData] = useState({ question: '', mark: '' });

  useEffect(() => {
    if (examId) {
      dispatch(fetchClacbtQuestions(examId)); // Ensure it fetches the questions for this exam
    }
  }, [dispatch, examId]);

  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswers(question.answers || []);
    setIsAnswerModalOpen(true);
  };

  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setSelectedQuestion(null);
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestion(null);
  };

  const openAddModal = () => {
    setNewQuestionData({ question: '', mark: '' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewQuestion = (e) => {
    e.preventDefault();
    dispatch(createClacbtQuestion({
      examId: examId,
      questionData: newQuestionData,
    }))
      .unwrap()
      .then(() => {
        dispatch(fetchExams());
        toast.success("Question added successfully!");
        closeAddModal();
      })
      .catch((err) => {
        toast.error("Failed to add question");
        console.error(err);
      });
  };

  if (!exam) {
    return <h2>Exam not found</h2>;
  }

  return (
    <div>
      <div className="question-box">
        <button className="question" onClick={openAddModal}>
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="exams-details">
        <h2 className="examdetailname">{exam.name}</h2>
        <p className="examdetailtime">⏳ Duration: {exam.duration} mins</p>
        <p className="examdetailtime">Start Time: {new Date(exam.start_time).toLocaleString()}</p>
        <p className="examdetailtime">End Time: {new Date(exam.end_time).toLocaleString()}</p>

        <h3>Questions</h3>
        <ul className="question-list">
          {questions && questions.map((question) => (
            <li key={question.id} className="question-item">
              <div>
                {question.question} (Mark: {question.mark})
              </div>
              <div>
                <Link to={`/exams/${examId}/questions/${question.id}`}>
                  <button>View / Edit</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <AnswerModal
          isOpen={isAnswerModalOpen}
          onClose={closeAnswerModal}
          question={selectedQuestion}
          answers={answers}
          setAnswers={setAnswers}
          newAnswer={newAnswer}
          setNewAnswer={setNewAnswer}
        />

        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          question={selectedQuestion}
        />

        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          questionData={newQuestionData}
          setQuestionData={setNewQuestionData}
          handleSave={handleSaveNewQuestion}
        />
      </div>
    </div>
  );
};

export default ExamDetails;
