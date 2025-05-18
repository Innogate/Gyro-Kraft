import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingMasterComponent } from './printing-master.component';

describe('PrintingMasterComponent', () => {
  let component: PrintingMasterComponent;
  let fixture: ComponentFixture<PrintingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintingMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
