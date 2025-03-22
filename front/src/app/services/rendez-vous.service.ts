import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private apiUrl = 'http://localhost:8000/api/projects';  // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('User is not authenticated');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get appointments for a specific project
  getRendezVous(projectId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('En-têtes utilisés pour la requête:', headers);  // Ajoutez ce log pour vérifier les en-têtes
  
    return this.http.get<any>(`${this.apiUrl}/${projectId}/rendez-vous`, { headers });
  }
  
  // Create a new appointment for a project
  createRendezVous(projectId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${projectId}/rendez-vous`, data, { headers });
  }

  // Update an existing appointment
  updateRendezVous(id: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/rendez-vous/${id}`, data, { headers });
  }

  // Delete an appointment
  deleteRendezVous(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}/rendez-vous`, { headers });
  }

  acceptRendezVous(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/rendez-vous/${id}/accept`, {}, { headers });
  }
  
  rejectRendezVous(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/rendez-vous/${id}/reject`, {}, { headers });
  }
   
}
