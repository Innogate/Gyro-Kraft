


// order.service.ts

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiResponse } from './interface/apiResponce';
import { 
  OrderListPayload, 
  OrderListResponse, 
  OrderCreatePayload, 
  OrderCreateResponse,
  OrderResponse 
} from './interface/order';

import { CutterName } from './interface/cutter-name';
@Injectable({
  providedIn: 'root'
})
export class CutterNameService {
  constructor(private apiService: BaseService) {}

  // gate all data
  gateAllCutter(): Observable<ApiResponse<CutterName>> {
    return this.apiService.get('/master/cutterName');
  }

  createCutter(payload: CutterName): Observable<ApiResponse<CutterName>> {
    return this.apiService.post('/master/cutterName/add', payload);
  }

  updateCutter(payload: CutterName): Observable<ApiResponse<CutterName>> {
    return this.apiService.post('/master/cutterName/update', payload);
  }

  deleteCutter(payload: CutterName): Observable<ApiResponse<CutterName>> {
    return this.apiService.post(`/master/cutterName/delete`, payload);
  }

  getJobberByType(payload: any): Observable<ApiResponse<any>> {
    return this.apiService.post(`/master/jobberType`, payload);
  }

}
