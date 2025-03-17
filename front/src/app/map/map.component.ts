import {Component, AfterViewInit, inject} from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {ProjectUpdateService} from '../services/project-update-service.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  projects: any[] = [];

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 43.3, -0.3667],
      zoom: 6
    }); // Set initial coordinates and zoom

    const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    for (let i = 0; i < this.projects.length; i++) {
      L.marker([this.projects[i].latitude, this.projects[i].longitude]).addTo(this.map)
        .bindPopup(this.projects[i].name)
        .openPopup();
    }
  }
  constructor(private projectUpdateService : ProjectUpdateService,
              private projectService: ProjectsService) {
    // Subscribe to project updates
    this.projectUpdateService.projectUpdated$.subscribe(() => {
     this.refreshProjects();
    });

  }
  refreshProjects(): void {
    this.projectService.getProjects().subscribe((data: any[]) => {
      this.projects = data;
      if (this.map) {
        // Clear existing markers
        this.map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });
        // Add markers for updated projects
        for (let project of this.projects) {
          if (project.latitude && project.longitude) {
            L.marker([project.latitude, project.longitude]).addTo(this.map)
              .bindPopup(project.name)
              .openPopup();
          }
        }
      }
    });
  }
  ngAfterViewInit(): void {
    this.projectService.getProjects().subscribe((data: any[]) => {
      this.projects = data;
      this.initMap(); // Initialize the map after projects are loaded
    });
  }
}
