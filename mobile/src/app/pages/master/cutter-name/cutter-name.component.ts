import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface Cutter {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
}

@Component({
  selector: 'app-cutter-name',
  imports: [CommonModule],
  templateUrl: './cutter-name.component.html',
  styleUrl: './cutter-name.component.scss'
})
export class CutterNameComponent {
  cutters: Cutter[] = [
    { name: 'John Doe', address: '123 Main St, City A', phone: '+1234567890', whatsapp: '+1234567890' },
    { name: 'Jane Smith', address: '456 Elm St, City B', phone: '+1234567891', whatsapp: '+1234567891' },
    { name: 'Michael Brown', address: '789 Maple Ave, City C', phone: '+1234567892', whatsapp: '+1234567892' },
    { name: 'Emily Clark', address: '321 Oak St, City D', phone: '+1234567893', whatsapp: '+1234567893' },
    { name: 'James Wilson', address: '654 Pine Rd, City E', phone: '+1234567894', whatsapp: '+1234567894' },
    { name: 'Laura Davis', address: '987 Cedar Dr, City F', phone: '+1234567895', whatsapp: '+1234567895' },
    { name: 'David Martin', address: '159 Birch Blvd, City G', phone: '+1234567896', whatsapp: '+1234567896' },
    { name: 'Sarah Lee', address: '753 Aspen Ln, City H', phone: '+1234567897', whatsapp: '+1234567897' },
    { name: 'Robert Hall', address: '951 Willow St, City I', phone: '+1234567898', whatsapp: '+1234567898' },
    { name: 'Linda Young', address: '357 Poplar Ave, City J', phone: '+1234567899', whatsapp: '+1234567899' },
    { name: 'Paul Wright', address: '852 Cherry Rd, City K', phone: '+1234567810', whatsapp: '+1234567810' },
    { name: 'Nancy Scott', address: '741 Fir Dr, City L', phone: '+1234567811', whatsapp: '+1234567811' },
    { name: 'Steven King', address: '369 Redwood Blvd, City M', phone: '+1234567812', whatsapp: '+1234567812' },
    { name: 'Betty Green', address: '258 Cypress St, City N', phone: '+1234567813', whatsapp: '+1234567813' },
    { name: 'Henry Adams', address: '147 Spruce Ave, City O', phone: '+1234567814', whatsapp: '+1234567814' },
    { name: 'Alice Baker', address: '963 Palm Rd, City P', phone: '+1234567815', whatsapp: '+1234567815' },
    { name: 'Mark Harris', address: '357 Sycamore Ln, City Q', phone: '+1234567816', whatsapp: '+1234567816' },
    { name: 'Donna Thomas', address: '741 Mahogany Blvd, City R', phone: '+1234567817', whatsapp: '+1234567817' },
    { name: 'Brian Moore', address: '852 Dogwood Dr, City S', phone: '+1234567818', whatsapp: '+1234567818' },
    { name: 'Megan Turner', address: '159 Magnolia St, City T', phone: '+1234567819', whatsapp: '+1234567819' }
  ];
}
