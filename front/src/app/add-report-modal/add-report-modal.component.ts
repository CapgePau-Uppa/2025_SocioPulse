import {Component, inject} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatError, MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatLabel} from '@angular/material/form-field';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-report-modal',
  standalone: true, // Angular 14+ standalone component
  imports: [MatError,
    FormsModule,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    MatButton,
    MatDialogActions,
    MatLabel,],
  templateUrl: './add-report-modal.component.html',
  styleUrl: './add-report-modal.component.scss'
})
export class AddReportModalComponent {
  name: string = '';
  selectedFile: File | null = null; // Variable pour stocker le fichier

  constructor(public dialogRef: MatDialogRef<AddReportModalComponent>) {}

  // Gère la sélection du fichier
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("Fichier sélectionné :", this.selectedFile);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Soumet le formulaire avec l'upload du fichier
  onSubmit(form: any): void {
    if (form.valid && this.selectedFile) {
      this.dialogRef.close({ name: this.name, file: this.selectedFile });
      console.log("Modal fermé avec :", { name: this.name, file: this.selectedFile });
    }
  }
}
