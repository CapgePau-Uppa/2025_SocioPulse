import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import {MatButton} from '@angular/material/button';
import {MatDialogActions} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatButton,
    MatDialogActions
  ]
})
export class RegisterPageComponent {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit(form: any): void {
    if (form.valid/* && this.user.password === this.user.confirmPassword*/) {
      console.log('User data:', this.user);
      this.http.post('http://localhost:8000/api/register', this.user).subscribe({
        next: () => {
          console.log("Inscription réussie!");
          this.router.navigate(['/']);  // ✅ Redirect to home after success
        },
        error: (error: any) => {
          console.error("Erreur lors de l'inscription:", error);
        }
      });
      this.router.navigate(['/']);
    }
  }
}
