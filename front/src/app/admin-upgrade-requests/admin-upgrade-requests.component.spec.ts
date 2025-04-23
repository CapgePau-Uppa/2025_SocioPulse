import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpgradeRequestsComponent } from './admin-upgrade-requests.component';

describe('AdminUpgradeRequestsComponent', () => {
  let component: AdminUpgradeRequestsComponent;
  let fixture: ComponentFixture<AdminUpgradeRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpgradeRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpgradeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
