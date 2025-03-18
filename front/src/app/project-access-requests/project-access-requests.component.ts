import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-project-access-requests',
  imports: [
    MatButtonModule,
    CommonModule,
    MatButton,
    MatCardModule
  ],
  templateUrl: './project-access-requests.component.html',
  styleUrls: ['./project-access-requests.component.scss']
})
export class ProjectAccessRequestsComponent implements OnInit {
  requests: any[] = [];
  role: string = '';
  user_id: string = '';
  entreprise_id: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUserData();
    this.getRequests();
  }

  // Récupérer les informations de l'utilisateur (rôle, entreprise_id, etc.)
getUserData(): void {
  this.role = sessionStorage.getItem('role') || '';
  this.user_id = sessionStorage.getItem('user_id') || '';
  this.entreprise_id = Number(sessionStorage.getItem('entreprise_id')) || 0;

  console.log('Utilisateur connecté - Role:', this.role);
  console.log('ID utilisateur:', this.user_id);
  console.log('ID entreprise:', this.entreprise_id);
}


  // Récupérer les demandes d'accès aux projets en fonction du rôle de l'utilisateur
  getRequests(): void {
    if (this.requests.length > 0) {
      return; // Si les demandes sont déjà récupérées, on ne les récupère pas à nouveau
    }
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // L'API doit renvoyer les demandes d'accès en fonction du rôle et de l'entreprise
    this.http.get<any[]>('http://localhost:8000/api/projects/access-requests', { headers })
      .subscribe(
        (requests) => {
          console.log('Données récupérées :', requests);
          this.requests = requests;  // Les projets sont déjà inclus dans la réponse

          // Maintenant chaque request contient son projet, tu peux l'afficher directement
          this.requests.forEach(request => {
            console.log('Projet associé à la demande :', request.project);
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des demandes', error);
          // Optionnel : afficher un message d'erreur utilisateur
          alert('Une erreur est survenue lors de la récupération des demandes.');
        }
      );
  }

  // Vérifier si l'utilisateur peut approuver/refuser une demande
  isAuthorizedToManageRequests(request: any): boolean {
    console.log('Type de this.entreprise_id:', typeof this.entreprise_id);
    console.log('Type de request.project.entreprise_id:', typeof request.project.entreprise_id);

    // Convertir en nombre et comparer
    const entrepriseIdFromSession = Number(this.entreprise_id);
    const entrepriseIdFromRequest = Number(request.project.entreprise_id);
    console.log('Comparaison:', entrepriseIdFromSession === entrepriseIdFromRequest);

    // Vérifie si c'est un admin ou un utilisateur lié à l'entreprise du projet
    const isAuthorized = this.role === 'administrator' || entrepriseIdFromSession === entrepriseIdFromRequest;
    console.log('isAuthorized:', isAuthorized);
    return isAuthorized;
  }

  // Approuver une demande
  approveRequest(request: any): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8000/api/projects/${request.project_id}/access-requests/${request.id}/approve`, {}, { headers })
      .subscribe(response => {
        console.log('Demande approuvée', response);

        // Supprimer ou mettre à jour la demande dans la liste locale
        this.requests = this.requests.filter(r => r.id !== request.id); // Supprimer la demande acceptée
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

        // Supprimer ou mettre à jour la demande dans la liste locale
        this.requests = this.requests.filter(r => r.id !== request.id); // Supprimer la demande rejetée
      }, error => {
        console.error('Erreur lors du rejet', error);
      });
  }

}
