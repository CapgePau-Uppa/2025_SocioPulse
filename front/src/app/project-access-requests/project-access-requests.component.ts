import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-access-requests',
  imports: [
    CommonModule
  ],
  templateUrl: './project-access-requests.component.html',
  styleUrls: ['./project-access-requests.component.scss']
})
export class ProjectAccessRequestsComponent implements OnInit {
  requests: any[] = [];
  project: any = {}; // Le projet concerné par les demandes

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRequests();
  }

  // Récupérer les demandes d'accès aux projets que l'utilisateur gère
  getRequests(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.get('http://localhost:8000/api/projects/access-requests', { headers })
      .subscribe(data => {
        console.log('Données récupérées :', data);
        this.requests = data as any[];
  
        // Vérifier si un projet est défini
        if (this.requests.length > 0) {
          console.log('Premier projet trouvé:', this.requests[0].project_id);
        }
      }, error => {
        console.error('Erreur lors de la récupération des demandes', error);
      });
  }
  
  // Vérifier si l'utilisateur peut approuver/refuser une demande
  isAuthorizedToManageRequests(): boolean {
    const role = sessionStorage.getItem('role');
    console.log('Données dans role :', role);
    const userId = sessionStorage.getItem('user_id');

    // Vérifier si c'est un admin ou le propriétaire du projet
    return role === 'administrator' || userId === this.project.user_id;
  }

  // Approuver une demande
  approveRequest(request: any): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post(`http://localhost:8000/api/projects/${request.project_id}/access-requests/${request.id}/approve`, {}, { headers })
      .subscribe(response => {
        console.log('Demande approuvée', response);
        this.getRequests(); // Rafraîchir la liste après validation
      }, error => {
        console.error('Erreur lors de l\'approbation', error);
      });
  }

  // Rejeter une demande
  rejectRequest(request: any): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post(`http://localhost:8000/api/projects/${request.project_id}/access-requests/${request.id}/reject`, {}, { headers })
      .subscribe(response => {
        console.log('Demande rejetée', response);
        this.getRequests();
      }, error => {
        console.error('Erreur lors du rejet', error);
      });
  }
}
