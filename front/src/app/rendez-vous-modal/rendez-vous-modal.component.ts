import { Component, Inject, Input, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RendezVousService } from '../services/rendez-vous.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common'; // Import de CommonModule
import { MatDialogModule } from '@angular/material/dialog'; // Assurez-vous d'importer aussi MatDialogModule pour les modals
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rendez-vous-modal',
  templateUrl: './rendez-vous-modal.component.html',
  imports: [
    MatListModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDialogModule, 
    CommonModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  styleUrls: ['./rendez-vous-modal.component.scss']
})
export class RendezVousModalComponent {
  rendezVousList: any[] = [];
  form: FormGroup;
  isEditing: boolean = false;
  selectedRendezVous: any | null = null;
  @Input() rendezVous: any; // Données du rendez-vous
  userRole: string = ''; // Définit la propriété userRole
  // Tableau des heures disponibles (par exemple de 9h00 à 18h00)
  hours: string[] = [];

  // Date minimum possible pour la sélection
  minDate!: string;

  constructor(
    private dialogRef: MatDialogRef<RendezVousModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private rendezVousService: RendezVousService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      date_heure: ['', [Validators.required]],
      heure: ['', [Validators.required]],  // Contrôle pour l'heure
      message: ['', [Validators.maxLength(500)]]
    });

    this.loadRendezVous();
    this.generateHours();
    this.setMinDate();
  }
  ngOnInit(): void {
    this.getUserRole();
  }

  getUserRole(): void {
    this.userRole = this.authService.getUserRole(); // Récupère le rôle de l'utilisateur
  }

  // Générer les heures disponibles (par exemple de 9h00 à 18h00)
  generateHours() {
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = `${hour < 10 ? '0' : ''}${hour}:15`;
      this.hours.push(formattedHour);
    }
  }

  // Définir la date minimale pour la sélection
  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  // Format YYYY-MM-DD
  }

  loadRendezVous() {
    this.rendezVousService.getRendezVous(this.data.projectId).subscribe((rendezVous) => {
      console.log('Liste des rendez-vous:', rendezVous);  // Ajoutez ce log
      this.rendezVousList = rendezVous;
    });
  }
  
  startCreating() {
    this.isEditing = false;
    this.selectedRendezVous = null;
    this.form.reset();
  }

  startEditing(rendezVous: any) {
    this.isEditing = true;
    this.selectedRendezVous = rendezVous;
    this.form.patchValue(rendezVous);
  }

  submitForm() {
    if (this.form.invalid) return;

    const request = this.isEditing
      ? this.rendezVousService.updateRendezVous(this.selectedRendezVous.id, this.form.value)
      : this.rendezVousService.createRendezVous(this.data.projectId, this.form.value);

    request.subscribe(() => {
      this.loadRendezVous();
      this.form.reset();
      this.isEditing = false;
    });
  }
  acceptRendezVous(id: number): void {
    this.rendezVousService.acceptRendezVous(id).subscribe({
      next: () => {
        console.log('Rendez-vous accepté');
        this.loadRendezVous();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  
  rejectRendezVous(id: number): void {
    this.rendezVousService.rejectRendezVous(id).subscribe({
      next: () => {
        console.log('Rendez-vous refusé');
        this.loadRendezVous();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  deleteRendezVous(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) return;
  
    this.rendezVousService.deleteRendezVous(id).subscribe({
      next: () => {
        console.log('Rendez-vous supprimé');
        this.loadRendezVous();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  updateRendezVous(projectId: number) {
    if (this.form.invalid) {
      return;
    }
  
    const rendezVousId = this.selectedRendezVous.id; // Récupère l'ID du rendez-vous sélectionné
    const data = this.form.value;
  
    this.rendezVousService.updateRendezVous(rendezVousId, data).subscribe({
      next: (response) => {
        console.log('Rendez-vous mis à jour avec succès', response);
        this.rendezVousService.getRendezVous(projectId); // Rafraîchir la liste des rendez-vous
        this.close(); // Fermer le formulaire
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du rendez-vous', err);
      }
    });
  }
  
  close() {
    this.dialogRef.close();
  }
}
