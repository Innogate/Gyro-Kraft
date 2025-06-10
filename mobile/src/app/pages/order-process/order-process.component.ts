import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { StepperModule } from 'primeng/stepper';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DynamicTableComponent } from '../component/dynamic-table/dynamic-table.component';
import { CalendarModule } from 'primeng/calendar';
import { CutterNameService } from '../../services/cutterName.service';
import { firstValueFrom } from 'rxjs';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { OrderProcessService } from '../../services/orderProcess.service';

@Component({
  selector: 'app-order-process',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    StepperModule,
    DynamicTableComponent,
    CalendarModule
  ],
  providers: [DialogService],
  templateUrl: './order-process.component.html',
  styleUrl: './order-process.component.scss'
})
export class OrderProcessComponent {
  constructor(private dialogService: DialogService, private fb: FormBuilder,
    private jobber: CutterNameService, private sweetAlertService: SweetAlertService, private orderProcessService: OrderProcessService) { }
  cuttingForm!: FormGroup;
  errorMessage: string = '';

  showForm = false;
  CutterName: any[] = [];
  showPoQty: boolean = false;
  tableDatapoqt: any[] = [];
  tableData: any[] = [];
  orderID?: number;
  ngOnInit() {
    this.orderID = Number(localStorage.getItem('orderId'));
    this.cuttingForm = this.fb.group({
      order_id: [this.orderID, Validators.required],
      date: ['', Validators.required],
      cutter_id: ['', Validators.required],
      po_qty_id: ['', Validators.required],
      lot_no: ['',],
      total_qty: ['', Validators.required],
    });
    this.orderID = Number(localStorage.getItem('orderId'));
    this.gateJobberByType();
    this.gateCuttingStepsByOrderId();
  }
  tableColumns = [
    { field: 'id', header: 'ID' },
    { field: 'date', header: 'Date' },
    { field: 'lot_no', header: 'Lot No' },
    { field: 'name', header: 'Cutter Name' },
    { field: 'po_qty_id', header: 'PO Qty ID' },
    { field: 'total_qty', header: 'Total Qty' },
  ];

  tableColumnsPoqt = [
    { field: 'id', header: 'Id' },
    { field: 'fabric_quality', header: 'Fabric' },
    { field: 'supplier', header: 'Item' },
    { field: 'pro_color', header: 'Color' },
    { field: 'combo', header: 'Combo' },
    { field: 'size', header: 'Size' },
    { field: 'qty', header: 'Qty' }
  ];


  toggleForm() {
    this.showForm = !this.showForm;
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'Edit') {
      console.log('Editing row:', event.row);
    } else if (event.action === 'Delete') {
      console.log('Deleting row:', event.row);
    }
  }

  handleRowClick(row: any) {
    console.log('Row clicked:', row);
    this.cuttingForm.patchValue({
      po_qty_id: row.id || '',
      total_qty: row.qty || '',
    });
    this.showPoQty = !this.showPoQty;
  }


  async gateJobberByType() {
    const res = await firstValueFrom(this.jobber.getJobberByType({ jobber_type: 'Cutter' }));
    if (res.status === 200) {
      this.CutterName = res.body;
    }
  }

  async gateAllpoQtyByOrderId() {
    this.showPoQty = true;
    if (!this.orderID) {
      this.sweetAlertService.errorAlert('Error', 'Order ID not found in local storage.');
      return;
    }
    try {
      const response = await firstValueFrom(this.orderProcessService.gateAllpoQtyByOrderId({ order_id: this.orderID }));
      if (response.status === 200) {
        this.tableDatapoqt = response.body;
      } else {
        this.sweetAlertService.errorAlert('Error', 'No PO quantity found for the given order ID.');
      }
    } catch (error) {
      console.error('Error fetching PO quantity:', error);
      this.sweetAlertService.errorAlert('Error', 'Failed to fetch PO quantity. Please try again later.');
    }
  }

  async gateCuttingStepsByOrderId() {
    if (!this.orderID) {
      this.sweetAlertService.errorAlert('Error', 'Order ID not found in local storage.');
      return;
    }
    try {
      const response = await firstValueFrom(this.orderProcessService.gateCuttingStepsByOrderId({ order_id: this.orderID }));
      if (response.status === 200) {
        this.tableData = response.body;
      } else {
        this.sweetAlertService.errorAlert('Error', 'No cutting steps found for the given order ID.');
      }
    } catch (error) {
      // console.error('Error fetching cutting steps:', error);
      // this.sweetAlertService.errorAlert('Error', 'Failed to fetch cutting steps. Please try again later.');
    }
  }

  async submitCuttingForm() {
    const rawDate: Date = this.cuttingForm.value.date;
    const formattedDate = rawDate.toISOString().split('T')[0];
    this.cuttingForm.patchValue({ date: formattedDate });
    if (this.cuttingForm.invalid) {
      this.sweetAlertService.errorAlert('Error', 'Please fill in all required fields.');
      return;
    }
    const formData = this.cuttingForm.value;
    try {
      const response = await firstValueFrom(this.orderProcessService.addCuttingStep(formData));
      if (response.status === 200) {
        this.sweetAlertService.successAlert('Success', 'Cutting form submitted successfully.');
        this.cuttingForm.reset({
          order_id: this.orderID,
          // date: '',
          // cutter_id: '',
          po_qty_id: '',
          // lot_no: '',
          total_qty: ''
        });
        this.gateCuttingStepsByOrderId();
        this.showPoQty = false;
      } else {
        this.sweetAlertService.errorAlert('Error', 'Failed to submit cutting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting cutting form:', error);
      this.sweetAlertService.errorAlert('Error', 'An error occurred while submitting the form. Please try again later.');
    }
  }
}

