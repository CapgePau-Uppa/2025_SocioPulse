import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private baseUrl = 'http://localhost:8000/api';
    private tokenKey = 'auth_token'; // Clé pour stocker le token

    constructor(private http: HttpClient) {}

    // 1. Login : Envoie email & password, stocke le token
    async login(email: string, password: string): Promise<any> {
      return await firstValueFrom(this.http.post(`${this.baseUrl}/login`, { email, password }));
    }

    // 2. Vérifie si l'utilisateur est connecté
    isAuthenticated(): boolean {
        return localStorage.getItem(this.tokenKey) !== null;
    }

    // 3. Récupère l'utilisateur connecté
    getUser(): Observable<any> {
        return this.http.get(`${this.baseUrl}/user`, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        });
    }

    // 4. Déconnexion : Supprime le token localement
    logout(): Observable<any> {
        return this.http.post(`${this.baseUrl}/logout`, {}, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        });
    }

    // 5. Stocker le token
    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    // 6. Récupérer le token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // 7. Supprimer le token
    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    // 8. Inscription : Envoie nom, email & password
    register(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, { name, email, password, password_confirmation });
    }

	// 9. Test route sécurisée
	async checkSecureData(): Promise<any> {
		const token = sessionStorage.getItem('auth_token');
	
		if (!token) {
			console.error('Aucun token trouvé');
			return;
		}
	
		try {
			const response = await firstValueFrom(
				this.http.get(`${this.baseUrl}/secure-data`, {
					headers: new HttpHeaders({
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json', // 🔥 Ajout du Content-Type
						'Accept': 'application/json' // 🔥 S'assure que le serveur envoie bien du JSON
					})
				})
			);
			console.log('Données sécurisées:', response);
		} catch (error) {
			console.error('Accès refusé', error);
		}
	}	
}
