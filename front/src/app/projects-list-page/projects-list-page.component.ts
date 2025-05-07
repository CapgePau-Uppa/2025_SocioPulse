import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../services/projects.service';
import { MatError, MatFormField, MatLabel, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-projects-list-page',
  templateUrl: './projects-list-page.component.html',
  styleUrls: ['./projects-list-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatHint,
    MatDateRangeInput,
    MatDateRangePicker,
    MatError,
    MatSuffix,
    FormsModule
  ]
})
export class ProjectsListPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'notation_general','department', 'city', 'description', 'volet_relance', 'mesure', 'filiere', 'created_at', 'status'];
  projects: any[] = [];
  sortedByNewest: boolean = false;
  originalProjects: any[] = [];
  isFiltered: boolean = false;
  searchTerm: string = '';

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  toggleSort(): void {
    this.sortedByNewest = !this.sortedByNewest;

    if (this.sortedByNewest) {
      this.projects = [...this.projects].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Restaurer l'ordre original tout en maintenant les filtres de date si actifs
      this.projects = [...this.originalProjects];
      if (this.isFiltered) {
        this.applyDateFilter();
      }
    }
  }

  applyDateFilter(): void {
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;

    if (!startDate || !endDate) {
      return;
    }

    // Ajuster la date de fin pour inclure tout le jour
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    // Si une recherche est active, filtrer à partir des résultats de recherche
    // Sinon, filtrer à partir de l'original
    let projectsToFilter = this.searchTerm ?
      this.originalProjects.filter(project =>
        (project.name && project.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (project.city && project.city.toLowerCase().includes(this.searchTerm.toLowerCase()))
      ) : this.originalProjects;

    this.projects = projectsToFilter.filter(project => {
      const projectDate = new Date(project.created_at);
      return projectDate >= startDate && projectDate <= adjustedEndDate;
    });

    this.isFiltered = true;

    // Maintenir le tri si actif
    if (this.sortedByNewest) {
      this.projects = [...this.projects].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

// Modifier clearDateFilter pour préserver la recherche
  clearDateFilter(): void {
    this.range.reset();
    this.isFiltered = false;

    // Si une recherche est active, réappliquez-la
    if (this.searchTerm) {
      this.applySearch();
    } else {
      this.projects = [...this.originalProjects];

      // Maintenir le tri si actif
      if (this.sortedByNewest) {
        this.projects = [...this.projects].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }
  }
  constructor(private router: Router, private projectService: ProjectsService) {
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.originalProjects = [...data]; // Store original order
      this.projects = data;
      console.log(this.projects);
    });
    console.log(this.projects);
  }

  ngOnInit(): void {
    this.loadProjects();
    
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      // Si la recherche est vide, réinitialisez à l'état actuel
      this.projects = [...this.originalProjects];

      // Appliquez à nouveau les filtres actifs si nécessaire
      if (this.isFiltered) {
        this.applyDateFilter();
      }

      if (this.sortedByNewest) {
        this.toggleSort();
        this.toggleSort(); // Double appel pour restaurer l'état
      }
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtrer d'abord depuis l'état original
    let filteredProjects = this.originalProjects.filter(project =>
      (project.name && project.name.toLowerCase().includes(searchTermLower)) ||
      (project.description && project.description.toLowerCase().includes(searchTermLower)) ||
      (project.city && project.city.toLowerCase().includes(searchTermLower))
    );

    this.projects = filteredProjects;

    // Appliquer à nouveau les autres filtres si nécessaire
    if (this.isFiltered) {
      const startDate = this.range.value.start;
      const endDate = this.range.value.end;

      if (startDate && endDate) {
        // Ajuster la date de fin pour inclure tout le jour
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        this.projects = this.projects.filter(project => {
          const projectDate = new Date(project.created_at);
          return projectDate >= startDate && projectDate <= adjustedEndDate;
        });
      }
    }

    // Maintenir le tri si actif
    if (this.sortedByNewest) {
      this.projects = [...this.projects].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }


  clearSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }
  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
