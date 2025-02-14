import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/form-field';
import {MatError} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {MatDialogActions} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-maker-page',
  templateUrl: './project-maker-page.component.html',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatDialogActions,
    MatButton
  ],
  styleUrls: ['./project-maker-page.component.scss']
})
export class ProjectMakerPageComponent {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  project = {
    name: '',
    department: '',
    city: '',
    description: '',
    latitude:'',
    longitude:'',
    user_id:sessionStorage.getItem('user_id')
  };

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Project data:', this.project);
      this.http.post('http://localhost:8000/api/projects', this.project).subscribe(
        response => console.log(response),
        error => console.log(error));
      this.router.navigate(['/']);
    }
  }
}
