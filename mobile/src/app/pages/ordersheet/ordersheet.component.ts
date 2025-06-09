import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom, tap } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { allUsers } from '../../services/interface/user';
import { SweetAlertService } from '../../utility/sweet-alert.service';

@Component({
  selector: 'app-ordersheet',
  standalone: true,
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
  templateUrl: './ordersheet.component.html',
  styleUrls: ['./ordersheet.component.scss'],
})
export class OrdersheetComponent {
  orderForm: FormGroup;
  showForm: boolean = false;
  isEdit: boolean = false;
  ordersList?: any;
  articleDialogVisible = false;
  selectedPOIndex = -1;
  updateId = 0;

  constructor(
    private fb: FormBuilder,
    private service: OrderService,
    private alert: SweetAlertService
  ) {
    this.orderForm = this.fb.group({
      styleNo: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      buyer: ['', Validators.required],
      brand: ['', Validators.required],
      season: ['', Validators.required],
      ageGroup: [null, Validators.required],
      shipmentDate: [null],
      pattern: [''],
      remark: [''],
      documents: [[]],

      poQty: this.fb.array([]),
      accessoriesBOM: this.fb.array([]),
    });
    this.fetchOrderList();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.orderForm.reset();
    this.isEdit = false;
    if(this.isEdit === false){
    this.fetchOrderList()
    }
  }

  // ODER LIST
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
    this.isEdit = true;
    this.updateId = order.id;

    await firstValueFrom(
      this.service.getById({ orderId: order.id }).pipe(
        tap(
          (response) => {
            if (response.status == 200) {
              console.log(response.body);

              // Clear the poQty form array
              while (this.poQty.length !== 0) {
                this.poQty.removeAt(0);
              }

              // Populate poQty if available
              if (response.body.poQty) {
                response.body.poQty.forEach((poQty: any) => {
                  this.addPOQty();
                  this.poQty.at(this.poQty.length - 1).patchValue(poQty);
                });
              }

              // Clear the accessoriesBOM form array
              while (this.accessoriesBOM.length !== 0) {
                this.accessoriesBOM.removeAt(0);
              }

              // Populate accessoriesBOM if available
              if (response.body.accessoriesBOM) {
                response.body.accessoriesBOM.forEach((accessoriesBOM: any) => {
                  this.addAccessoryBOM();
                  this.accessoriesBOM.at(this.accessoriesBOM.length - 1).patchValue(accessoriesBOM);
                });
              }

              // Patch other fields
              this.orderForm.patchValue(response.body);
              this.showForm = true;
            }
          },
          (error) => {
            this.alert.errorAlert(error.error.message, error.error.body);
          }
        )
      )
    );

    console.log('Edit:', order);
  }


  onDelete(order: any) {
    // TODO: Add confirmation and call delete API
    console.log('Delete:', order);
  }
  // LIST ODER

  // getters for easy access to form controls
  get f() {
    return this.orderForm.controls;
  }

  get poQty(): FormArray {
    return this.orderForm.get('poQty') as FormArray;
  }


  get accessoriesBOM(): FormArray {
    return this.orderForm.get('accessoriesBOM') as FormArray;
  }

  //! Add PO Qty group
  addPOQty() {
    this.poQty.push(
      this.fb.group({
        fabric: [''],
        item: [''],
        color: [''],
        combo: [''],
        size: [''],
        qty: [''],
      })
    );
  }

  removePOQty(index: number) {
    this.poQty.removeAt(index);
  }


  // BOM Accessories
  addAccessoryBOM() {
    this.accessoriesBOM.push(
      this.fb.group({
        item: [''],
        description: [''],
        consumption: [''],
        status: [''],
      })
    );
  }

  removeAccessoryBOM(index: number) {
    this.accessoriesBOM.removeAt(index);
  }

  // File upload handlers
  onDocUpload(event: any): void {
    const files: FileList = event.target.files || event.files;
    const base64Files: string[] = [];

    if (!files || files.length === 0) return;

    const fileReaders: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const readerPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      fileReaders.push(readerPromise);
    }

    Promise.all(fileReaders)
      .then((base64Array: string[]) => {
        this.orderForm.patchValue({ documents: base64Array });
      })
      .catch((error) => {
        console.error('File conversion error:', error);
      });
  }


  onProductPhotoUpload(event: any, articleIndex: number) {
    if (this.selectedPOIndex === -1) return;
    const files = event.files;

  }

  convertToMysqlDate(date: any): string | null {
    if (!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  async submitOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    // FORMATE DATE TO YYYY-MM-DD
    this.orderForm.patchValue({
      date: this.convertToMysqlDate(this.orderForm.value.date),
      shipmentDate: this.convertToMysqlDate(this.orderForm.value.shipmentDate),
      deadlineDate: this.convertToMysqlDate(this.orderForm.value.deadlineDate)
    })

    if (this.isEdit) {

      const payload = { ...this.orderForm.value, id: this.updateId };

      await firstValueFrom(this.service.update(payload).pipe(
        tap(
          (response) => {
            if (response.status == 200) {
              this.alert.successAlert('Success', 'Order updated successfully.');
            }
          },
          (error) => {
            this.alert.errorAlert(error.error.message, error.error.body);
          }
        )
      ))
      return;
    }

    await firstValueFrom(this.service.createOrder(this.orderForm.value).pipe(
      tap(
        (response) => {
          if (response.status == 200) {
                console.log(response);
                console.log('Setting orderId to localStorage:', response.body.orderId);
                localStorage.setItem('orderId', response.body.orderId);
            this.alert.successAlert('Success', 'Order submitted successfully.');
          }
        },
        (error) => {
          this.alert.errorAlert(error.error.message, error.error.body);
        }
      )
    ))
  }


  // go no next setp
  goToNextStep(){
localStorage.setItem('orderId', 'dfgf');
  }
}
