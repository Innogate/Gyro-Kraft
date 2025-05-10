import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-ordersheet',
  imports: [ReactiveFormsModule, DialogModule],
  templateUrl: './ordersheet.component.html',
  styleUrl: './ordersheet.component.scss'
})
export class OrdersheetComponent {
  displayProfile:boolean = false;
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      uniqueId: [''],
      date: [null],
      buyer: [''],
      styleNo: [''],
      brand: [''],
      season: [''],
      ageGroup: [''],
      shipmentDate: [null],
      pattern: [''],
      printing: [''],
      documents: [null],
      stepsRequired: [''],
      remark: [''],
      deadlineDate: [null],
    });
  }



}
