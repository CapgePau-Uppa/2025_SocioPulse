import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAccessRequestsComponent } from './project-access-requests.component';

describe('ProjectAccessRequestsComponent', () => {
  let component: ProjectAccessRequestsComponent;
  let fixture: ComponentFixture<ProjectAccessRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAccessRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAccessRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
