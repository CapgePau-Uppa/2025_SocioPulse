import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deplacer-report-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './deplacer-report-dialog.component.html',
  styleUrls: ['./deplacer-report-dialog.component.scss']
})
export class DeplacerReportDialogComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<DeplacerReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: any },
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>(`http://127.0.0.1:8000/api/projects/${this.data.report.project_id}/category_reports`, { headers })
      .subscribe(
        (categories) => {
          this.categories = categories;
          console.log('Catégories chargées:', this.categories);
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
  }

  onMove(): void {
    if (!this.selectedCategoryId) {
      this.toastr.warning('Veuillez sélectionner une catégorie.');
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      category_id: this.selectedCategoryId
    };

    this.http.put(`http://127.0.0.1:8000/api/reports/${this.data.report.id}`, body, { headers })
      .subscribe(
        () => {
          this.toastr.success('Rapport déplacé avec succès !');
          this.dialogRef.close('updated');
        },
        (error) => {
          console.error('Erreur lors du déplacement du rapport', error);
          this.toastr.error('Erreur lors du déplacement du rapport.');
        }
      );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
