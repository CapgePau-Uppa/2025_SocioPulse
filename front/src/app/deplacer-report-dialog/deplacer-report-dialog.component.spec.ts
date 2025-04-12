import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeplacerReportDialogComponent } from './deplacer-report-dialog.component';

describe('DeplacerReportDialogComponent', () => {
  let component: DeplacerReportDialogComponent;
  let fixture: ComponentFixture<DeplacerReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeplacerReportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeplacerReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
