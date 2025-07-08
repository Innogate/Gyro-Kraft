import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-cutting-page',
  imports: [
    ReactiveFormsModule,
        CommonModule,
        DialogModule,
        DropdownModule,
        FileUploadModule,
        InputTextModule,
        CalendarModule,
        ButtonModule,
        TableModule,
        InputNumberModule,
        TextareaModule,
  ],
  templateUrl: './cutting-page.component.html',
  styleUrl: './cutting-page.component.scss'
})

export class CuttingPageComponent {
    ordersList?: any;

    constructor(
        private fb: FormBuilder,
        private service: OrderService,
        private alert: SweetAlertService,
        private router: Router
    ) {
        this.fetchOrderList()
    }
    async fetchOrderList() {
            await firstValueFrom(this.service.getOrderList({
                page: 0,
                pageSize: 12,
                search: ''

            }).pipe(
                tap(
                    (response) => {
                        if (response.status == 200) {
                            this.ordersList = response.body.orders;
                        }
                    },
                    (error) => {
                        this.alert.errorAlert(error.error.message, error.error.body);
                    }
                )
            ));

    }

    async onEdit(order: any) {
        console.log(order);
    }

    onDelete(order: any) {
        // TODO: Add confirmation and call delete API
        console.log('Delete:', order);
    }
}
