import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ImageActions from '../stores/image/image.actions';
import * as fromImage from '../stores/image/image.selectors';
import { DetectedImage } from '../models/detected-image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageFacadeService {
  constructor(private store: Store) {}

  currentResult$: Observable<DetectedImage | null> = this.store.pipe(
    select(fromImage.selectCurrentImageResult)
  );

  error$: Observable<string | null> = this.store.pipe(
    select(fromImage.selectError)
  );

  history$: Observable<any[]> = this.store.pipe(
    select(fromImage.selectImageHistory)
  );

  loading$: Observable<boolean> = this.store.pipe(
    select(fromImage.selectLoading)
  );

  uploadImage(base64Image: string): void {
    this.store.dispatch(ImageActions.uploadImage({ base64Image }));
  }

  clearError(): void {
    this.store.dispatch(ImageActions.clearError());
  }

  clearCurrentImage(): void {
    this.store.dispatch(ImageActions.clearCurrentImage());
  }

  setselectedImage(image: DetectedImage): void {
    this.store.dispatch(
      ImageActions.setSelectedImage({ selectedImage: image })
    );
  }
}
