import {Component, inject} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {HttpClient} from '@angular/common/http';
import {MatSidenav,MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbarRow} from '@angular/material/toolbar';
interface AuthResponse {
  token: string;
  name: string;
  user_id: string;
}


@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbar,
    RouterLink,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    MatAnchor,
    MatIcon,
    MatIconButton,
    MatSidenavContent,
    MatSidenav,
    MatToolbarRow,
    RouterOutlet
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private http: HttpClient = inject(HttpClient);
  constructor(private dialog: MatDialog) {}

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
}
