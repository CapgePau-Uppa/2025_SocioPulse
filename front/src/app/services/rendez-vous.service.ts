import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private apiUrl = 'http://localhost:8000/api/projects';

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
    console.log('En-têtes utilisés pour la requête:', headers);
  
    return this.http.get<any>(`${this.apiUrl}/${projectId}/rendez-vous`, { headers });
  }

  // Get appointments for a specific project and date
  getRendezVousForDate(projectId: number, date: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(`Fetching appointments for project ${projectId} on ${date}`);
    return this.http.get<any>(`${this.apiUrl}/${projectId}/rendez-vous/${date}`, { headers });
  }
  
  // Create a new appointment for a project
  createRendezVous(projectId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const formattedData = {
      project_id: projectId,
      date: data.date,
      hour: data.hour,
      message: data.message
    };
    
    console.log("Données envoyées au backend :", formattedData);
    return this.http.post<any>(`${this.apiUrl}/${projectId}/rendez-vous`, formattedData, { headers });
  }

  // Update an existing appointment
  updateRendezVous(projectId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${projectId}/rendez-vous`, data, { headers });
  }

  // Delete an appointment
  deleteRendezVous(projectId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${projectId}/rendez-vous`, { headers });
  }

  acceptRendezVous(projectId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/rendez-vous/${projectId}/accept`, {}, { headers });
  }
  
  rejectRendezVous(projectId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/rendez-vous/${projectId}/reject`, {}, { headers });
  }

  getAvailabilities(projectId: number) {
    const headers = this.getAuthHeaders();
    console.log("Headers envoyés :", headers);
    return this.http.get<any[]>(`http://localhost:8000/api/availabilities/${projectId}`, { headers });
  }
  
  
  setAvailabilities(projectId: number, availabilities: any[]) {
    const headers = this.getAuthHeaders();
    console.log("SetAvailabilitie :", availabilities);
    return this.http.post(`http://localhost:8000/api/availabilities/${projectId}`, { availabilities }, { headers });
  }
  
   
}
