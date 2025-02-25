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

    isLoggedIn: boolean = false;
    userName: string | null = null;

    private http: HttpClient = inject(HttpClient);
    constructor(private dialog: MatDialog, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
      const userId = sessionStorage.getItem('user_id');
      if (userId) {
        this.isLoggedIn = true;
        this.userName = sessionStorage.getItem('username'); // Assurez-vous que le nom de l'utilisateur est stocké dans sessionStorage
      }
    }

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
            sessionStorage.setItem('user_id', response.user.id);
            sessionStorage.setItem('username', response.user.name);
            console.log('Connexion réussie affichage données front:', response);
            const userId = sessionStorage.getItem('user_id');
            console.log('Nom de l\'utilisateur:', userId);
            if (userId) {
              this.isLoggedIn = true;
              this.userName = sessionStorage.getItem('username'); // Assurez-vous que le nom de l'utilisateur est stocké dans sessionStorage
              console.log('Nom de l\'utilisateur:', this.userName);
            }
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
    logout(): void {
        sessionStorage.clear();
        this.isLoggedIn = false;
        this.userName = null;
        this.router.navigate(['/']);
    }

    @Input() sidenav!: MatSidenav;
        toggleSidenav() {
            this.sidenav.toggle();
    }

}
