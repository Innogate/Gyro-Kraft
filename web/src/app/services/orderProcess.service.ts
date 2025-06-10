import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { ApiResponse } from "./interface/apiResponce";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrderProcessService {
    constructor(private apiService: BaseService) { }

    gateAllpoQtyByOrderId(payload: any): Observable<ApiResponse<any>> {
        return this.apiService.post('/order/poqtByorderId', payload)
    }

    addCuttingStep(payload: any): Observable<ApiResponse<any>> {
        return this.apiService.post('/cuttingSteps/add', payload);
    }

    gateCuttingStepsByOrderId(payload: any): Observable<ApiResponse<any>> {
        return this.apiService.post('/cuttingSteps/gateAllByorderId', payload);
    }

}