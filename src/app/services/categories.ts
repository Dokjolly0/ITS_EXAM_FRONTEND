// categories.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../core/models/categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private base = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  create(body: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.base, body);
  }

  update(id: string, body: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
