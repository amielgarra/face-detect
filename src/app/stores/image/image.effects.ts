import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ImageService } from '../../services/image.service';
import * as ImageActions from './image.actions';

@Injectable()
export class ImageEffects {
  constructor(private actions$: Actions, private imageService: ImageService) {}

  detectFaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.uploadImage),
      mergeMap((action: ReturnType<typeof ImageActions.uploadImage>) =>
        this.imageService.detectFaces(action.base64Image).pipe(
          map((response: any) => {
            if (response.results.length === 0) {
              return ImageActions.detectFacesFailure({
                error: 'No Faces Found! 👀',
              });
            }

            return ImageActions.detectFacesSuccess({
              results: response.results,
              image: action.base64Image,
              multipleFaces: response.results.length > 2,
            });
          }),
          catchError((error) => {
            let errorMsg =
              'Oops! Something Went Wrong! We got the following error: ';
            if (error.status === 400) {
              errorMsg += 'Invalid request';
            } else if (error.status === 500) {
              errorMsg += 'Server error';
            }
            return of(ImageActions.detectFacesFailure({ error: errorMsg }));
          })
        )
      )
    )
  );
}
