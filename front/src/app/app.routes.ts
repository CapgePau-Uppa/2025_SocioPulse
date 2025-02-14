import { Routes } from '@angular/router';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {ProjectMakerPageComponent} from './project-maker-page/project-maker-page.component';
import {AboutPageComponent} from './about-page/about-page.component';
import {FaqPageComponent} from './faq-page/faq-page.component';
import { ProjectsListPageComponent } from './projects-list-page/projects-list-page.component';
import { ProjectDetailPageComponent } from './project-detail-page/project-detail-page.component';

export const routes: Routes = [
  {path:'', component: LandingPageComponent},
  {path: 'register-page', component: RegisterPageComponent},
  {path: 'project-maker-page', component: ProjectMakerPageComponent},
  {path: 'projects-list-page', component: ProjectsListPageComponent},
  {path: 'about-page', component: AboutPageComponent},
  {path: 'faq-page', component: FaqPageComponent},
  {path: 'project-detail-page/:id', component: ProjectDetailPageComponent}
];
