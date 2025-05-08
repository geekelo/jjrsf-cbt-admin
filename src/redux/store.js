import { configureStore } from "@reduxjs/toolkit";
import examsReducer from "./slice/exam";
import questionsReducer from './slice/question'

export const store = configureStore({
  reducer: {
    exams: examsReducer,
    questions: questionsReducer,
  },
});
