import { createFeature, createReducer, on } from '@ngrx/store';
import * as ImageActions from './image.actions';
import { DetectedImage } from '../../models/detected-image.model';

export interface ImageState {
  uploadedImage: string | null;
  currentImage: DetectedImage | null;
  loading: boolean;
  error: string | null;
  history: DetectedImage[];
}

export const initialState: ImageState = {
  uploadedImage: null,
  currentImage: null,
  loading: false,
  error: null,
  history: [],
};

export const imageReducer = createReducer(
  initialState,
  on(ImageActions.uploadImage, (state, { base64Image }) => ({
    ...state,
    loading: true,
    uploadedImage: base64Image,
    error: null,
  })),
  on(
    ImageActions.detectFacesSuccess,
    (state, { results, image, multipleFaces }) => ({
      ...state,
      loading: false,
      uploadedImage: image,
      currentImage: { base64: image, results, multipleFaces },
      history: [...state.history, { base64: image, results, multipleFaces }],
      error: null,
    })
  ),
  on(ImageActions.detectFacesFailure, (state, { error }) => ({
    ...state,
    currentImage: null,
    loading: false,
    error,
  })),
  on(ImageActions.setError, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ImageActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
  on(ImageActions.clearCurrentImage, (state) => ({
    ...state,
    currentImage: null,
  })),
  on(ImageActions.setSelectedImage, (state, { selectedImage }) => ({
    ...state,
    currentImage: selectedImage,
  })),
  on(ImageActions.addToHistory, (state, { detectedImage }) => ({
    ...state,
    history: [...state.history, detectedImage],
  }))
);

export const imageFeature = createFeature({
  name: 'image',
  reducer: imageReducer,
});
