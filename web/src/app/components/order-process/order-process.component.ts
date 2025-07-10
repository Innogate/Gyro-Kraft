import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { StepperModule } from 'primeng/stepper';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { CalendarModule } from 'primeng/calendar';
import { CutterNameService } from '../../services/cutterName.service';
import { firstValueFrom } from 'rxjs';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { OrderProcessService } from '../../services/orderProcess.service';
import { Header } from 'primeng/api';

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
  receiveForm!: FormGroup;
  errorMessage: string = '';
  showForm = false;
  CutterName: any[] = [];
  showPoQty: boolean = false;
  tableDatapoqt: any[] = [];
  poData: any[] = [];
  tableData: any[] = [];
  tableDataReceive: any[] = [];
  orderID?: number;
  hedding: string = '';
  ReceiveHedding: string = '';
  ReceiveShowForm: boolean = false;
  ngOnInit() {
    this.orderID = Number(localStorage.getItem('orderId'));
    this.cuttingForm = this.fb.group({
      id: [],
      order_id: [this.orderID, Validators.required],
      issue_date: ['', Validators.required],
      delivery_date: ['', Validators.required],
      cutter_id: ['', Validators.required],
      po_qty_id: ['', Validators.required],
      lot_no: ['',],
      total_qty: ['', Validators.required],
    });

    this.receiveForm = this.fb.group({
      id: [],
      order_id: [this.orderID, Validators.required],
      cutting_id: ['', Validators.required],
      received_date: [''],
      received_qty: [''],
      deffective_qty: [0],
      remark: [''],
    })

    this.orderID = Number(localStorage.getItem('orderId'));
    this.gateJobberByType();
    this.gateCuttingStepsByOrderId();
    this.gateAllpoQtyByOrderId();
  }


  tableColumns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Cutter Name' },
    { field: 'issue_date', header: 'Issue Date' },
    { field: 'delivery_date', header: 'Delivery Date' },
    { field: 'lot_no', header: 'Lot No' },

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

  tableColumnsReceive = [
    { field: 'cutter_name', header: 'Cutter Name' },
    { field: 'issue_date', header: 'Issue Date' },
    { field: 'delivery_date', header: 'Delivery Date' },
     { field: 'received_date', header: 'Received Date' },
    { field: 'lot_no', header: 'Lot No' },
        { field: 'total_qty', header: 'Total Qty' },
    { field: 'received_qty', header: 'Received Qty' },
    { field: 'deffective_qty', header: 'Deffective Qty' },
    { field: 'remark', header: 'Remark' },
  ]



  toggleForm() {
    this.cuttingForm.reset({
      order_id: this.orderID,
    });
    this.hedding = 'Add Cutting Step';
    this.showForm = !this.showForm;
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'Edit') {
      this.hedding = 'Edit Cutting Step';
      this.cuttingForm.patchValue({
        id: event.row.id,
        order_id: event.row.order_id,
        issue_date: event.row.issue_date,
        delivery_date: event.row.delivery_date,
        cutter_id: event.row.cutter_id,
        po_qty_id: event.row.po_qty_id,
        lot_no: event.row.lot_no,
        total_qty: event.row.total_qty
      });
      this.showForm = !this.showForm;
    } else if (event.action === 'Delete') {
      this.sweetAlertService.confirmAlert('worning', 'Are you sure you want to delete this row?')
        .then((result) => {
          if (result.isConfirmed) {
            this.deleteCuttingStep(event.row.id);
          }
        });
      console.log('Deleting row:', event.row);
    } else if (event.action === 'Receive') {
      this.receiveForm.reset({
        order_id: this.orderID,
      });
      this.ReceiveHedding = 'Receive Cutting';
      this.ReceiveShowForm = !this.ReceiveShowForm;
      this.receiveForm.patchValue({
        cutting_id: event.row.id,
        order_id: event.row.order_id,
      });    }
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
  async gateAllpoQty() {
    this.showPoQty = true;
    const response = await this.gateAllpoQtyByOrderId();
    if (response) {
      this.tableDatapoqt = response;
    }
  }

  async showAllPoQty() {
    const response = await this.gateAllpoQtyByOrderId();
    if (response) {
      this.poData = response;
    }
  }



  async gateAllpoQtyByOrderId() {
    if (!this.orderID) {
      this.sweetAlertService.errorAlert('Error', 'Order ID not found in local storage.');
      return;
    }
    try {
      const response = await firstValueFrom(this.orderProcessService.gateAllpoQtyByOrderId({ order_id: this.orderID }));
      if (response.status === 200) {
        return response.body;
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

  formatDateWithCondition(inputDateStr: string): string {
    // Check if input is in dd-mm-yyyy format
    const ddMMyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const yyyyMMddPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

    let day: string, month: string, year: string;

    // Handle dd-mm-yyyy format
    if (ddMMyyyyPattern.test(inputDateStr)) {
      const [inputDay, inputMonth, inputYear] = inputDateStr.split('-');
      const date = new Date(Number(inputYear), Number(inputMonth) - 1, Number(inputDay));

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', inputDateStr);
        return '';
      }

      day = String(date.getDate()).padStart(2, '0');
      month = String(date.getMonth() + 1).padStart(2, '0');
      year = String(date.getFullYear());
    }
    // Handle yyyy-mm-dd format
    else if (yyyyMMddPattern.test(inputDateStr)) {
      const [inputYear, inputMonth, inputDay] = inputDateStr.split('-');
      const date = new Date(Number(inputYear), Number(inputMonth) - 1, Number(inputDay));

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', inputDateStr);
        return '';
      }
      day = inputDay;
      month = inputMonth;
      year = inputYear;
    }
    // Handle other formats or invalid input
    else {
      const date = new Date(inputDateStr);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', inputDateStr);
        return ''; // or throw error
      }

      day = String(date.getDate()).padStart(2, '0');
      month = String(date.getMonth() + 1).padStart(2, '0');
      year = String(date.getFullYear());
    }

    return `${year}-${month}-${day}`;
  }

  async submitCuttingForm(type: string) {
    const formattedIssueDate = this.formatDateWithCondition(this.cuttingForm.value.issue_date);
    const formattedDeliveryDate = this.formatDateWithCondition(this.cuttingForm.value.delivery_date);


    this.cuttingForm.patchValue({ delivery_date: formattedDeliveryDate });
    this.cuttingForm.patchValue({ issue_date: formattedIssueDate });
    if (this.cuttingForm.invalid) {
      this.sweetAlertService.errorAlert('Error', 'Please fill in all required fields.');
      return;
    }
    const formData = this.cuttingForm.value;
    try {
      if (type === 'Add') {
        const response = await firstValueFrom(this.orderProcessService.addCuttingStep(formData));
        if (response.status === 200) {
          this.sweetAlertService.successAlert('Success', 'Cutting form submitted successfully.');
          this.cuttingForm.reset({
            order_id: this.orderID,
          });
          this.gateCuttingStepsByOrderId();
          this.showForm = false;
        } else {
          this.sweetAlertService.errorAlert('Error', 'Failed to submit cutting form. Please try again.');
        }
      } else if (type === 'Update') {
        const response = await firstValueFrom(this.orderProcessService.updateCuttingStep(formData));
        if (response.status === 200) {
          this.sweetAlertService.successAlert('Success', 'Cutting form updated successfully.');
          this.cuttingForm.reset({
            order_id: this.orderID,
          });
          this.gateCuttingStepsByOrderId();
          this.showForm = false;
        } else {
          this.sweetAlertService.errorAlert('Error', 'Failed to update cutting form. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting cutting form:', error);
      this.sweetAlertService.errorAlert('Error', 'An error occurred while submitting the form. Please try again later.');
    }
  }

  // delete cutting step
  async deleteCuttingStep(id: number) {
    if (!id) {
      this.sweetAlertService.errorAlert('Error', 'Cutting step ID not found.');
      return;
    }
    try {
      const response = await firstValueFrom(this.orderProcessService.deleteCuttingStep({ id }));
      if (response.status === 200) {
        this.sweetAlertService.successAlert('Success', 'Cutting step deleted successfully.');
        this.gateCuttingStepsByOrderId();
      } else {
        this.sweetAlertService.errorAlert('Error', 'Failed to delete cutting step. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting cutting step:', error);
      this.sweetAlertService.errorAlert('Error', 'An error occurred while deleting the cutting step. Please try again later.');
    }
  }

  async submitReceiveForm(type: string) {
    const formattedReceivedDate = this.formatDateWithCondition(this.receiveForm.value.received_date);
    this.receiveForm.patchValue({ received_date: formattedReceivedDate });
    console.log('Receive Form Data:', this.receiveForm.value);

    if (this.receiveForm.invalid) {
      this.sweetAlertService.errorAlert('Error', 'Please fill in all required fields.');
      return;
    }
    if (type === 'Add') {
      const formData = this.receiveForm.value;
      await firstValueFrom(this.orderProcessService.orderReceive(formData)).then((response) => {
        if (response.status === 200) {
          this.sweetAlertService.successAlert('Success', 'Receive form submitted successfully.');
          this.receiveForm.reset({
            order_id: this.orderID,
          });
          this.ReceiveShowForm = false;
        } else {
          this.sweetAlertService.errorAlert('Error', 'Failed to submit receive form. Please try again.');
        }
      }).catch((error) => {
        console.error('Error submitting receive form:', error);
        this.sweetAlertService.errorAlert('Error', 'An error occurred while submitting the receive form. Please try again later.');
      });
    }
  }

  // async gateAllOrderReceiveByOrderId() {
  //   if (!this.orderID) {
  //     this.sweetAlertService.errorAlert('Error', 'Order ID not found in local storage.');
  //     return;
  //   }
  //   try {
  //     const response = await firstValueFrom(this.orderProcessService.GateAllOrderReceiveByOrderId({ order_id: this.orderID }));
  //     if (response.status === 200) {
  //       this.tableDataReceive =  response.body;
  //     } else {
  //       this.sweetAlertService.errorAlert('Error', 'No order receive data found for the given order ID.');
  //     }
  //   } catch (error) {
  //     // console.error('Error fetching order receive data:', error);
  //     // this.sweetAlertService.errorAlert('Error', 'Failed to fetch order receive data. Please try again later.');
  //   }
  // }
}
