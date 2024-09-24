import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  detectFaces(base64Image: string): Observable<any> {
    return this.http.post('/detect', {
      sourceUrl: base64Image,
    });
  }
}
