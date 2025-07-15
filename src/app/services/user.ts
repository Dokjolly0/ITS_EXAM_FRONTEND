import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User as UserModel } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class User {
  private user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.fetchUser();
  }

  getCurrentUser() {
    return this.user$.asObservable();
  }

  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/users/users`);
  }

  fetchUser() {
    this.http
      .get(`${environment.apiUrl}/users/me`)
      .subscribe((user) => this.user$.next(user));
  }
}
