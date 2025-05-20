import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterMasterComponent } from './printer-master.component';

describe('PrinterMasterComponent', () => {
  let component: PrinterMasterComponent;
  let fixture: ComponentFixture<PrinterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
