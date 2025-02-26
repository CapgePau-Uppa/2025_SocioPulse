import { Component,ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  imports: [
    MatButtonModule,
    MatCardModule
  ],
})

export class ProjectDetailPageComponent implements OnInit {
  project: any;

  constructor(private route: ActivatedRoute, private projectsService: ProjectsService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.projectsService.getProjects().subscribe(data => {
      this.project = data.find(project => project.id === projectId);
    });
  }

  deleteProject(): void {
    const projectId = this.project.id;
    const token = sessionStorage.getItem('auth_token');
    if (projectId && token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.delete(`http://localhost:8000/api/projects/${projectId}`, { headers })
        .subscribe(response => {
          console.log('Projet supprimé avec succès', response);
          this.router.navigate(['/']);
        }, error => {
          console.error('Erreur lors de la suppression du projet', error);
        });
    }
  }
}
