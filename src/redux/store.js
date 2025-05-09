import { configureStore } from "@reduxjs/toolkit";
import examsReducer from "./slice/exam";
import questionsReducer from './slice/question'
import answersReducer from './slice/answer'
import candidateReducer from './slice/candidate'
export const store = configureStore({
  reducer: {
    exams: examsReducer,
    questions: questionsReducer,
    answers: answersReducer,
    clacbtCandidates: candidateReducer,
  },
});
