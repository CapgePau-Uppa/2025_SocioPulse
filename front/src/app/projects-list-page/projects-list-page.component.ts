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

@Component({
  selector: 'app-projects-list-page',
  templateUrl: './projects-list-page.component.html',
  styleUrls: ['./projects-list-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow]
})
export class ProjectsListPageComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'description', 'city'];
  projects: any[] = [];
  constructor(private router:Router,private projectService: ProjectsService) { }
  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }
  navigateToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail-page', projectId]);
  }
}
