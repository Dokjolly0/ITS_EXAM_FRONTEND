import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

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

  fetchUser() {
    this.http
      .get(`${environment.apiUrl}/users/me`)
      .subscribe((user) => this.user$.next(user));
  }
}
