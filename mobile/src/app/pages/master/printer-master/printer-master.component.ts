import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PrintersMaster } from '../../../services/interface/printerMaster';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../utility/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { PrintersMasterService } from '../../../services/printerMaster.service';
@Component({
  selector: 'app-printer-master',
  imports: [CommonModule, FormsModule, DialogModule, ReactiveFormsModule],
  templateUrl: './printer-master.component.html',
  styleUrl: './printer-master.component.scss'
})
export class PrinterMasterComponent {
printers: PrintersMaster[] = [];

  constructor(
    private PrintersMasterService: PrintersMasterService,
    private fb: FormBuilder,
    private sweetAlertService: SweetAlertService
  ) {

  }

  showForm = false;
  showEdit = false;
  newPrinters: PrintersMaster = { name: '', address: '', phone_no: '', whatsapp_no: '' };
  errorMessage: string = '';
  PrintersForm!: FormGroup;

  toggleForm() {
    this.showEdit = false;
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.PrintersForm.reset();
    }
  }

  ngOnInit() {
    this.PrintersForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      address: [''],
      phone_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      whatsapp_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
    this.gateAllPrinters();
  }

  // gate all Printers
  async gateAllPrinters() {
    try {
      const response = await firstValueFrom(this.PrintersMasterService.gateAllPrinters());
      if (response.status === 200 && Array.isArray(response.body)) {
        this.printers = response.body;
      }
    } catch (e) {
      console.error('Error fetching Printerss:', e);
    }
  }
 
  // add Printers
  addPrinters() {
    if (this.PrintersForm.valid) {
      this.newPrinters = this.PrintersForm.value;
      try {
        firstValueFrom(this.PrintersMasterService.createPrinters(this.newPrinters)).then((response) => {
          if (response.status === 200) {
            this.sweetAlertService.successAlert('Success', 'Printers created successfully');
            this.gateAllPrinters();
            this.toggleForm();
          } else {
            this.sweetAlertService.errorAlert('Error', 'Failed to create Printers');
          }
        });
      }
      catch (e) {
        this.sweetAlertService.errorAlert('Error', 'Failed to create Printers');
      }
    } else {
      this.sweetAlertService.warningAlert('Worning', 'Please fill in all required fields correctly.');
    }
  }

  // View Printers
  editPrinters(Printers: PrintersMaster) {
    console.log(Printers);
    this.newPrinters = Printers;
    this.PrintersForm.patchValue({
      id: Printers.id,
      name: Printers.name,
      address: Printers.address,
      phone_no: Number(Printers.phone_no),
      whatsapp_no: Number(Printers.whatsapp_no),
    });
    this.showEdit = true;
    this.showForm = true;
  }

 // Update Printers
  updatePrinters() {
    console.log(this.PrintersForm.value);
    if (this.PrintersForm.valid) {
      this.newPrinters = this.PrintersForm.value;
      try {
        firstValueFrom(this.PrintersMasterService.updatePrinters(this.newPrinters)).then((response) => {
          if (response.status === 200) {
            this.sweetAlertService.successAlert('Success', 'Printers updated successfully');
            this.gateAllPrinters();
            this.toggleForm();
          } else {
            this.sweetAlertService.errorAlert('Error', 'Failed to update Printers');
          }
        });
      }
      catch (e) {
        this.sweetAlertService.errorAlert('Error', 'Failed to update Printers');
      }
    } else {
      this.sweetAlertService.warningAlert('Worning', 'Please fill in all required fields correctly.');
    }
  }

  // Delete Printers
  deletePrinters(Printers: PrintersMaster) {
    const newStatus = !Printers.status;
    const action = newStatus ? 'activate' : 'deactivate';

    const payload = {
      id: Printers.id,
      status: !Printers.status,
    } as unknown as PrintersMaster;

    this.sweetAlertService.confirmAlert(
      'Confirmation',
      `Are you sure you want to ${action} this Printers?`
    ).then((result) => {
      if (result.isConfirmed) {
        firstValueFrom(this.PrintersMasterService.deletePrinters(payload)).then((response) => {
          if (response.status === 200) {
            this.sweetAlertService.successAlert('Success', `Printers ${action}d successfully`);
            this.gateAllPrinters();
          } else {
            this.sweetAlertService.errorAlert('Error', `Failed to ${action} Printers`);
          }
        });
      }
    });
  }
}
