import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://127.0.0.1:8000/api';
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient) {}

    // Ajouter le token dans les en-têtes HTTP pour les requêtes sécurisées
    private getAuthHeaders(): HttpHeaders {
        const token = sessionStorage.getItem('auth_token');
        const role = sessionStorage.getItem('role'); // Récupération du rôle
    
        let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        if (role) {
          headers = headers.set('role', role); // Ajout du rôle dans les headers
        }
        return headers;
      }
    
    // Récupérer le token
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }
    
    getRoles(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/roles`, { headers });
      }

    getUsers(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/users`, { headers });
      }

    updateUserRole(userId: number, roleId: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role_id: roleId }, { headers });
      }

      getPermissions(roleId: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}/roles/${roleId}/permissions`, { headers });
      }

    updateRolePermissions(roleId: number, permissions: number[]): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.put(`${this.apiUrl}/roles/${roleId}/permissions`, { permissions }, { headers });
      }
    

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${userId}`);
    }
}
