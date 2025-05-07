import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Helper function to set up headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Generic GET request
  get<T>(url: string, params: any = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url}`, { headers: this.getHeaders(), params });
  }

  // Generic POST request
  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, data, { headers: this.getHeaders() });
  }

  // Generic DELETE request
  delete<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, data, { headers: this.getHeaders() });
  }
}
