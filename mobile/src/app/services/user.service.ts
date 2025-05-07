import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: BaseService) { }

  getAllUsers(payload: any): Observable<any> {
    return this.apiService.post('/login', payload);
  }
}
