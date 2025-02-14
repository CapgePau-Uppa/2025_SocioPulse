import {Component, OnInit, AfterViewInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {FeaturedComponent} from '../featured/featured.component';
import * as L from 'leaflet';
import { ProjectsService } from '../services/projects.service';

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
export class LandingPageComponent implements AfterViewInit {
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map').setView([43.3, -0.3667], 6); // Set initial coordinates and zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    /*
    L.marker([43.3, -0.3667]).addTo(this.map)
      .bindPopup('A marker on the map')
      .openPopup();*/
    }

  ngAfterViewInit(): void {
    this.initMap();
  }
    projects: any[] = [];

    constructor(private projectService: ProjectsService) { }

    ngOnInit(): void {
      console.log(sessionStorage.getItem('token'));
      this.projectService.getProjects().subscribe(data => {
        this.projects = data;
      });
    }
}
