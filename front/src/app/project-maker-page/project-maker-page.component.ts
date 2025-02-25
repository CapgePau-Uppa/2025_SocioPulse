import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/form-field';
import {MatError} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {MatDialogActions} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import * as L from 'leaflet';
@Component({
  selector: 'app-project-maker-page',
  templateUrl: './project-maker-page.component.html',
  imports: [
    FormsModule,
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
  private map!: L.Map;
  private marker!: L.Marker;
  project = {
    name: '',
    department: '',
    city: '',
    description: '',
    latitude:'',
    longitude:'',
    user_id:sessionStorage.getItem('user_id')
  };
  ngOnInit() {
    this.initMap();
  }
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

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.project.latitude = lat.toString();
      this.project.longitude = lng.toString();

      // Update marker position
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng]).addTo(this.map);
    });
  }
  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Project data:', this.project);
      this.http.post('http://localhost:8000/api/projects', this.project).subscribe(
        response => console.log(response),
        error => console.log(error));
      this.router.navigate(['/']);
    }
  }

}
