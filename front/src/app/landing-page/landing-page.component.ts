import { Component, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import {MapComponent} from '../map/map.component';
import { MatIcon } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    RouterLink,
    MapComponent,
    MatIcon,
    MatFormField,
    MatLabel,
    FormsModule,
    MatTableModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'department', 'city', 'description'];
  projects: any[] = [];
  projects_all: any[] = [];
  favoriteIds: number[] = [];
  connected: boolean = false;
  filteredByFavorite: boolean = false;
  searchTerm: string = '';

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('auth_token');

    this.projectService.getProjects().subscribe(data => {
      this.projects_all = data;
      this.applyFilters();
    });

    if (token) {
      this.connected = true;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any[]>(`http://localhost:8000/api/favorites`, { headers })
        .subscribe(favs => {
          this.favoriteIds = favs.map(f => f.project_id);
          this.applyFilters();
        }, err => console.error(err));
    }
  }

  toggleFavorite(): void {
    this.filteredByFavorite = !this.filteredByFavorite;
    this.applyFilters();
  }

  applySearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.projects_all];

    if (this.filteredByFavorite) {
      filtered = filtered.filter(p => this.favoriteIds.includes(p.id));
    }

    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        (project.name && project.name.toLowerCase().includes(searchTermLower)) ||
        (project.description && project.description.toLowerCase().includes(searchTermLower)) ||
        (project.city && project.city.toLowerCase().includes(searchTermLower))
      );
    }

    this.projects = filtered;
  }

  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
