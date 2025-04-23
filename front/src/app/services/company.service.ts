import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('User is not authenticated');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCompanies() {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/entreprises`, { headers });
  }

  getUpgradeRequests() {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/upgradeRequests`, { headers });
  }
  
  approveUpgradeRequest(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/upgradeRequests/${id}/approve`, {}, { headers });
  }
  
  rejectUpgradeRequest(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/upgradeRequests/${id}/reject`, {}, { headers });
  }
  
}
