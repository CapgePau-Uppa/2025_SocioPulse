import { Component, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    RouterLink,
    MapComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent implements OnInit {
  projects: any[] = [];

  ngOnInit(): void {
    console.log(sessionStorage.getItem('token'));
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  constructor(private projectService: ProjectsService, private router: Router) { }

  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
