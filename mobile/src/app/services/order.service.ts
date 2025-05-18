import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiResponse } from './interface/apiResponce';
import { OrderListPayload, OrderListResponse, OrderCreatePayload, OrderCreateResponse } from './interface/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: BaseService) {}

  getOrderList(payload: OrderListPayload): Observable<ApiResponse<OrderListResponse>> {
    return this.apiService.post('/orderList/get', payload);
  }

  createOrder(payload: OrderCreatePayload): Observable<ApiResponse<OrderCreateResponse>> {
    return this.apiService.post('/orderList/create', payload);
  }
}
