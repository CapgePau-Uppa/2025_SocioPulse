import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpHeaders } from '@angular/common/http';
import 'leaflet/dist/leaflet.css';
import {ProjectsService} from '../services/projects.service';
import {ProjectUpdateService} from '../services/project-update-service.service';

@Component({
  selector: 'app-project-maker-page',
  templateUrl: './project-maker-page.component.html',
  imports: [
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatDialogActions,
    MatButton
  ],
  styleUrls: ['./project-maker-page.component.scss']
})
export class ProjectMakerPageComponent implements OnInit {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private projectUpdateService: ProjectUpdateService = inject(ProjectUpdateService);
  private map!: L.Map;
  private marker!: L.Marker;
  project = {
    name: '',
    department: '',
    city: '',
    description: '',
    latitude: '',
    longitude: '',
    user_id: sessionStorage.getItem('user_id'),
    status: 'En cours',
    entreprise_id: '' // Ajoutez ce champ pour lier l'entreprise sélectionnée
  };
  entreprises: any[] = [];

  ngOnInit() {
    this.initMap();
    this.loadEntreprises();
    console.log("entreprises", this.entreprises);
  }

  private async getLocationDetails(lat: number, lng: number): Promise<void> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SocioPulse' // Replace with your app name
        }
      });
      const data = await response.json();

      if (data.address) {
        this.project.city = data.address.city || data.address.town || data.address.village || '';
        this.project.department = data.address.county || '';
        //todo: eventually use the postcode for sending or smth
        console.log(data.address.postcode);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [43.3, -0.3667],
      zoom: 6
    }); // Set initial coordinates and zoom

    const tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.project.latitude = lat.toString();
      this.project.longitude = lng.toString();
      //todo: get city and department from lat and lng
      await this.getLocationDetails(lat, lng);
      // Update marker position
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng]).addTo(this.map);
    });
  }

  private loadEntreprises(): void {
    this.http.get<any[]>('http://localhost:8000/api/entreprises')
      .subscribe(data => {
        this.entreprises = data;
      }, error => {
        console.error('Erreur lors du chargement des entreprises', error);
      });
      console.log("entreprises", this.entreprises);
  }

  onSubmit(form: any): void {
    const token = sessionStorage.getItem('auth_token');
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Ajouter le token dans l'en-tête
      'Content-Type': 'application/json'
    });
    console.log("entreprises", this.entreprises);
    if (form.valid) {
      this.project.entreprise_id = this.project.entreprise_id.toString();
      console.log('Project data:', this.project);


      this.http.post('http://localhost:8000/api/projects', this.project, { headers }).subscribe(
      response => console.log(response),
      error => console.log(error));
      this.router.navigate(['/']);
      //notify the map
      this.projectUpdateService.notifyProjectUpdate(); // Notify project update
    }
  }
}
