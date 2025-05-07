import { configureStore } from "@reduxjs/toolkit";
import examsReducer from "./slice/index";

export const store = configureStore({
  reducer: {
    exams: examsReducer,
  },
});
