// documentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an asynchronous thunk
export const getalldocument = createAsyncThunk('document/getalldocument', async (companyData, { dispatch }) => {
  const requestData = {
    DOCUMENT_REF_ID: companyData.COMPANY_ID,
    DOCUMENT_ADMIN_USERNAME: companyData.COMPANY_PARENT_USERNAME,
  };

  try {
    dispatch(setLoading(true));

    // Use axios or another HTTP library to handle responses more easily
    const response = await axios.post('/api/get_all_document', requestData);
    const result = response.data;

    dispatch(setData(result));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
});

// Create the slice
const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documents: [],
    totalDocuments: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      state.documents = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getalldocument.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getalldocument.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload;
        state.totalDocuments = action.payload.result?.length || 0;
      })
      .addCase(getalldocument.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setError, setLoading, setData } = documentSlice.actions;
export default documentSlice.reducer;
