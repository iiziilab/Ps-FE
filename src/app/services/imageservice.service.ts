import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject,Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageserviceService {

  private imageSubject: BehaviorSubject<string>;
  public currentimage: Observable<string>;

  constructor(private http:HttpClient) {
    this.imageSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentUserImage')));
    this.currentimage = this.imageSubject.asObservable();
   }

   changeImage(Image: string) {
    localStorage.setItem('currentUserImage', JSON.stringify(Image));
     this.imageSubject.next(Image);
     return Image;
   }
}
