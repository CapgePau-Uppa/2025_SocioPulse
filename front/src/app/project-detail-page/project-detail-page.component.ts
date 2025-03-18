import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrls: ['./project-detail-page.component.scss'],
  imports: [
    MatButtonModule,
    CommonModule,
    MatButton,
    MatCardModule
  ],
})
export class ProjectDetailPageComponent implements AfterViewInit {
  project: any;
  requestStatus: string = 'none';
  canAccess: boolean = false; // Stocke le résultat du test d'accès
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.project.latitude, this.project.longitude],
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.project.latitude, this.project.longitude]).addTo(this.map)
      .bindPopup(this.project.name)
      .openPopup();
  }

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);

    this.projectsService.getProjects().subscribe(data => {
      this.project = data.find(project => project.id === projectId);

      if (this.project) {
        this.checkUserAccess();  // Vérifier si l'utilisateur peut accéder aux documents
        this.checkAccessRequest(); // Vérifier s'il y a une demande en attente

        setTimeout(() => {
          this.initMap();
        }, 0);
      } else {
        console.error('Projet non trouvé pour l\'ID :', projectId);
      }
    }, error => {
      console.error('Erreur lors de la récupération des projets', error);
    });
  }

/** Vérifie si l'utilisateur peut accéder aux documents */
public checkUserAccess(): void {
  const userId = sessionStorage.getItem('user_id');
  const userEntreprise_id = Number(sessionStorage.getItem('entreprise_id'));
  const userRole = sessionStorage.getItem('role');
  const projectId = this.project?.id;

  if (!userId || !projectId) {
    return;
  }

  // Vérification si l'utilisateur est admin ou de la même entreprise
  this.canAccess = (this.project.entreprise_id === userEntreprise_id) || (userRole === 'administrator');

  if (this.canAccess) {
    return; // Si déjà autorisé, inutile de vérifier les demandes d'accès
  }

  const token = sessionStorage.getItem('auth_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Vérification dans la table pdf_access_requests
  this.http.get<any[]>(`http://localhost:8000/api/projects/${projectId}/access-requests`, { headers })
    .subscribe(requests => {
      const userRequest = requests.find(req => req.user_id == userId && req.status === 'approved');

      if (userRequest) {
        this.canAccess = true;
      }

      console.log('canAccess après vérification des demandes:', this.canAccess);
    }, error => {
      console.error('Erreur lors de la vérification des demandes d\'accès', error);
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
    const projectId = this.project?.id;

    if (!token || !userId || !this.project) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8000/api/projects/${projectId}/access-requests`, { headers })
      .subscribe(requests => {
        const existingRequest = requests.find(req => req.user_id == userId);

        if (existingRequest) {
          this.requestStatus = existingRequest.status; // "approved", "pending", "rejected"
        } else {
          this.requestStatus = 'none'; // Aucune demande trouvée
        }
      }, error => {
        console.error('Erreur lors de la récupération des demandes', error);
        this.requestStatus = 'none';
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
        this.requestStatus = 'pending';
        alert('Votre demande a été envoyée.');
      }, error => {
        console.error('Erreur lors de la demande', error);
        alert('Vous avez déjà envoyé une demande.');
      });
  }

  openDialog(): void {
    alert('Fonctionnalité non implémentée');
  }
}
