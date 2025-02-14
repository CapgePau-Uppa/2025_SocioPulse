import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMakerPageComponent } from './project-maker-page.component';

describe('ProjectMakerComponent', () => {
  let component: ProjectMakerPageComponent;
  let fixture: ComponentFixture<ProjectMakerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMakerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMakerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
