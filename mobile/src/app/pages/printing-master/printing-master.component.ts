
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-printing-master',
  imports: [FormsModule,CommonModule,DialogModule,InputTextModule,ButtonModule],
  templateUrl: './printing-master.component.html',
  styleUrl: './printing-master.component.scss'
})
export class PrintingMasterComponent {

  showForm = false;
  errorMessage = '';

  newPrinting = {
    date: '',
    challanNo: '',
    printerName: '',
    screenNo: '',
    screenQty: null,
    deliveryDate: '',
    receivedQty: null,
    remark: ''
  };

  printingMaster = {
    date: new Date(),
    challanNo: 'CH-00123',
    printerName: 'ABC Printers',
    screenNo: 'SCR-45',
    screenQty: 200,
    deliveryDate: new Date('2025-05-22'),
    receivedQty: 180,
    remark: 'Partial delivery due to stock'
    
  };

  

  openForm() {
    this.showForm = true;
    this.newPrinting = {
      date: '',
      challanNo: '',
      printerName: '',
      screenNo: '',
      screenQty: null,
      deliveryDate: '',
      receivedQty: null,
      remark: ''
    };
    this.errorMessage = '';
  }

  closeForm() {
    this.showForm = false;
  }

  saveForm() {
    if (!this.newPrinting.date || !this.newPrinting.challanNo) {
      this.errorMessage = 'Please fill required fields';
      return;
    }

    // TODO: Call API or process data
    console.log('Form saved:', this.newPrinting);
    this.closeForm();
  }
  

  editPrintingMaster() {
    // Add edit logic
  }

  deletePrintingMaster() {
    // Add delete logic
  }
}
