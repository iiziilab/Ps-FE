import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';
import { Subject } from 'rxjs';    


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  profileImageUpdate$ = new Subject<string>();
  Id$ = new Subject<string>();
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(UserName: string, Password: string) {
      return this.http.post<any>(`${environment.apiUrl}/Users/authentication`, { UserName, Password })
          .pipe(map(user => {
            console.log(user)
            // localStorage.removeItem('currentUser');
            // this.currentUserSubject.next(null);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(user.statusCode == 200){
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            }
      }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
