import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private baseUrl = 'http://localhost:8000/api';
    private tokenKey = 'auth_token'; // Clé pour stocker le token

    constructor(private http: HttpClient) {}

    // Login : Envoie email & password, stocke le token
    async login(email: string, password: string): Promise<any> {
        return await firstValueFrom(this.http.post(`${this.baseUrl}/login`, { email, password }));
    }

        // Inscription : Envoie nom, email & password
    register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, { name, email, password, password_confirmation });
    }

    // Ajouter le token dans les en-têtes HTTP pour les requêtes sécurisées
    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        if (token) {
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
        }
        return new HttpHeaders(); // Si pas de token, pas d'en-têtes
    }

    // Stocker le token
    setToken(token: string): void {
            sessionStorage.setItem(this.tokenKey, token);
    }

    // Récupérer le token
    getToken(): string | null {
            return sessionStorage.getItem(this.tokenKey);
    }

    // Supprimer le token
    removeToken(): void {
            sessionStorage.removeItem(this.tokenKey);
    }

}

