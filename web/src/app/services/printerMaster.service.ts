import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiResponse } from './interface/apiResponce';

import { PrintersMaster } from './interface/printerMaster';
@Injectable({
  providedIn: 'root'
})
export class PrintersMasterService {
  constructor(private apiService: BaseService) {}

  // gate all data
  gateAllPrinters(): Observable<ApiResponse<PrintersMaster>> {
    return this.apiService.get('/master/printers');
  }

  createPrinters(payload: PrintersMaster): Observable<ApiResponse<PrintersMaster>> {
    return this.apiService.post('/master/printers/add', payload);
  }

  updatePrinters(payload: PrintersMaster): Observable<ApiResponse<PrintersMaster>> {
    return this.apiService.post('/master/printers/update', payload);
  }

  deletePrinters(payload: PrintersMaster): Observable<ApiResponse<PrintersMaster>> {
    return this.apiService.post(`/master/printers/delete`, payload);
  }

}
