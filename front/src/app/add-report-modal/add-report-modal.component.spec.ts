import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportModalComponent } from './add-report-modal.component';

describe('AddReportModalComponent', () => {
  let component: AddReportModalComponent;
  let fixture: ComponentFixture<AddReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
