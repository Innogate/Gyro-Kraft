import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { firstValueFrom, tap } from 'rxjs';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { OrderProcessService } from '../../services/orderProcess.service';
import dayjs from 'dayjs';

interface POData {
    id: number;
    po_no: string;
    qty: number;
}

interface CuttingRow {
    id: number;
    order_id: number | null;
    cutter_id: number;
    issue_date: string;
    delivery_date: string;
    lot_no: string;
    total_qty: number;
}


@Component({
    selector: 'app-cutting-page',
    standalone: true,
    imports: [
        ReactiveFormsModule, FormsModule, CommonModule, DialogModule,
        DropdownModule, FileUploadModule, InputTextModule, CalendarModule,
        ButtonModule, TableModule, InputNumberModule, TextareaModule,
        DynamicTableComponent
    ],
    templateUrl: './cutting-page.component.html',
    styleUrls: ['./cutting-page.component.scss']
})
export class CuttingPageComponent implements OnInit {
    ordersList: any[] = [];
    selectedOrder: any | null = null;

    showForm = false;
    showPoDialog = false;
    hedding = 'Add Cutting Step';
    isSaving = false;
    cutter: any = [];
    CutterName = [
        { id: 0, name: '' },];
    poData: POData[] = [];
    tableData: CuttingRow[] = [];
    tableDataReceive: any[] = [];
    tableColumns: any[] = [];
    tableColumnsPoqt: any[] = [];
    tableColumnsReceive: any[] = [];
    displayCuttingPopup = false;
    pageSize = 10;
    totalRecords = 0;
    selectProduct: any = null;
    form!: FormGroup;
    recivePopup: boolean = false;
    reciveForm!: FormGroup;
    togolData: { [key: number]: any[] } = {}; // key = index of row
    currentPage: number = 1;
    rowForm!: FormGroup;
    totalQty: number = 0;
    constructor(
        private fb: FormBuilder,
        private service: CutterNameService,
        private alert: SweetAlertService,
        private router: Router,
        private orderProcess: OrderProcessService
    ) {

        this.reciveForm = this.fb.group({
            order_id: [],
            cutting_id: [],
            received_date: [],
            received_qty: [],
            deffective_qty: [],
            remark: ['']
        })
    }

    ngOnInit(): void {
        this.fetchOrderList();
        this.fetchCutterList();
        this.getAllCutter();
        const savedData = localStorage.getItem('cuttingTableData');
        this.tableData = savedData ? JSON.parse(savedData) : [];
        this.totalRecords = this.tableData.length;
        this.form = this.fb.group({
            rows: this.fb.array([])
        });
        this.addRow();
    }

    get rows(): FormArray {
        return this.form.get('rows') as FormArray;
    }

    addRow() {
        if (!this.selectProduct) {
            return;
        }

        const hasEmptyRow = this.rows.controls.some(ctrl => {
            const val = ctrl.value;
            return !val.cutter_id && !val.issue_date && !val.total_qty;
        });

        if (hasEmptyRow) return;
        this.rowForm = this.fb.group({
            id: [],
            order_id: [this.selectProduct],
            cutter_id: [null, Validators.required],
            issue_date: [null, Validators.required],
            delivery_date: [null],
            lot_no: [''],
            total_qty: [0, Validators.required],
            expanded: [false]
        });
        this.rows.insert(0, this.rowForm);
        this.totalRecords = this.rows.length;
    }



    saveRow(row: FormGroup) {
        if (row.valid) {
            this.alert.successAlert('Saved', 'Row data saved successfully.');
        } else {
            row.markAllAsTouched();
            this.alert.warningAlert('Validation Error', 'Please fill in all required fields.');
        }
    }

    removeRow(index: number) {
        this.rows.removeAt(index);
        this.totalRecords = this.rows.length;
    }
    convertToYyyyMmDd(dateInput: string | Date): string {
        if (!dateInput) return '';

        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    convertToDdMmYyyy(dateInput: string | Date): string {
        if (!dateInput) return '';

        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }


    async saveAll() {
        this.isSaving = true;

        const invalidRows = this.rows.controls.filter(ctrl => ctrl.invalid);
        if (invalidRows.length > 0) {
            invalidRows.forEach(ctrl => ctrl.markAllAsTouched());
            this.alert.warningAlert('Validation', 'Please fill all required fields.');
            this.isSaving = false;
            return;
        }

        const rows: CuttingRow[] = this.rows.controls.map(ctrl => ctrl.value as CuttingRow);
        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            const payload = {
                id: row.id,
                order_id: row.order_id,
                issue_date: this.convertToYyyyMmDd(row.issue_date),
                delivery_date: this.convertToYyyyMmDd(row.delivery_date),
                cutter_id: row.cutter_id,
                lot_no: row.lot_no,
                total_qty: row.total_qty
            };

            try {
                let response;
                if (row.id) {
                    response = await firstValueFrom(this.orderProcess.updateCuttingStep(payload));
                } else {
                    response = await firstValueFrom(this.orderProcess.addCuttingStep(payload));
                }

                if (response.status === 200 || response.status === 201) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error: any) {
                errorCount++;
                console.error(`Error processing row ID ${row.id}:`, error);
            }
        }


        this.isSaving = false;

        // Save to localStorage
        localStorage.setItem('cuttingTableData', JSON.stringify(rows));
        this.tableData = rows;
        this.displayCuttingPopup = false;

        // Show final status
        if (successCount > 0 && errorCount === 0) {
            this.alert.successAlert('Success', `${successCount} row(s) saved successfully.`);
        } else if (successCount > 0 && errorCount > 0) {
            this.alert.warningAlert('Partial Success', `${successCount} saved, ${errorCount} failed.`);
        } else {
            this.alert.errorAlert('Failed', 'No rows were saved.');
        }
    }

    // updateCutting(cuttingid: any) {
    //     firstValueFrom(this.orderProcess.updateCuttingStep())
    // }

    convertDdMmYyyyToDate(dateStr: string): Date | null {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('-');
        return new Date(+year, +month - 1, +day); // month is 0-indexed
    }

    async getAllCutter() {
        const res = await firstValueFrom(this.service.getJobberByType({ jobber_type: 'Cutter' }));
        this.cutter = res.body;
    }

    async fetchAndPatchCuttingStep(orderId: number) {
        try {
            this.rows.clear()
            const res = await firstValueFrom(
                this.orderProcess.gateCuttingStepsByOrderId({ order_id: orderId })
            );

            if (res?.status === 200 && Array.isArray(res.body) && res.body.length > 0) {
                // ADD new rows
                for (const item of res.body) {
                    const rowForm = this.fb.group({
                        id: [item.id],
                        order_id: [item.order_id],
                        cutter_id: [item.cutter_id, Validators.required],
                        issue_date: [this.convertDdMmYyyyToDate(item.issue_date), Validators.required],
                        delivery_date: [this.convertDdMmYyyyToDate(item.delivery_date)],
                        lot_no: [item.lot_no],
                        total_qty: [item.total_qty, Validators.required],
                        expanded: [false]
                    });

                    this.rows.push(rowForm);
                }

                this.totalRecords = this.rows.length;
            } else if (res.status === 404) {
                this.alert.warningAlert('No Data', 'No cutting step data found for this order.');
            }
        } catch (error: any) {
            // this.alert.errorAlert('Error', error?.message || 'Failed to load cutting step data.');
        }
    }


    recive(value: any) {
        this.recivePopup = !this.recivePopup;
        this.reciveForm.patchValue({
            order_id: value.order_id,
            cutting_id: value.id,
            received_date: dayjs().format('YYYY-MM-DD'),
        })
    }

    async submitReciveForm() {
        try {
            const formValue = this.reciveForm.getRawValue();

            const payload = {
                ...formValue,
            };
            const res = await firstValueFrom(this.orderProcess.orderReceive(payload));
            if (res.status === 200) {
                this.alert.successAlert('Success', 'Receive Successful');
                this.reciveForm.reset();
                this.resetAllExpandedRows();
                this.togolData = {}; this.recivePopup = !this.recivePopup;
            } else {
                this.alert.errorAlert('Error', 'Cannot Receive Order');
            }
        } catch (error: any) {
            this.alert.errorAlert('Error', 'Something went wrong while receiving the order.');
        }
    }

    async toggleRow(row: any, index: number) {
        const isExpanded = row.value.expanded;
        row.patchValue({ expanded: !isExpanded });
        if (!isExpanded && !this.togolData[index]) {
            try {
                const response = await firstValueFrom(
                    this.orderProcess.GateAllOrderReceiveById({
                        cutting_id: row.value.id
                    })
                );
                if (response?.status === 200) {
                    this.togolData[index] = response.body || [];
                } else {
                    this.togolData[index] = [];
                }
            } catch (error) {
                console.error('Error fetching toggle data:', error);
                this.togolData[index] = [];
            }
        }
    }

    onNextStep() {
        this.displayCuttingPopup = false;
    }

    handleAction(action: string, row: any) {
        console.log('Action:', action, 'Row:', row);
    }


    deleteCuttingStep(id: any) {
        throw new Error('Method not implemented.');
    }


    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            // Add your data loading logic here
        }
    }

    nextPage(): void {
        if (this.currentPage * this.pageSize < this.totalRecords) {
            this.currentPage++;
            // Add your data loading logic here
        }
    }

    onPageSizeChange(): void {
        this.currentPage = 1; // Reset to first page when page size changes
        // Add your data loading logic here
    }

    getCutterNameById(id: number): string {
        const cutter = this.CutterName.find(c => c.id === id);
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
            this.service.getOrderList({
                page: 0,
                pageSize: 12,
                search: ''
            }).pipe(
                tap(
                    (response) => {
                        if (response.status === 200) {
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

    resetAllExpandedRows() {
        this.rows.controls.forEach((rowCtrl) => {
            rowCtrl.patchValue({ expanded: false });
        });
    }



    closePopou() {
        this.displayCuttingPopup = false;
        this.togolData = []

    }


    onEdit(order: any) {
        this.selectedOrder = order;
        this.selectProduct = order.id;
        // console.log("value", order) 
        this.totalQty = order.total_qty;       
        this.fetchAndPatchCuttingStep(this.selectProduct);
    }

    onDelete(order: any) {
        console.log('Delete:', order);
    }

    gateAllpoQty() {
        this.poData = [
            { id: 1, po_no: 'PO001', qty: 100 },
            { id: 2, po_no: 'PO002', qty: 150 }
        ];
        this.showPoDialog = true;
    }

    showAllPoQty() {
        this.poData = [
            { id: 1, po_no: 'PO001', qty: 100 },
            { id: 2, po_no: 'PO002', qty: 150 }
        ];
    }
}
