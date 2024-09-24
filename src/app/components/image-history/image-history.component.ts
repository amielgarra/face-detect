import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetectedImage } from '../../models/detected-image.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-history.component.html',
  styleUrl: './image-history.component.scss',
})
export class ImageHistoryComponent {
  @Input() uploadedImages: DetectedImage[] = [];
  @Output() imageSelected = new EventEmitter<DetectedImage>();

  onImageClick(image: DetectedImage) {
    this.imageSelected.emit(image);
  }
}
