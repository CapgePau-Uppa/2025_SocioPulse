import { Component, Inject, Input, OnInit, LOCALE_ID, ViewEncapsulation   } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RendezVousService } from '../services/rendez-vous.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, registerLocaleData } from '@angular/common'; // Import de CommonModule
import { MatDialogModule } from '@angular/material/dialog'; // Assurez-vous d'importer aussi MatDialogModule pour les modals
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  encapsulation: ViewEncapsulation.None,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  styleUrls: ['./rendez-vous-modal.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class RendezVousModalComponent {
  rendezVousList: any[] = [];
  form: FormGroup;
  isEditing: boolean = false;
  selectedRendezVous: any | null = null;
  @Input() rendezVous: any; // Données du rendez-vous
  userRole: string = ''; // Définit la propriété userRole
  noAvailabilityMessage: string = ''; // Message d'indisponibilité
  selectedDate: Date = new Date(); // Initialisation de la variable
  // Tableau des heures disponibles (par exemple de 9h00 à 18h00)
  hours: string[] = [];
  availableDates: string[] = []; // ex: ['2025-04-08', '2025-04-10', ...]

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
      this.selectedDate = new Date(newDate);
      this.generateHours();
    });
    this.rendezVousService.getAvailabilities(this.data.projectId).subscribe({
      next: (availabilities) => {
        this.availableDates = availabilities.map((a: any) => a.availability_date);
        console.log("Dates disponibles ON LOG :", this.availableDates);
      }
    });
  }

  getUserRole(): void {
    this.userRole = this.authService.getUserRole(); // Récupère le rôle de l'utilisateur
  }

  selectedDay = '';
  start_time = '';
  end_time = '';
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  saveAvailabilities() {
    const formattedDate = this.formatDate(this.selectedDate);
    const newAvailabilities = {
      availability_date: formattedDate,
      start_time: this.start_time, 
      end_time: this.end_time
    };
     
    this.rendezVousService.setAvailabilities(this.data.projectId, [newAvailabilities]).subscribe(() => {
      console.log("Disponibilité ajoutée !");
      this.generateHours();
    });
    if (!confirm('Disponibilité ajoutée !')) return;
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
  const formattedDate = this.formatDate(this.selectedDate);
  
  console.log("Date formatée : ", formattedDate);

  // Vérifier si un rendez-vous a déjà été pris ce jour-là
  this.rendezVousService.getRendezVousForDate(this.data.projectId, formattedDate).subscribe({
    next: existingRendezvous => {
      console.log("Rendez-vous existants pour cette date :", existingRendezvous);
      if (existingRendezvous.length > 0) {
        this.noAvailabilityMessage = "Un rendez-vous a déjà été pris ce jour-là. Veuillez choisir une autre date.";
        this.hours = []; // Supprimer tous les créneaux horaires
        return;
      }
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      // Récupérer les disponibilités de l'entreprise pour ce projet
      this.rendezVousService.getAvailabilities(this.data.projectId).subscribe({
        next: availabilities => {
          if (!availabilities || availabilities.length === 0) {
            this.noAvailabilityMessage = "Aucune disponibilité trouvée pour ce projet.";
            return;
          }

          console.log('formattedDate (from selected):', formattedDate);
          console.log('availability_date (from API):', availabilities.map(a => a.availability_date));
          const dayDisponibilites = availabilities.filter(available => {
            return available.availability_date === formattedDate;
          });

          if (dayDisponibilites.length === 0) {
            this.noAvailabilityMessage = `Aucune disponibilité pour le ${formattedDate}.`;
            return;
          }

          // Générer les heures disponibles
          dayDisponibilites.forEach(available => {
            let startHour = parseInt(available.start_time.split(':')[0], 10);
            let startMinutes = parseInt(available.start_time.split(':')[1], 10);
            let endHour = parseInt(available.end_time.split(':')[0], 10);
            let endMinutes = parseInt(available.end_time.split(':')[1], 10);

            let startDate = new Date(formattedDate);
            startDate.setHours(startHour, startMinutes);

            let endDate = new Date(formattedDate);
            endDate.setHours(endHour, endMinutes);

            while (startDate < endDate) {
              let hour = startDate.getHours();
              let minutes = startDate.getMinutes();
              this.hours.push(`${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`);
              startDate.setMinutes(startDate.getMinutes() + 30);
            }
          });

          if (this.hours.length === 0) {
            this.noAvailabilityMessage = `Aucune heure disponible pour le ${formattedDate}.`;
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
  
    const formattedDate = this.formatDate(this.selectedDate); // YYYY-MM-DD
    const formData = {
      ...this.form.value,
      date: formattedDate
    };
  
    console.log("Données envoyées au backend SubmitForm :", {
      project_id: this.data.projectId,
      ...formData
    });
  
    const request = this.isEditing
      ? this.rendezVousService.updateRendezVous(this.selectedRendezVous.id, formData)
      : this.rendezVousService.createRendezVous(this.data.projectId, formData);
  
    request.subscribe({
      next: response => {
        console.log("Réponse serveur :", response);
        this.loadRendezVous();
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
  
  highlightDates = (date: Date): string => {
    const formatted = this.formatDate(date); // "YYYY-MM-DD"
    return this.availableDates.includes(formatted) ? 'highlighted-date' : 'unavailable-date';
  };
  
  

  close() {
    this.dialogRef.close();
  }
}
