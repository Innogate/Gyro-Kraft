import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPageComponent } from './cutting-page.component';

describe('CuttingPageComponent', () => {
  let component: CuttingPageComponent;
  let fixture: ComponentFixture<CuttingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuttingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuttingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
