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
import { DynamicTableComponent } from '../../components/dynamic-table/dynamic-table.component';

interface POData {
    id: number;
    po_no: string;
    qty: number;
}

@Component({
    selector: 'app-print-page',
    imports: [
        DropdownModule,
        TextareaModule,
        InputNumberModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        FileUploadModule,
        DialogModule,
        TableModule,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './print-page.component.html',
    styleUrl: './print-page.component.scss'
})
export class PrintPageComponent implements OnInit {
    ordersList: any[] = [];
    selectedOrder: any | null = null;

    showForm = false;
    showPoDialog = false;
    hedding = 'Add Printing Step';

    printingForm!: FormGroup;

    CutterName = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Ali Khan' }
    ];

    poData: POData[] = [];
    tableData: any[] = [];
    tableDataReceive: any[] = [];

    tableColumns: any[] = [];
    tableColumnsPoqt: any[] = [];
    tableColumnsReceive: any[] = [];

    displayCuttingPopup: boolean = false;
    sweetAlertService: any;
    receiveForm: any;
    orderID: any;
    ReceiveHedding: string | undefined;
    ReceiveShowForm: boolean | undefined;

    pageSize = 10;
    totalRecords = 0;

    constructor(
        private fb: FormBuilder,
        private service: CutterNameService,
        private alert: SweetAlertService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initForm();
        // this.fetchOrderList();
        // this.fetchCutterList();

        // 🧠 Load saved table data from localStorage
        const savedData = localStorage.getItem('cuttingTableData');
        this.tableData = savedData ? JSON.parse(savedData) : [];
        this.totalRecords = this.tableData.length;
    }

    onNextStep() {
        // Handle next step here
        this.displayCuttingPopup = false;
    }

    handleAction(action: string, row: any) {
        console.log('Action:', action, 'Row:', row);
    }

    prevPage() {
        // implement logic to fetch or paginate previous records
    }

    nextPage() {
        // implement logic to fetch or paginate next records
    }

    deleteCuttingStep(id: any) {
        throw new Error('Method not implemented.');
    }

    initForm() {
        this.printingForm = this.fb.group({
            issue_date: [null, Validators.required],
            delivery_date: [null],
            cutter_id: [null, Validators.required],
            lot_no: [''],
            po_qty_id: [null, Validators.required],
            total_qty: [null]
        });
    }

    submitCuttingForm(action: 'Add' | 'Update') {
        if (this.printingForm.invalid) {
            this.printingForm.markAllAsTouched();
            return;
        }

        const formData = this.printingForm.value;
        console.log('Submitted Data:', formData);

        if (action === 'Add') {
            // 🔁 Step 1: Load existing data from localStorage
            const existingData = localStorage.getItem('cuttingTableData');
            const tableData = existingData ? JSON.parse(existingData) : [];

            // 🔁 Step 2: Create new row
            const newRow = {
                id: tableData.length + 1,
                cutterName: this.getCutterNameById(formData.cutter_id),
                issueDate: this.formatDate(formData.issue_date),
                deliveryDate: this.formatDate(formData.delivery_date),
                lotNo: formData.lot_no,
                poQtyId: formData.po_qty_id,
                totalQty: formData.total_qty
            };

            // 🔁 Step 3: Add new row and re-save everything
            tableData.push(newRow);
            localStorage.setItem('cuttingTableData', JSON.stringify(tableData));

            // 🔁 Step 4: Reflect in the component
            this.tableData = tableData;
            this.totalRecords = this.tableData.length;
        }

        // ✅ Reset & close form
        this.printingForm.reset();
        this.showForm = false;
    }

    getCutterNameById(id: number): string {
        const cutter = this.CutterName.find((c: any) => c.id === id);
        return cutter ? cutter.name : '';
    }

    formatDate(date: Date): string {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
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
        await firstValueFrom(
            this.service
                .getOrderList({
                    page: 0,
                    pageSize: 12,
                    search: ''
                })
                .pipe(
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
                )
        );
    }

    onEdit(order: any) {
        this.selectedOrder = order;
        this.hedding = 'Edit Cutting Step';
        this.showForm = true;

        this.printingForm.patchValue({
            issue_date: new Date(), // replace with order.issue_date if available
            delivery_date: new Date(),
            cutter_id: null,
            lot_no: '',
            po_qty_id: null,
            total_qty: null
        });
    }

    onDelete(order: any) {
        console.log('Delete:', order);
    }

    gateAllpoQty() {
        // Ideally fetch from API using selectedOrder.id
        this.poData = [
            { id: 1, po_no: 'PO001', qty: 100 },
            { id: 2, po_no: 'PO002', qty: 150 }
        ];
        this.showPoDialog = true;
    }

    selectPO(po: POData) {
        this.printingForm.patchValue({ po_qty_id: po.po_no });
        this.showPoDialog = false;
    }

    toggleForm() {
        this.hedding = 'Add Cutting Step';
        this.printingForm.reset();
        this.showForm = true;
    }

    showAllPoQty() {
        // Optional section, if you want to show another block of PO data
        this.poData = [
            { id: 1, po_no: 'PO001', qty: 100 },
            { id: 2, po_no: 'PO002', qty: 150 }
        ];
    }
}
