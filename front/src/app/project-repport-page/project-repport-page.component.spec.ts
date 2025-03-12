import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRepportPageComponent } from './project-repport-page.component';

describe('ProjectRepportPageComponent', () => {
  let component: ProjectRepportPageComponent;
  let fixture: ComponentFixture<ProjectRepportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectRepportPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectRepportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
