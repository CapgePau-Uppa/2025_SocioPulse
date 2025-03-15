import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule
  ],
})
export class ProjectDetailPageComponent implements OnInit {
  project: any;
  requestStatus: string = 'none';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    console.log('ID du projet :', projectId);

    this.projectsService.getProjects().subscribe(data => {
      this.project = data.find(project => project.id === projectId);
      if (this.project) {
        this.checkAccessRequest();
      }
    });
  }

  deleteProject(): void {
    const projectId = this.project?.id;
    const token = sessionStorage.getItem('auth_token');
    if (projectId && token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.delete(`http://localhost:8000/api/projects/${projectId}`, { headers })
        .subscribe(() => {
          console.log('Projet supprimé avec succès');
          this.router.navigate(['/']);
        }, error => {
          console.error('Erreur lors de la suppression du projet', error);
        });
    }
  }

  goToProjectReport(): void {
    this.router.navigate(['/project-repport-page', this.project.id]);
  }

  checkAccessRequest(): void {
    const token = sessionStorage.getItem('auth_token');
    const userId = sessionStorage.getItem('user_id');
    if (!token || !userId) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8000/api/projects/access-requests`, { headers })
      .subscribe(requests => {
        const existingRequest = requests.find(req => req.project_id === this.project.id && req.user_id == userId);

        if (existingRequest) {
          this.requestStatus = existingRequest.status;
        }
      });
  }

  requestAccess(): void {
    const projectId = this.project?.id;
    const token = sessionStorage.getItem('auth_token');

    if (!projectId || !token) {
      console.error('Utilisateur non authentifié ou projet inexistant');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8000/api/projects/${projectId}/access-requests`, {}, { headers })
      .subscribe(() => {
        console.log('Demande envoyée');
        this.requestStatus = 'pending'; // Mise à jour locale pour éviter un rechargement inutile
        alert('Votre demande a été envoyée.');
      }, error => {
        console.error('Erreur lors de la demande', error);
        alert('Vous avez déjà envoyé une demande.');
      });
  }
}
