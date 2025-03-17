// project-update.service.ts
//this service notifies the leaflet map component when a project is added, updated or deleted
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectUpdateService {
  private projectUpdatedSource = new Subject<void>();

  projectUpdated$ = this.projectUpdatedSource.asObservable();

  notifyProjectUpdate() {
    this.projectUpdatedSource.next();
  }
}
