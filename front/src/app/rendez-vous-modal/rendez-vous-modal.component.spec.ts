import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezVousModalComponent } from './rendez-vous-modal.component';

describe('RendezVousModalComponent', () => {
  let component: RendezVousModalComponent;
  let fixture: ComponentFixture<RendezVousModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendezVousModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezVousModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
