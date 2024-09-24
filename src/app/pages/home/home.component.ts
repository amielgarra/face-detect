import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ImageFacadeService } from '../../services/image-facade.service';
import { Observable, Subscription } from 'rxjs';
import { DetectedImage } from '../../models/detected-image.model';
import { ImageHistoryComponent } from '../../components/image-history/image-history.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImageHistoryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  uploadedImage: string | ArrayBuffer | null | undefined = null;
  detectedFaces: any[] = [];
  currentResult$: Observable<DetectedImage | null> =
    this.imageFacade.currentResult$;
  error$: Observable<string | null> = this.imageFacade.error$;
  history$: Observable<DetectedImage[]> = this.imageFacade.history$;
  loading$: Observable<boolean> = this.imageFacade.loading$;
  subscription: Subscription = new Subscription();

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageElement', { static: false })
  imageElement!: ElementRef<HTMLImageElement>;

  constructor(private imageFacade: ImageFacadeService) {}

  ngOnInit(): void {
    this.subscription = this.currentResult$.subscribe(
      (image: DetectedImage | null) => {
        if (image && image.results && image.results.length > 0) {
          this.uploadedImage = image.base64;
          this.detectedFaces = image.results;
          this.drawRectangles(image.results);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  drawRectangles(results: any[]): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      const source = new Image();
      source.src = this.uploadedImage as string;

      // Draw when loaded
      source.onload = () => {
        console.log('loaded');
        // Clear the canvas before drawing
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set the canvas dimensions to match the image
        canvas.width = source.width;
        canvas.height = source.height;

        context.drawImage(source, 0, 0);

        results.forEach((file) => {
          context.beginPath();
          context.rect(
            file.rectangle.left,
            file.rectangle.top,
            file.rectangle.right - file.rectangle.left,
            file.rectangle.bottom - file.rectangle.top
          );
          context.strokeStyle = 'white'; // Set rectangle color
          context.lineWidth = 2; // Set rectangle's line width
          context.stroke(); // Draw the rectangle

          // Age label
          const ageLabel = ` Age: ${file.age} `;
          context.font = '16px Arial';

          const ageLabelWidth = context.measureText(ageLabel).width;
          const ageLabelHeight = 18;

          context.fillStyle = 'white';
          context.fillRect(
            file.rectangle.left,
            file.rectangle.top - ageLabelHeight - 3,
            ageLabelWidth,
            ageLabelHeight
          );

          context.fillStyle = 'black';
          context.fillText(
            ageLabel,
            file.rectangle.left,
            file.rectangle.top - 5
          );

          // Gender label
          const genderLabel = ` Gender: ${
            file.gender.charAt(0).toUpperCase() + file.gender.slice(1)
          } `;

          const genderLabelWidth = context.measureText(genderLabel).width;

          context.fillStyle = 'white';
          context.fillRect(
            file.rectangle.left,
            file.rectangle.bottom + 5,
            genderLabelWidth,
            ageLabelHeight
          );

          context.fillStyle = 'black';
          context.fillText(
            genderLabel,
            file.rectangle.left,
            file.rectangle.bottom + ageLabelHeight + 2
          );
        });
      };

      this.uploadedImage = canvas.toDataURL();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target?.result;
          this.detectedFaces = [];
          this.imageFacade.clearCurrentImage();
          this.imageFacade.clearError();
        };
        reader.readAsDataURL(file);
      } else {
        this.imageFacade.setError(
          'Oops! 🤔 We need a picture! Please select an image file.'
        );
      }
    }
  }

  uploadImage(): void {
    if (typeof this.uploadedImage === 'string') {
      this.imageFacade.uploadImage(this.uploadedImage);
    }
  }

  onImageSelected(image: DetectedImage): void {
    this.imageFacade.setselectedImage(image);
    this.imageFacade.clearError();
  }
}
