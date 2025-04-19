import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss']
})
export class RatingDialogComponent {
  criteres = [
    { label: 'Respect de l’engagement', key: 'engagement' },
    { label: 'Valeur sociétale', key: 'valeur_societale' },
    { label: 'Impact écologique', key: 'impact_ecologique' },
    { label: 'Création d\'emploi', key: 'creation_emploi' }
  ];

  ratings: { [key: string]: number } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    private ratingService: RatingService
  ) {}

  rate(value: number, critereKey: string) {
    this.ratings[critereKey] = value;
  }

  submitRating() {
    const payload = {
      project_id: this.data.projectId,
      engagement_rating: this.ratings['engagement'] || 0,
      societal_value_rating: this.ratings['valeur_societale'] || 0,
      ecological_impact_rating: this.ratings['impact_ecologique'] || 0,
      job_creation_rating: this.ratings['creation_emploi'] || 0,
    };

    this.ratingService.addRating(payload).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
