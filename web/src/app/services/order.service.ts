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

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: BaseService) {}

  // POST: /orderList/get
  getOrderList(payload: OrderListPayload): Observable<ApiResponse<OrderListResponse>> {
    return this.apiService.post('/orderList/get', payload);
  }

  // POST: /orderList/create
  createOrder(payload: OrderCreatePayload): Observable<ApiResponse<OrderCreateResponse>> {
    return this.apiService.post('/orderList/create', payload);
  }

  getById(payload: any): Observable<ApiResponse<OrderResponse>> {
    return this.apiService.post('/orderList/byId', payload);
  }

  update(payload: any): Observable<ApiResponse<any>> {
    return this.apiService.post('/orderList/update', payload);
  }
}
