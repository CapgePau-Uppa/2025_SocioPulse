import { Component, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import {MapComponent} from '../map/map.component';
import { MatIcon } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    RouterLink,
    MapComponent,
    MatIcon
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent implements OnInit {
  projects: any[] = [];
  projects_all: any[] = [];
  filteredByFavorite = false;
  favoriteIds: number[] = [];

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('auth_token');
    this.projectService.getProjects().subscribe(data => {
      this.projects_all = data;
      this.projects = data;
    });

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any[]>(`http://localhost:8000/api/favorites`, { headers })
        .subscribe(favs => {
          this.favoriteIds = favs.map(f => f.project_id);
        }, err => console.error(err));
    }
  }

  toggleFavorite(): void {
    this.filteredByFavorite = !this.filteredByFavorite;
    if (this.filteredByFavorite) {
      this.projects = this.projects_all.filter(p =>
        this.favoriteIds.includes(p.id)
      );
    } else {
      this.projects = [...this.projects_all];
    }
  }

  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
