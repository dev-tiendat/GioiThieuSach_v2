import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ShowScreensState {
  isShowOnboardingScreen: boolean;
}

const initialState: ShowScreensState = {
  isShowOnboardingScreen: true,
};

const showScreensSlice = createSlice({
  name: 'showScreens',
  initialState: initialState,
  reducers: {
    changeIsShowOnboardingScreen: (state, action: PayloadAction<boolean>) => {
      state.isShowOnboardingScreen = action.payload;
    },
  },
});

export const { changeIsShowOnboardingScreen } = showScreensSlice.actions;

export const selectShowScreen = (state: RootState) =>
  state.showScreens.isShowOnboardingScreen;

export default showScreensSlice.reducer;
