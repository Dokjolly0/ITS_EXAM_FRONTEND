import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Jwt {
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  hasToken() {
    return !!this.getToken();
  }

  removeToken() {
    localStorage.removeItem('authToken');
  }
}
