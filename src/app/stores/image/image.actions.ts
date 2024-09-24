import { createAction, props } from '@ngrx/store';
import { DetectedImage } from '../../models/detected-image.model';

export const uploadImage = createAction(
  '[Image] Upload Image',
  props<{ base64Image: string }>()
);

export const detectFacesSuccess = createAction(
  '[Image] Detect Faces Success',
  props<{ results: any; image: string; multipleFaces: boolean }>()
);

export const detectFacesFailure = createAction(
  '[Image] Detect Faces Failure',
  props<{ error: string }>()
);

export const clearError = createAction('[Image] Clear Error');

export const clearCurrentImage = createAction('[Image] Clear Current Image');

export const setSelectedImage = createAction(
  '[Image] Set Selected Image',
  props<{ selectedImage: DetectedImage }>()
);

export const addToHistory = createAction(
  '[Image] Add to History',
  props<{ detectedImage: DetectedImage }>()
);
