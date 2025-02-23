import {Component, inject, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatSidenav} from '@angular/material/sidenav';
import {MatIcon} from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
/*
interface AuthResponse {
  token: string;
  name: string;
  user_id: string;
}*/
@Component({
	selector: 'app-navbar',
	imports: [
		RouterLink,
		MatToolbar,
		MatAnchor,
		MatButton,
		MatIcon
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
	private http: HttpClient = inject(HttpClient);
	constructor(private dialog: MatDialog, private authService: AuthService, private router: Router) {}

  /*
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Données du formulaire:', result);
        this.http.post<AuthResponse>('http://localhost:8000/api/login', result)
          .subscribe(response => {
            const token = response['token'];
            const username = response['name'];
            const user_id = response['user_id'];
            console.log('Token:', token);
            console.log('Nom:', username);
            console.log('ID utilisateur:', user_id);
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('user_id',user_id);
            sessionStorage.setItem('username', username); // Place the token in sessionStorage
          });
      } else {
        console.log('La dialog a été fermée sans soumission.');
      }
    });
  }
*/

	openDialog(): void {
	const dialogRef = this.dialog.open(LoginModalComponent, {
		width: '400px'
	});

		dialogRef.afterClosed().pipe().subscribe(async result => {
		if (result) {
			console.log('Données du formulaire:', result);
			try {
			const response = await this.authService.login(result.email, result.password);
			sessionStorage.setItem('auth_token', response.token);
			sessionStorage.setItem('user_id', response.user_id);
			sessionStorage.setItem('username', response.name);
			console.log('Connexion réussie:', response);
			this.router.navigate(['/']); // Redirection après connexion
			} catch (error) {
			console.error('Erreur de connexion', error);
			}
		} else {
				console.log('La dialog a été fermée sans soumission.');
			}
		});
	}

	checkAccess() {
		this.authService.checkSecureData();
	}

	@Input() sidenav!: MatSidenav;
		toggleSidenav() {
			this.sidenav.toggle();
	}

}
