import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent) },
    { path: 'register-page', loadComponent: () => import('./register-page/register-page.component').then(m => m.RegisterPageComponent) },
    { path: 'project-maker-page', loadComponent: () => import('./project-maker-page/project-maker-page.component').then(m => m.ProjectMakerPageComponent) },
    { path: 'projects-list-page', loadComponent: () => import('./projects-list-page/projects-list-page.component').then(m => m.ProjectsListPageComponent) },
    { path: 'about-page', loadComponent: () => import('./about-page/about-page.component').then(m => m.AboutPageComponent) },
    { path: 'profile-page', loadComponent: () => import('./profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
    { path: 'faq-page', loadComponent: () => import('./faq-page/faq-page.component').then(m => m.FaqPageComponent) },
    { path: 'project-detail-page/:id', loadComponent: () => import('./project-detail-page/project-detail-page.component').then(m => m.ProjectDetailPageComponent) },
    { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    {path: 'project-repport-page/:id', loadComponent: () => import('./project-repport-page/project-repport-page.component').then(m => m.ProjectRepportPageComponent)},
    { path: 'access-requests', loadComponent: () => import('./project-access-requests/project-access-requests.component').then(m => m.ProjectAccessRequestsComponent) }
];
