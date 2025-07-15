// requests.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Request } from '../core/models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private base = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.base}`);
  }

  getRequest(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.base}/${id}`);
  }

  createRequest(body: Partial<Request>): Observable<Request> {
    return this.http.post<Request>(`${this.base}`, body);
  }

  updateRequest(id: string, body: Partial<Request>): Observable<Request> {
    return this.http.put<Request>(`${this.base}/${id}`, body);
  }

  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getToApprove(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.base}/to-approve`);
  }

  approve(id: string): Observable<Request> {
    return this.http.post<Request>(`${this.base}/${id}/approve`, {});
  }

  reject(id: string): Observable<Request> {
    return this.http.post<Request>(`${this.base}/${id}/reject`, {});
  }

  getStats(month?: string, categoryId?: string): Observable<any[]> {
    const params: any = {};
    if (month) params.month = month;
    if (categoryId) params.categoryId = categoryId;
    return this.http.get<any[]>(
      `${this.base.replace('/requests', '/stats/approved-requests')}`,
      { params }
    );
  }
}
