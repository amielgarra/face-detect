import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImageState } from './image.reducer';

export const selectImageState = createFeatureSelector<ImageState>('image');

export const selectCurrentImageResult = createSelector(
  selectImageState,
  (state) => state.currentImage
);

export const selectLoading = createSelector(
  selectImageState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectImageState,
  (state) => state.error
);

export const selectImageHistory = createSelector(
  selectImageState,
  (state) => state.history
);
