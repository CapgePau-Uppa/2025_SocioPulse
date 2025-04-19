import { Component, Inject, Input, OnInit, LOCALE_ID, ViewEncapsulation   } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RendezVousService } from '../services/rendez-vous.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../services/auth.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import localeFr from '@angular/common/locales/fr';
import {ToastrService} from 'ngx-toastr';

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
    MatSelectModule,
    MatTabsModule,
    MatRadioModule
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
  @Input() rendezVous: any; // Appointment data
  userRole: string = ''; // Defines the userRole property
  noAvailabilityMessage: string = '';
  selectedDate: Date = new Date(); 

  // Array of available hours (from 9:00 AM to 6:00 PM)
  hours: string[] = [];

  // ['2025-04-08', '2025-04-10']
  availableDates: string[] = []; 

  // Minimum possible date for selection
  minDate!: string;

  // Selected date in the single appointment feature
  selectedDay = '';

  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  reorderedWeekDays = ['Lundi', 'Vendredi', 'Mardi', 'Samedi', 'Mercredi', 'Dimanche', 'Jeudi'];

  selectedDays: string[] = [];

  start_time: string = '';
  end_time: string = '';
  
  recurrenceOption: 'currentMonth' | 'currentAndNext' | 'customRange' = 'currentMonth';
  customStart: Date | null = null;
  customEnd: Date | null = null;
  tabIndex: number = 0;
  selectedRecurringOption: string = 'currentMonth';

  modeEdition = false;
  existingRendezVous: any = null;

  constructor(
    private dialogRef: MatDialogRef<RendezVousModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number, rendezVous?: any },
    private rendezVousService: RendezVousService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private toastr: ToastrService
  ) {
    
    this.dateAdapter.setLocale('fr-FR');
  
    this.form = this.fb.group({
      date_hour: ['', [Validators.required]],
      hour: ['', [Validators.required]],
      message: ['', [Validators.maxLength(500)]]
    });
  
    this.loadRendezVous();
    this.generateHours();
    this.setMinDate();
  }
  
  ngOnInit(): void {
    this.getUserRole();
    // Edition detection
    if (this.data.rendezVous) {
      this.isEditing = true;
      this.existingRendezVous = this.data.rendezVous; // On garde l'objet complet
      this.selectedDate = new Date(this.existingRendezVous.date);
      this.form.get('date_hour')?.setValue(this.selectedDate);
    }
    // Listener: call generateHours() whenever the date changes
    this.form.get('date_hour')?.valueChanges.subscribe((newDate) => {
      console.log("New selected date:", newDate);
      this.selectedDate = new Date(newDate);
      this.generateHours();
    });
    this.rendezVousService.getAvailabilities(this.data.projectId).subscribe({
      next: (availabilities) => {
        this.availableDates = availabilities.map((a: any) => a.availability_date);
        console.log("Available dates ON LOG:", this.availableDates);
      }
    });
  }

  getUserRole(): void {
    this.userRole = this.authService.getUserRole(); // Retrieves the user's role
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  saveAvailabilities() {
    if (this.start_time >= this.end_time) {
      this.toastr.error("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }
    const formattedDate = this.formatDate(this.selectedDate);
    const newStart = this.start_time;
    const newEnd = this.end_time;
  
    this.rendezVousService.getAvailabilities(this.data.projectId).subscribe({
      next: (availabilities) => {
        // Retrieve time slots for the selected day
        const existingForDate = availabilities.filter(a => a.availability_date === formattedDate);
  
        // Merge time slots
        const mergedSlots = this.mergeAvailabilitiesForDate(
          formattedDate,
          newStart,
          newEnd,
          existingForDate
        );
  
        // Send merged time slots (replacing only those for this day)
        const otherDays = availabilities.filter(a => a.availability_date !== formattedDate);
        const finalAvailabilities = [...otherDays, ...mergedSlots];
  
        // Send data to API
        this.rendezVousService.setAvailabilities(this.data.projectId, finalAvailabilities).subscribe(() => {
          this.toastr.success('Créneau sauvegardé avec succès !');
          this.dialogRef.close();
          this.generateHours(); // Reload visible time slots
        });
      },
      error: () => {
        this.toastr.error('Erreur lors de la récupération des disponibilités');
      }
    });
  }

  
  mergeAvailabilitiesForDate(date: string, newStart: string | null, newEnd: string | null, existingAvailabilities: any[]) {
    const slots = [...existingAvailabilities];
  
    if (newStart && newEnd) {
      slots.push({
        availability_date: date,
        start_time: newStart,
        end_time: newEnd
      });
    }
  
    slots.sort((a, b) => {
      const aStart = new Date(`${a.availability_date}T${a.start_time}`);
      const bStart = new Date(`${b.availability_date}T${b.start_time}`);
      return aStart.getTime() - bStart.getTime();
    });
  
    const merged: any[] = [];
    let current = slots[0];
  
    for (let i = 1; i < slots.length; i++) {
      const next = slots[i];
      if (next.start_time <= current.end_time) {
        // Fusion
        current.end_time = next.end_time > current.end_time ? next.end_time : current.end_time;
      } else {
        merged.push(current);
        current = next;
      }
    }
  
    merged.push(current);
    return merged;
  }

  
  // Retrieve company availabilities
  generateHours() {
    this.hours = []; // Reset hours
    this.noAvailabilityMessage = ''; // Reset unavailability message

    // Check if a date is properly selected
    const selectedDateValue = this.form.get('date_hour')?.value;
    if (!selectedDateValue) {
      this.noAvailabilityMessage = "Veuillez sélectionner une date.";
      return;
    }

    // Format the selected date to YYYY-MM-DD
    const selectedDate = new Date(selectedDateValue);
    const formattedDate = this.formatDate(this.selectedDate);
    
    console.log("Date formatée : ", formattedDate);

    // Check if an appointment has already been scheduled for that day
    this.rendezVousService.getRendezVousForDate(this.data.projectId, formattedDate).subscribe({
      next: existingRendezvous => {
        console.log("Rendez-vous existants pour cette date :", existingRendezvous);
    
        const hasOtherAppointments = existingRendezvous.some((rdv: any) => {
          // If we are in edit mode, ignore the appointment currently being edited 
          if (this.isEditing && this.existingRendezVous && rdv.id === this.existingRendezVous.id) {
            return false; // It's the same, not blocking
          }
          return true; // It's a different one, blocking
        });
    
        if (hasOtherAppointments) {
          this.noAvailabilityMessage = "Un rendez-vous a déjà été pris ce jour-là. Veuillez choisir une autre date.";
          this.hours = [];
          return;
        }
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Retrieve company availability for this project
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

            // Generate available hours
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

  applyRecurringSlots() {
    if (this.selectedDays.length === 0) {
      console.warn("Veuillez sélectionner au moins un jour.");
      return;
    }
    if (this.start_time >= this.end_time) {
      this.toastr.error("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }

    const availabilitiesToSend = [];
    const current = new Date(); // Current date to determine the month
    const currentMonth = current.getMonth();
    const currentYear = current.getFullYear();

    current.setHours(0, 0, 0, 0); // Reset time to midnight

    // Option: "This month only"
    let endMonthDate = new Date(currentYear, currentMonth + 1, 0); // Last day of the current month

    endMonthDate.setHours(0, 0, 0, 0); // Reset time to midnight

    // Option: "This month and next" (Adds one month to the current month)
    if (this.recurrenceOption === 'currentAndNext') {
      endMonthDate = new Date(currentYear, currentMonth + 2, 0); // Last day of the next month
    }

    // Format selected days to match .toLocaleDateString(..., { weekday: 'long' })
    const selectedDaysLower = this.selectedDays.map(day => day.toLowerCase());

    // Loop through all days of the selected month(s)
    while (current <= endMonthDate) {
      const dayName = current.toLocaleDateString('fr-FR', { weekday: 'long' });

      // If the day matches one of the selected days
      if (selectedDaysLower.includes(dayName.toLowerCase())) {
        const formattedDate = this.formatDate(current); // Format date as "YYYY-MM-DD"

        availabilitiesToSend.push({
          availability_date: formattedDate,
          start_time: this.start_time,
          end_time: this.end_time
        });
      }

      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    // If no time slots are generated
    if (availabilitiesToSend.length === 0) {
      console.warn("Aucun jour ne correspond aux jours sélectionnés.");
      return;
    }

    // Merge slots by day
    const slotsByDate: { [date: string]: any[] } = {};
    for (const slot of availabilitiesToSend) {
      if (!slotsByDate[slot.availability_date]) {
        slotsByDate[slot.availability_date] = [];
      }
      slotsByDate[slot.availability_date].push(slot);
    }

    let mergedAvailabilities: any[] = [];
    for (const date in slotsByDate) {
      const merged = this.mergeAvailabilitiesForDate(date, '', '', slotsByDate[date]);
      mergedAvailabilities = [...mergedAvailabilities, ...merged];
    }

    // Send time slots to the database
    this.rendezVousService.setAvailabilities(this.data.projectId, mergedAvailabilities).subscribe({
      next: () => {
        this.toastr.success('Slot saved successfully!');
        this.dialogRef.close();
        this.generateHours(); // Refresh displayed slots
      },
      error: (err) => {
        this.toastr.error('Error while saving availability');
        console.error("Error while saving availability:", err);
      }
    });
  }

  // Set the minimum date for selection
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

    console.log("Mode édition :", this.isEditing);
    console.log("Rendez-vous à modifier :", this.selectedRendezVous);

  
    const request = this.isEditing && this.selectedRendezVous?.id
    ? this.rendezVousService.updateRendezVous(this.selectedRendezVous.id, formData)
    : this.rendezVousService.createRendezVous(this.data.projectId, formData);
    this.selectedRendezVous = null;
    this.isEditing = false;
    
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

  // Switch to edit mode
  editRendezVous(rdv: any) {
    this.selectedRendezVous = rdv;
    this.isEditing = true;
    this.existingRendezVous = rdv;

    this.selectedDate = new Date(rdv.date);
    this.form.patchValue({
      date_hour: new Date(rdv.date),
      hour: rdv.heure,
      message: rdv.message
    });
  }
  
  // Appointment update
  updateRendezVous(projectId: number) {
    if (!this.selectedRendezVous || this.form.invalid) return;

    const updatedData = this.form.value;

    // Checks if modifying the same day to temporarily lift the constraint
    if (this.selectedRendezVous.date === updatedData.date) {
    }

    this.rendezVousService.updateRendezVous(this.selectedRendezVous.id, updatedData).subscribe({
      next: (res) => {
        console.log('Update successful', res);
        this.modeEdition = false;
        this.selectedRendezVous = null;
        this.form.reset();
        this.rendezVousService.getRendezVous(projectId); // Refresh list
      },
      error: (err) => console.error('Update error', err)
    });
  }
    
  highlightDates = (date: Date): string => {
    const formatted = this.formatDate(date); // format: "2025-04-14"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
  
    // If the date is available AND it is in the future or today
    if (this.availableDates.includes(formatted) && inputDate >= today) {
      return 'highlighted-date';
    }
  
    return 'unavailable-date';
  };
  
  close() {
    this.dialogRef.close();
  }  
}
