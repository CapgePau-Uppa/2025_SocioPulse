import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit{
  username: string | null = null;
  email: string | null = null;
  role: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.email = sessionStorage.getItem('email');
    this.role = sessionStorage.getItem('role');
  }

  upgradeAccount(): void {
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('auth_token');
    if (userId) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post('http://localhost:8000/api/upgradeRequete', { user_id: userId, role_id: '4' }, { headers })
        .subscribe(response => {
          console.log('Compte amélioré avec succès', response);
          // Ajoutez ici toute logique supplémentaire après l'amélioration du compte
        }, error => {
          console.error('Erreur lors de l\'amélioration du compte', error);
        });
    }
  }

  deleteAccount(): void {
    const userId = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('auth_token');
    if (userId && token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post('http://localhost:8000/api/deleteUser', { user_id: userId }, { headers })
        .subscribe(response => {
          console.log('Compte supprimé avec succès', response);
          sessionStorage.clear();
          this.router.navigate(['/']);
        }, error => {
          console.error('Erreur lors de la suppression du compte', error);
        });
    }
  }
}
