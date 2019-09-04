import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  private user: User;

  constructor(
    private httpClient: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem('korisnik'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = new User();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public login(username, password) {
    return this.httpClient.post<any>('http://localhost:8080/api/auth/signin', { username, password })
      .pipe(map(userData => {
        if(userData!=null){
          sessionStorage.setItem('token', JSON.stringify(userData['token']));
          let tokenStr = 'Bearer ' + userData['token'];
          sessionStorage.setItem('token', tokenStr);
          sessionStorage.setItem('id', userData['id']);
          sessionStorage.setItem('korisnik', userData['firstName']+' '+userData['lastName']);

          this.currentUserSubject.next(sessionStorage.getItem('korisnik'));
        }
        return userData;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    sessionStorage.removeItem('korisnik');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
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
    let user = sessionStorage.getItem('id')
    //console.log(!(user === null))
    return !(user === null)
  }
 
}
