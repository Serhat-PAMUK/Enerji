import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Enerji verilerini API'den çekme
export const fetchEnergyData = createAsyncThunk(
  'energy/fetchEnergyData',
  async (energyType) => {
    try {
      const response = await axios.get(`http://localhost:8080/energy/api/${energyType}`);
      return response.data;
    } catch (error) {
      console.error('Hata:', error);
      throw Error('Veri çekilemedi');
    }
  }
);

const energySlice = createSlice({
  name: 'energy',
  initialState: {
    energyData: null,
    selectedEnergyType: 'gunes',
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedEnergyType: (state, action) => {
      state.selectedEnergyType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnergyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnergyData.fulfilled, (state, action) => {
        state.loading = false;
        state.energyData = action.payload;
      })
      .addCase(fetchEnergyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedEnergyType } = energySlice.actions;
export default energySlice.reducer; 