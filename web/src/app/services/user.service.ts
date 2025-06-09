import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { allUsers, allUsersResponse, disableEnableUser, loginOTPVerify, loginOTPVerifyResponse, searchUser, searchUserResponse, updateUser, userCreate, userCreateResponse, userLogin, userLoginResponse } from './interface/user';
import { ApiResponse } from './interface/apiResponce';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: BaseService) { }

  userLogin(payload: userLogin): Observable<ApiResponse<userLoginResponse>> {
    return this.apiService.post('/users/login', payload);
  }

  loginOTPVerify(payload: loginOTPVerify): Observable<ApiResponse<loginOTPVerifyResponse>> {
    return this.apiService.post('/users/login/otp_verify', payload);
  }

  createUser(payload: userCreate): Observable<ApiResponse<userCreateResponse>> {
    return this.apiService.post('/master/users/create', payload);
  }

  getAllUsers(payload: allUsers): Observable<ApiResponse<allUsersResponse>> {
    return this.apiService.post('/master/users', payload);
  }

  disableUser(payload: disableEnableUser): Observable<ApiResponse<any>> {
    return this.apiService.post('/master/users/disable', payload);
  }

  enableUser(payload: disableEnableUser): Observable<ApiResponse<any>> {
    return this.apiService.post('/master/users/enable', payload);
  }

  updateUser(payload: updateUser): Observable<ApiResponse<userCreateResponse>> {
    return this.apiService.post('/master/users/update', payload);
  }

  searchUser(payload: searchUser): Observable<ApiResponse<searchUserResponse>> {
    return this.apiService.post('/master/users/search', payload);
  }
}
