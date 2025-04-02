import { Component, Inject, Input, OnInit  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RendezVousService } from '../services/rendez-vous.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    FormsModule,
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
  noAvailabilityMessage: string = ''; // Message d'indisponibilité
  selectedDate: string = ''; // Initialisation de la variable

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
      date_hour: ['', [Validators.required]],
      hour: ['', [Validators.required]],  // Contrôle pour l'heure
      message: ['', [Validators.maxLength(500)]]
    });

    this.loadRendezVous();
    this.generateHours();
    this.setMinDate();
  }
  ngOnInit(): void {
    this.getUserRole();
    // Écouteur : appeler generateHours() dès que la date change
    this.form.get('date_hour')?.valueChanges.subscribe((newDate) => {
      console.log("Nouvelle date sélectionnée :", newDate);
      this.generateHours();
    });
  }

  getUserRole(): void {
    this.userRole = this.authService.getUserRole(); // Récupère le rôle de l'utilisateur
  }

  selectedDay = '';
  start_time = '';
  end_time = '';
  
  saveAvailabilities() {
    const newAvailabilities = {
      availability_date: this.selectedDate,
      start_time: this.start_time, 
      end_time: this.end_time
    };
    
  
    this.rendezVousService.setAvailabilities(this.data.projectId, [newAvailabilities]).subscribe(() => {
      console.log("Disponibilité ajoutée !");
      this.generateHours();
    });
  }

// Récupérer les dispos de l'entreprise
generateHours() {
  this.hours = []; // Réinitialiser les heures
  this.noAvailabilityMessage = ''; // Réinitialiser le message d'indisponibilité

  // Vérifier si une date est bien sélectionnée
  const selectedDateValue = this.form.get('date_hour')?.value;
  if (!selectedDateValue) {
    this.noAvailabilityMessage = "Veuillez sélectionner une date.";
    return;
  }

  // Formater la date sélectionnée en YYYY-MM-DD
  const selectedDate = new Date(selectedDateValue);
  const selectedDateFormatted = selectedDate.toISOString().split('T')[0];

  console.log("Date formatée :", selectedDateFormatted);

  // Vérifier si un rendez-vous a déjà été pris ce jour-là
  this.rendezVousService.getRendezVousForDate(this.data.projectId, selectedDateFormatted).subscribe({
    next: existingRendezvous => {
      console.log("Rendez-vous existants pour cette date :", existingRendezvous);
      if (existingRendezvous.length > 0) {
        this.noAvailabilityMessage = "Un rendez-vous a déjà été pris ce jour-là. Veuillez choisir une autre date.";
        this.hours = []; // Supprimer tous les créneaux horaires
        return;
      }

      // Récupérer les disponibilités de l'entreprise pour ce projet
      this.rendezVousService.getAvailabilities(this.data.projectId).subscribe({
        next: availabilities => {
          if (!availabilities || availabilities.length === 0) {
            this.noAvailabilityMessage = "Aucune disponibilité trouvée pour ce projet.";
            return;
          }

          // Filtrer les disponibilités pour la date exacte
          const dayDisponibilites = availabilities.filter(available => {
            const dispoDateFormatted = new Date(available.availability_date).toISOString().split('T')[0];
            return dispoDateFormatted === selectedDateFormatted;
          });

          if (dayDisponibilites.length === 0) {
            this.noAvailabilityMessage = `Aucune disponibilité pour le ${selectedDateFormatted}.`;
            return;
          }

          // Générer les heures disponibles
          dayDisponibilites.forEach(available => {
            let startHour = parseInt(available.start_time.split(':')[0], 10);
            let startMinutes = parseInt(available.start_time.split(':')[1], 10);
            let endHour = parseInt(available.end_time.split(':')[0], 10);
            let endMinutes = parseInt(available.end_time.split(':')[1], 10);

            let startDate = new Date(selectedDate);
            startDate.setHours(startHour, startMinutes);

            let endDate = new Date(selectedDate);
            endDate.setHours(endHour, endMinutes);

            while (startDate < endDate) {
              let hour = startDate.getHours();
              let minutes = startDate.getMinutes();
              this.hours.push(`${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`);
              startDate.setMinutes(startDate.getMinutes() + 30);
            }
          });

          if (this.hours.length === 0) {
            this.noAvailabilityMessage = `Aucune heure disponible pour le ${selectedDateFormatted}.`;
          }
        },
        error: err => {
          console.error("Erreur lors de la récupération des disponibilités", err);
          this.noAvailabilityMessage = "Une erreur s'est produite lors de la récupération des disponibilités.";
        }
      });
    },
    error: err => {
      console.error("Erreur lors de la récupération des rendez-vous existants", err);
      this.noAvailabilityMessage = "Impossible de vérifier les rendez-vous existants.";
    }
  });
}

  // Définir la date minimale pour la sélection
  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];  // Format YYYY-MM-DD
  }

  loadRendezVous() {
    this.rendezVousService.getRendezVous(this.data.projectId).subscribe((rendezVous) => {
      console.log('Liste des rendez-vous:', rendezVous);
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
    if (this.form.invalid) {
      console.error("Le formulaire est invalide", this.form.errors);
      return;
    }
  
    console.log("Données envoyées :", this.form.value); // Vérifie les données avant l'envoi
  
    const request = this.isEditing
      ? this.rendezVousService.updateRendezVous(this.selectedRendezVous.id, this.form.value)
      : this.rendezVousService.createRendezVous(this.data.projectId, this.form.value);
  
    request.subscribe({
      next: response => {
        console.log("Réponse serveur :", response);
        this.loadRendezVous(); // Recharge la liste des rendez-vous
        this.form.reset();
        this.isEditing = false;
      },
      error: err => {
        console.error("Erreur lors de la prise de rendez-vous :", err.error);
      }
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
  
    const rendezVousId = this.selectedRendezVous.id;
    const data = this.form.value;
  
    this.rendezVousService.updateRendezVous(rendezVousId, data).subscribe({
      next: (response) => {
        console.log('Rendez-vous mis à jour avec succès', response);
        this.rendezVousService.getRendezVous(projectId); // Rafraîchir la liste des rendez-vous
        this.close();
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
