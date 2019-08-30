import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private user: User;

  constructor(
    private httpClient: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('token') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = new User();
  }


  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public login(username, password) {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/signin', { username, password })
      .pipe(map(userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        let tokenStr = 'Bearer ' + userToken;
        sessionStorage.setItem('token', tokenStr);
        this.currentUserSubject.next(userToken);
        return userToken;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  authenticate(username, password) {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/signin', { username, password }).pipe(
      map(
        userData => {
          sessionStorage.setItem('username', username);
          let tokenStr = 'Bearer ' + userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
        }
      )
    );
  }
  isUserLoggedIn() {
    let user = sessionStorage.getItem('username')
    //console.log(!(user === null))
    return !(user === null)
  }
  logOut() {
    sessionStorage.removeItem('username')
  }
}
