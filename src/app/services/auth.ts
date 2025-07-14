import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { Injectable, NgZone, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Jwt } from './jwt';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { environment } from '../environments/environment';

export interface UserRegistration {
  // Unique ID
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  picture?: string;
  birthDate?: Date | string | undefined;
  gender?: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl;
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  private http = inject(HttpClient);
  private jwt = inject(Jwt);
  private router = inject(Router);
  constructor() {
    this.fetchUser();
  }

  isLoggedIn() {
    return this.jwt.hasToken();
  }

  login(username: string, password: string) {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => this.jwt.setToken(res.token)),
        tap((res) => this._currentUser$.next(res.user)),
        map((res) => res.user)
      );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    this.jwt.removeToken();
    this._currentUser$.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  fetchUser(): Promise<User | null> {
    return firstValueFrom(
      this.http.get<User>(`${this.apiUrl}/users/me`).pipe(
        tap((user) => this._currentUser$.next(user)),
        map((user) => user)
      )
    ).catch((_err) => {
      this._currentUser$.next(null);
      return null;
    });
  }
}
