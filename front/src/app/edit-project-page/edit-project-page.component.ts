import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-edit-project-page',
  templateUrl: './edit-project-page.component.html',
  styleUrls: ['./edit-project-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class EditProjectPageComponent implements OnInit {
  project: any = {};
  MesureOption = [
    "(Re)localisation dans les secteurs critiques",
    "AMI Capacity, portant sur des capacités de production de produits thérapeutiques liés au COVID-19",
    "Efficacité énergétique et évolution des procédés dans l’industrie",
    "Fonds de soutien aux investissements du secteur nucléaire",
    "Modernisation de la filière automobile",
    "Modernisation de la filière aéronautique",
    "Renforcement des compétences",
    "Soutien à la chaleur bas carbone",
    "Soutien à l’investissement industriel dans les territoires",
  ]

  RelanceOption = [
      "Indépendance / Compétitivité",
      "Verdissement",
  ]

  MesureLightOption = [
      "Automobile",
      "Aéronautique",
      "Efficacité énergétique",
      "Nucléaire",
      "Nucléaire - Compétences",
      "Projets territoriaux",
      "Relocalisation"
  ]

  FiliereOption = [
      "Aluminium",
      "Automobile",
      "Aéronautique",
      "Agroalimentaire",
      "Chimie",
      "Construction",
      "Eau",
      "Electronique",
      "Industrie automobile",
      "Intrants essentiels à l'industrie",
      "Mines et métallurgie",
      "Mode et Luxe",
      "Nouveaux systèmes énergétiques",
      "Nucléaire",
      "Papier/carton",
      "Raffinage et Pétrochimie",
      "Santé",
      "Sidérurgie",
      "Transformation et valorisation des déchets",
      "Télécommunications 5G",
  ]
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private projectsService: ProjectsService,

  ) {}

  ngOnInit(): void {
    const projectId = +(this.route.snapshot.paramMap.get('id') ?? 0);

    this.projectsService.getProjects().subscribe(data => {
      this.project = data.find(project => project.id === projectId);
      console.log(this.project);
    });
  }

  saveProject(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('Utilisateur non authentifié');
      return;
    }
    console.log('project edit', this.project);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`http://localhost:8000/api/projects/${this.project.id}`, this.project, { headers })
      .subscribe(
        () => {
          console.log('Projet mis à jour avec succès');
          this.router.navigate(['/project-detail-page', this.project.id]);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du projet', error);
        }
      );
}

  cancelEdit(): void {
    this.router.navigate(['/project-detail-page', this.project.id]);
  }
}
