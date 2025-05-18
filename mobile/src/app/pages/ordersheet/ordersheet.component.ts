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
  ageGroupOptions = [
    { label: 'Infant', value: 'Infant' },
    { label: 'Toddler', value: 'Toddler' },
    { label: 'Child', value: 'Child' },
    { label: 'Teen', value: 'Teen' },
    { label: 'Adult', value: 'Adult' },
  ];

  articleDialogVisible = false;
  selectedPOIndex = -1;

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      uniqueId: ['', Validators.required],
      date: [null, Validators.required],
      buyer: ['', Validators.required],
      styleNo: ['', Validators.required],
      brand: ['', Validators.required],
      season: ['', Validators.required],
      ageGroup: [null, Validators.required],
      shipmentDate: [null],
      pattern: [''],
      printing: [''],
      steps: [''],
      deadlineDate: [null],
      remark: [''],
      documents: [[]], // store file info here

      poQty: this.fb.array([]),
      fabricBOM: this.fb.array([]),
      accessoriesBOM: this.fb.array([]),
    });
  }

  // getters for easy access to form controls
  get f() {
    return this.orderForm.controls;
  }

  get poQty(): FormArray {
    return this.orderForm.get('poQty') as FormArray;
  }

  get fabricBOM(): FormArray {
    return this.orderForm.get('fabricBOM') as FormArray;
  }

  get accessoriesBOM(): FormArray {
    return this.orderForm.get('accessoriesBOM') as FormArray;
  }

  // Add PO Qty group
  addPOQty() {
    this.poQty.push(
      this.fb.group({
        combo: [''],
        proColor: [''],
        fabricQuality: [''],
        supplier: [''],
        preemie: [0],
        nb: [0],
        totalQty: [0],
        articles: this.fb.array([]),
      })
    );
  }

  removePOQty(index: number) {
    this.poQty.removeAt(index);
  }

  // Articles form array inside selected PO Qty
  getArticlesArray(index: number): FormArray {
    return this.poQty.at(index).get('articles') as FormArray;
  }

  // Article dialog form for currently selected PO Qty
  get selectedPOArticlesGroup(): FormGroup {
    if (this.selectedPOIndex === -1) return this.fb.group({});
    return this.poQty.at(this.selectedPOIndex) as FormGroup;
  }

  get articlesArray(): FormArray {
    if (this.selectedPOIndex === -1) return this.fb.array([]);
    return this.getArticlesArray(this.selectedPOIndex);
  }

  openArticleDialog(poIndex: number) {
    this.selectedPOIndex = poIndex;
    this.articleDialogVisible = true;
  }

  addArticle() {
    if (this.selectedPOIndex === -1) return;
    this.articlesArray.push(
      this.fb.group({
        ageGroup: [null],
        articleNo: [''],
        qty: [0],
        gender: [''],
        productPhotos: [[]], // file info
      })
    );
  }

  removeArticle(index: number) {
    this.articlesArray.removeAt(index);
  }

  // BOM Fabric
  addFabricBOM() {
    this.fabricBOM.push(
      this.fb.group({
        description: [''],
        fabric: [''],
        colour: [''],
        tpx: [''],
      })
    );
  }

  removeFabricBOM(index: number) {
    this.fabricBOM.removeAt(index);
  }

  // BOM Accessories
  addAccessoryBOM() {
    this.accessoriesBOM.push(
      this.fb.group({
        particular: [''],
        specification: [''],
        shadeNo: [''],
        consumption: [0],
        supplier: [''],
        status: [''],
      })
    );
  }

  removeAccessoryBOM(index: number) {
    this.accessoriesBOM.removeAt(index);
  }

  // File upload handlers
  onDocUpload(event: any) {
    // For demo, just store files info array
    const files = event.files;
    this.orderForm.patchValue({ documents: files });
  }

  onProductPhotoUpload(event: any, articleIndex: number) {
    if (this.selectedPOIndex === -1) return;
    const files = event.files;
    const articles = this.getArticlesArray(this.selectedPOIndex);
    const currentPhotos = articles.at(articleIndex).get('productPhotos')?.value || [];
    articles.at(articleIndex).patchValue({
      productPhotos: [...currentPhotos, ...files],
    });
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    console.log('Submitted Order:', this.orderForm.value);
    alert('Order submitted! Check console for details.');
  }
}
