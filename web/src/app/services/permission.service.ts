import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiResponse } from './interface/apiResponce';
import { deletePermission, getModuleListResponse, getPermissionByUserId, permissionCreate, permissions, updatePermission } from './interface/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private apiService: BaseService) { }

  get(): Observable<ApiResponse<permissions[]>> {
    return this.apiService.get('/users/permission');
  }

  getById(payload: getPermissionByUserId): Observable<ApiResponse<permissions[]>> {
    return this.apiService.post('/users/permission/byUserId', payload);
  }

  create(payload: permissionCreate): Observable<ApiResponse<any>> {
    return this.apiService.post('/users/permission/create', payload);
  }

  delete(payload: deletePermission): Observable<ApiResponse<any>> {
    return this.apiService.post('/users/permission/delete', payload);
  }


  getModuleList(): Observable<ApiResponse<getModuleListResponse>> {
    return this.apiService.get('/users/permission/moduleList');
  }



  updatePermission(payload: updatePermission[]): Observable<ApiResponse<any>> {
    return this.apiService.post('/users/permission/update', payload);
  }
}
