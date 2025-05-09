import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getAuthToken = () => localStorage.getItem("authToken");

// Fetch Answers for a question
export const fetchAnswers = createAsyncThunk(
    'answers/fetchAnswers',
    async ({ questionId }, thunkAPI) => {
      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${API_BASE_URL}/clacbt_questions/${questionId}/clacbt_answers/?question_id=${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return { questionId, answers: response.data };
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
// Create Answer
export const createAnswer = createAsyncThunk(
  'answers/createAnswer',
  async ({ examId, questionId, answerData }, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/clacbt_questions/${questionId}/clacbt_answers/?question_id=${questionId}`,
         answerData ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      console.log(response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);export const updateAnswer = createAsyncThunk(
  'answers/updateAnswer',
  async ({ questionId, answerId, answerData }, thunkAPI) => {
    console.log('updateAnswer arg:', { questionId, answerId, answerData });

    try {
      const token = getAuthToken();

      // Clean answerData to remove unwanted fields
      const cleanedAnswerData = {
        clacbt_answer: {
          answer_text: answerData.clacbt_answer.answer_text,
          correct: answerData.clacbt_answer.correct,
        },
      };

      console.log('updateAnswer cleaned payload sent to API:', cleanedAnswerData);

      // Proper query params
      const url = `${API_BASE_URL}/clacbt_questions/${questionId}/clacbt_answers/${answerId}?question_id=${questionId}&id=${answerId}`;
      console.log('updateAnswer FULL API URL:', url);

      const response = await axios.patch(
        url,
        cleanedAnswerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('updateAnswer API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('updateAnswer API error:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);



const answersSlice = createSlice({
  name: 'answers',
  initialState: {
    answers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  
      // fetchAnswers
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        
        state.loading = false;
        const { questionId, answers } = action.payload;
  
        // Replace answers related to this questionId
        const filteredAnswers = state.answers.filter(
          (ans) => ans.clacbt_question_id !== questionId
        );
        const updatedAnswers = answers.map(ans => ({
          ...ans,
          clacbt_question_id: questionId
        }));
  
        state.answers = [...filteredAnswers, ...updatedAnswers];
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        console.error('fetchAnswers error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
  
      // createAnswer
      .addCase(createAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        console.log('createAnswer success:', action.payload);
        state.loading = false;
        state.answers.push(action.payload);
      })
      .addCase(createAnswer.rejected, (state, action) => {
        console.error('createAnswer error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
  
      // updateAnswer
    // updateAnswer
.addCase(updateAnswer.pending, (state) => {
  console.log('updateAnswer pending...');
  state.loading = true;
  state.error = null;
})
.addCase(updateAnswer.fulfilled, (state, action) => {
  console.log('updateAnswer success, payload:', action.payload);
  state.loading = false;
  const index = state.answers.findIndex(a => a.id === action.payload.id);
  if (index !== -1) {
    console.log('Updating answer at index:', index, 'Old answer:', state.answers[index]);
    state.answers[index] = action.payload;
    console.log('Updated answer:', state.answers[index]);
  } else {
    console.warn('updateAnswer: Answer not found in state for id:', action.payload.id);
  }
})
.addCase(updateAnswer.rejected, (state, action) => {
  console.error('updateAnswer error:', action.payload);
  state.loading = false;
  state.error = action.payload;
});

  }
  
});

export default answersSlice.reducer;
