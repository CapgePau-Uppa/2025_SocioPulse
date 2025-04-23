import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Ajout pour gérer l'upload
import { AddReportModalComponent } from '../add-report-modal/add-report-modal.component';
import { ProjectsService } from '../services/projects.service';
import {ToastrService} from 'ngx-toastr';
import { CategoryAddDialogComponent } from '../category-add-dialog/category-add-dialog.component';
import { DeplacerReportDialogComponent } from '../deplacer-report-dialog/deplacer-report-dialog.component'; // adapte le chemin selon ton projet
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-repport-page',
  templateUrl: './project-repport-page.component.html',
  styleUrl: './project-repport-page.component.scss',
  imports: [
    MatButtonModule,
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatIcon
  ]
})
export class ProjectRepportPageComponent implements OnInit {
  project: any;
  reports: any[] = [];
  name: string = '';
  categories: any[] = [];

  constructor(private toastr: ToastrService,private route: ActivatedRoute, private projectsService: ProjectsService, private dialog: MatDialog, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.projectsService.getProjects().subscribe(data => {
      this.project = data.find(project => project.id === projectId);
      if (this.project) {
        this.loadReports(this.project.id);
        this.loadCategories(this.project.id);
      } else {
        console.error('Projet non trouvé');
      }
    });
    console.log(this.categories);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddReportModalComponent, {
      width: '400px'
    });
    console.log(this)
    console.log(this.project.id);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.file) {
        console.log('Données du formulaire:', result);

        this.name = result.name;
        this.uploadFile(result.name, result.file);
      } else {
        console.log('La dialog a été fermée sans soumission.');
      }
    });
  }

  openDialog2(): void {
    const dialogRef = this.dialog.open(CategoryAddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        console.log('Données du formulaire:', result);

        this.name = result.name;
        this.createCategory(result.name);
      } else {
        console.log('La dialog a été fermée sans soumission.');
      }
    });
  }

  openPdf(filePath: string): void {
    if (!filePath) {
      console.error('filePath is undefined or empty');
      return;
    }

    const fileName = filePath.split('/').pop();
    if (!fileName) {
      console.error('Unable to extract file name from filePath:', filePath);
      return;
    }

    const fullPath = `http://127.0.0.1:8000/api/reports/file/${encodeURIComponent(fileName)}`;
    window.open(fullPath, '_blank');
  }



  uploadFile(name: string, file: File): void {
    const token = sessionStorage.getItem('auth_token');
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('project_id', this.project.id);
    console.log(this.categories);
    const categoryId = this.categories[0].id;
    console.log(categoryId);
    formData.append('category_id', categoryId); // Remplacez par la catégorie souhaitée
    this.http.post<{ path: string }>('http://127.0.0.1:8000/api/upload', formData).subscribe(
      (response) => {
        console.log("Upload réussi :", response);
        this.reports.push(`${name} (${response.path})`);
        this.toastr.success('Rapport ajouté avec succès !');
      },
      (error) => {
        console.error("Erreur lors de l'upload :", error);
      }
    );
  }
  loadReports(projectId: number): void {
    const token = sessionStorage.getItem('auth_token');

    if (!token) {
      console.error('Utilisateur non authentifié');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://127.0.0.1:8000/api/projects/${projectId}/reports`, { headers })
      .subscribe(reports => {
        this.reports = reports;
        console.log('Rapports récupérés:', this.reports);
      }, error => {
        console.error('Erreur lors de la récupération des rapports', error);
        this.reports = [];
      });
  }

  loadCategories(projectId: number): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://127.0.0.1:8000/api/projects/${projectId}/category_reports`, { headers })
      .subscribe(categories => {
        this.categories = categories;
        console.log('Rapports récupérés:', this.categories);
      }, error => {
        console.error('Erreur lors de la récupération des rapports', error);
        this.categories = [];
      });
  }

  createCategory(name: string): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const data = {
      name: name,
      project_id: this.project.id
    };

    this.http.post<{ path: string }>('http://127.0.0.1:8000/api/projects/${projectId}/category_reports', data, { headers })
      .subscribe(
        (response) => {
          console.log('Catégorie créée avec succès:', response);
          this.toastr.success('Catégorie ajoutée avec succès !');
        },
        (error) => {
          console.error('Erreur lors de la création de la catégorie:', error);
          this.toastr.error('Erreur lors de l\'ajout de la catégorie.');
        }
      );
  }

  deleteCategory(categoryId: number): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http.delete(`http://127.0.0.1:8000/api/category_reports/${categoryId}`, { headers })
      .subscribe(
        () => {
          console.log('Catégorie supprimée avec succès');
          this.toastr.success('Catégorie supprimée avec succès !');
          // Optionnel : actualiser la liste des catégories ou déclencher une autre action
        },
        (error) => {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          this.toastr.error('Erreur lors de la suppression de la catégorie.');
        }
      );
  }

  deleteReport(reportId: number): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.delete(`http://127.0.0.1:8000/api/reports/${reportId}`, { headers })
      .subscribe(
        () => {
          this.toastr.success('Rapport supprimé avec succès !');
          //this.loadReports(); // méthode à créer si tu veux rafraîchir
        },
        (error) => {
          console.error('Erreur lors de la suppression du rapport:', error);
          this.toastr.error('Erreur lors de la suppression du rapport.');
        }
      );
  }

  openDialog3(report: any): void {
    const dialogRef = this.dialog.open(DeplacerReportDialogComponent, {
      width: '400px',
      data: { report: report }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.toastr.success('Rapport déplacé avec succès !');
        //this.loadReports(); // recharger les rapports si nécessaire
      }
    });
  }

}
