import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisState, Analysis, AnalysisDetail } from '@/types';

const initialState: AnalysisState = {
  analyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    // Create analysis
    createAnalysisStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createAnalysisSuccess: (state, action: PayloadAction<Analysis>) => {
      state.isLoading = false;
      state.currentAnalysis = action.payload as AnalysisDetail;
      state.analyses.unshift(action.payload);
      state.totalCount += 1;
    },
    createAnalysisFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get analysis
    getAnalysisStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getAnalysisSuccess: (state, action: PayloadAction<Analysis>) => {
      state.isLoading = false;
      state.currentAnalysis = action.payload as AnalysisDetail;
    },
    getAnalysisFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get analyses list
    getAnalysesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getAnalysesSuccess: (state, action: PayloadAction<{ analyses: Analysis[]; total: number }>) => {
      state.isLoading = false;
      state.analyses = action.payload.analyses;
      state.totalCount = action.payload.total;
    },
    getAnalysesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete analysis
    deleteAnalysisStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAnalysisSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.analyses = state.analyses.filter((a) => a.id !== action.payload);
      if (state.currentAnalysis?.id === action.payload) {
        state.currentAnalysis = null;
      }
      state.totalCount -= 1;
    },
    deleteAnalysisFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear current analysis
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  createAnalysisStart,
  createAnalysisSuccess,
  createAnalysisFailure,
  getAnalysisStart,
  getAnalysisSuccess,
  getAnalysisFailure,
  getAnalysesStart,
  getAnalysesSuccess,
  getAnalysesFailure,
  deleteAnalysisStart,
  deleteAnalysisSuccess,
  deleteAnalysisFailure,
  clearCurrentAnalysis,
  clearError,
} = analysisSlice.actions;

export default analysisSlice.reducer;
