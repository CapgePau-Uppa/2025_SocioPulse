import { Component, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { FeaturedComponent } from '../featured/featured.component';
import * as L from 'leaflet';
import { ProjectsService } from '../services/projects.service';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    RouterLink,
    FeaturedComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent implements OnInit {
  private map!: L.Map;
  projects: any[] = [];

  private initMap(): void {
    this.map = L.map('map').setView([43.3, -0.3667], 6); // Set initial coordinates and zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    for (let i = 0; i < this.projects.length; i++) {
      L.marker([this.projects[i].latitude, this.projects[i].longitude]).addTo(this.map)
        .bindPopup(this.projects[i].name)
        .openPopup();
    }
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('token'));
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
      this.initMap(); // Initialize the map after projects are loaded
    });
  }

  constructor(private projectService: ProjectsService, private router: Router) { }

  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
