import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../services/projects.service';
import {HttpClient} from '@angular/common/http';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-projects-list-page',
  templateUrl: './projects-list-page.component.html',
  styleUrls: ['./projects-list-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow, MatIcon, MatButton]
})
export class ProjectsListPageComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'description', 'city', 'created_at'];
  projects: any[] = [];
  sortedByNewest: boolean = false;
  originalProjects: any[] = [];
  constructor(private router:Router,private projectService: ProjectsService) { }
  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.originalProjects = [...data]; // Store original order
      this.projects = data;
    });
  }
  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
  toggleSort(): void {
    this.sortedByNewest = !this.sortedByNewest;

    if (this.sortedByNewest) {
      // Sort by newest first
      this.projects = [...this.projects].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      // Restore original order
      this.projects = [...this.originalProjects];
    }
  }
}
