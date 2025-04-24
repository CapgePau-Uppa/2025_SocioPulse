import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Ajout du service MatDialog
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UpgradeDialogComponent } from '../upgrade-dialog/upgrade-dialog.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-profile-page',
  standalone: true, // ✅ Assurez-vous que le composant est bien autonome
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule, // ✅ Ajout du module MatDialogModule
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  role: string | null = null;

  private dialog = inject(MatDialog); // ✅ Injecte le service MatDialog correctement

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.email = sessionStorage.getItem('email');
    this.role = sessionStorage.getItem('role');
  }

  openUpgradeDialog(): void {
    const dialogRef = this.dialog.open(UpgradeDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Résultat du modal:', result);
        this.upgradeAccount(result);
      }
    });
  }

upgradeAccount(data: any): void {
  const userId = sessionStorage.getItem('user_id');
  const token = sessionStorage.getItem('auth_token');

  if (userId && token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('data', data);
    var payload: any;
    if(data.details.entreprise_id){
        payload = {
        user_id: userId,
        type: data.type,
        details: data.details,
        entreprise_id: data.details.entreprise_id.toString(),
      };
    }
    else{
      payload= {
        user_id: userId,
        type: data.type,
        details: data.details,
      };
    }


    // Définir role_id en fonction de la sélection du radioButton
    if (data.type === 'collectivity') {
      payload.role_id = '3'; // Role pour "Collectivité"
    } else if (data.type === 'enterprise') {
      payload.role_id = '4'; // Role pour "Entreprise"
    }

    // Ajouter le champ 'companyType' dans les détails si l'entreprise est nouvelle
    if (data.type === 'enterprise' && data.details.companyName === 'Autre') {
      payload.details.companyType = data.details.companyType;
    }

    // Afficher ce que l'on envoie dans le payload pour débogage
    console.log('Payload pour la mise à jour du compte:', payload);

    // Envoyer la requête HTTP avec le payload
    this.http.post('http://localhost:8000/api/upgradeRequete', payload, { headers })
      .subscribe(response => {
        console.log('Demande d\'amélioration de compte soumise pour validation', response);
        this.toastr.success('Demande d\'amélioration de compte soumise pour validation');
      }, error => {
        console.error('Erreur lors de l\'amélioration du compte', error);
        this.toastr.error('Erreur lors de la demande');
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
