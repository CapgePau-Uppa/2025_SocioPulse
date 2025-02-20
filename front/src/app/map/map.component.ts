import { Component, AfterViewInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
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
  constructor(private projectService: ProjectsService) { }

  ngAfterViewInit(): void {
    this.projectService.getProjects().subscribe((data: any[]) => {
      this.projects = data;
      this.initMap(); // Initialize the map after projects are loaded
    });
  }
}
