import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cutter {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
}

@Component({
  selector: 'app-cutter-name',
  imports: [CommonModule, FormsModule],
  templateUrl: './cutter-name.component.html',
  styleUrls: ['./cutter-name.component.scss']
})
export class CutterNameComponent {
  cutters: Cutter[] = [
    { name: 'John Doe', address: '123 Main St, City A', phone: '1234567890', whatsapp: '1234567890' },
    { name: 'Jane Smith', address: '456 Elm St, City B', phone: '1234567891', whatsapp: '1234567891' },
    { name: 'Michael Brown', address: '789 Maple Ave, City C', phone: '1234567892', whatsapp: '1234567892' },
  ];

  showForm = false;
  newCutter: Cutter = { name: '', address: '', phone: '', whatsapp: '' };
  errorMessage: string = '';

  toggleForm() {
    this.showForm = !this.showForm;
    this.newCutter = { name: '', address: '', phone: '', whatsapp: '' };
    this.errorMessage = '';
  }

  addCutter() {
    // Check for duplicate phone or WhatsApp numbers
    const isDuplicate = this.cutters.some(
      cutter =>
        cutter.phone === this.newCutter.phone || 
        cutter.whatsapp === this.newCutter.whatsapp
    );

    if (isDuplicate) {
      this.errorMessage = 'Cutter with the same phone or WhatsApp number already exists.';
      return;
    }

    // Add the new cutter if all fields are filled
    if (this.newCutter.name && this.newCutter.address && this.newCutter.phone && this.newCutter.whatsapp) {
      this.cutters.push({ ...this.newCutter });
      this.toggleForm();
    }
  }

  filterNumbers(event: Event, field: 'phone' | 'whatsapp') {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');

    // Update the corresponding model value
    if (field === 'phone') {
      this.newCutter.phone = inputElement.value;
    } else if (field === 'whatsapp') {
      this.newCutter.whatsapp = inputElement.value;
    }
  }
}
