import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatError, MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatLabel} from '@angular/material/form-field';



@Component({
  selector: 'app-category-add-dialog',
  standalone: true,
  imports: [MatError,
    FormsModule,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    MatButton,
    MatDialogActions,
    MatLabel,],
  templateUrl: './category-add-dialog.component.html',
  styleUrls: ['./category-add-dialog.component.scss']
})
export class CategoryAddDialogComponent {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<CategoryAddDialogComponent>) {}
  onCancel(): void {
    this.dialogRef.close();
  }

  // Soumet le formulaire avec l'upload du fichier
  onSubmit(form: any): void {
    if (form.valid) {
      this.dialogRef.close({ name: this.name});
      console.log("Modal fermé avec :", { name: this.name});
    }
  }
}
