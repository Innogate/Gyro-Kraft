import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ordersheet',
  imports: [ReactiveFormsModule, DialogModule, CommonModule],
  templateUrl: './ordersheet.component.html',
  styleUrl: './ordersheet.component.scss'
})
export class OrdersheetComponent {
  displayProfile:boolean = false;
  imageUrls: string[] = [];  // To store the image URLs
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


 

  // Handle  more file showing
onFilesSelected(event: any): void {
  const files = event.target.files;  
    
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
    console.log(this.imageUrls)
  }
}



}
