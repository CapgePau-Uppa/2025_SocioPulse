import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-projects-list-page',
  templateUrl: './projects-list-page.component.html',
  styleUrls: ['./projects-list-page.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule]
})
export class ProjectsListPageComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectsService) { }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }
}
