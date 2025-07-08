import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
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
import { CutterNameService } from '../../services/cutterName.service';


interface POData {
  id: number;
  po_no: string;
  qty: number;
}


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

export class CuttingPageComponent implements OnInit {
  ordersList: any[] = [];
  selectedOrder: any | null = null;

  showForm = false;
  showPoDialog = false;
  hedding = 'Add Cutting Step';

  cuttingForm!: FormGroup;

  CutterName: { id: number; name: string }[] = [];

  poData: POData[] = [];
  tableData: any[] = [];
  tableDataReceive: any[] = [];

  tableColumns: any[] = [];
  tableColumnsPoqt: any[] = [];
  tableColumnsReceive: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: CutterNameService,
    private alert: SweetAlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchOrderList();
    this.fetchCutterList();
  }

  initForm() {
    this.cuttingForm = this.fb.group({
      issue_date: [null, Validators.required],
      delivery_date: [null],
      cutter_id: [null, Validators.required],
      lot_no: [''],
      po_qty_id: [null, Validators.required],
      total_qty: [null],
    });
  }

  async fetchOrderList() {
    try {
      const response = await firstValueFrom(
        this.service.getOrderList({ page: 0, pageSize: 12, search: '' }).pipe(
          tap(
            (res) => {
              if (res.status === 200) {
                this.ordersList = res.body.orders;
              }
            },
            (err) => {
              this.alert.errorAlert(err.error.message, err.error.body);
            }
          )
        )
      );
    } catch (error) {
      console.error('Order list fetch failed', error);
    }
  }

  async fetchCutterList() {
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

  onEdit(order: any) {
    this.selectedOrder = order;
    this.hedding = 'Edit Cutting Step';
    this.showForm = true;

    this.cuttingForm.patchValue({
      issue_date: new Date(), // replace with order.issue_date if available
      delivery_date: new Date(),
      cutter_id: null,
      lot_no: '',
      po_qty_id: null,
      total_qty: null,
    });

    // Load cutting data related to the order
    this.tableData = [];
    this.tableDataReceive = [];
  }

  onDelete(order: any) {
    console.log('Delete:', order);
  }

  gateAllpoQty() {
    // Ideally fetch from API using selectedOrder.id
    this.poData = [
      { id: 1, po_no: 'PO001', qty: 100 },
      { id: 2, po_no: 'PO002', qty: 150 },
    ];
    this.showPoDialog = true;
  }

  selectPO(po: POData) {
    this.cuttingForm.patchValue({ po_qty_id: po.po_no });
    this.showPoDialog = false;
  }

  toggleForm() {
    this.hedding = 'Add Cutting Step';
    this.cuttingForm.reset();
    this.showForm = true;
  }

  submitCuttingForm(type: 'Add' | 'Update') {
    if (this.cuttingForm.invalid) {
      this.alert.errorAlert('Form Incomplete', 'Please fill required fields');
      return;
    }

    const payload = this.cuttingForm.value;
    payload.order_id = this.selectedOrder?.id;

    if (type === 'Add') {
      // POST logic here
      console.log('Add Cutting Step', payload);
    } else {
      // PUT/PATCH logic here
      console.log('Update Cutting Step', payload);
    }

    this.showForm = false;
  }

  showAllPoQty() {
    // Optional section, if you want to show another block of PO data
    this.poData = [
      { id: 1, po_no: 'PO001', qty: 100 },
      { id: 2, po_no: 'PO002', qty: 150 },
    ];
  }
}
