import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatDialogActions} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import {ToastrService} from 'ngx-toastr';

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
    MatDialogActions,
	MatButtonModule,
	MatCardModule
  ]
})

export class RegisterPageComponent {
	user = {
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	};

	constructor(private toastr: ToastrService,private authService: AuthService, private router: Router) {}

	async register(): Promise<void> {
		try {
		  const response = await firstValueFrom(
        this.authService.register(this.user.name, this.user.email, this.user.password, this.user.confirmPassword)
		  );

		  console.log('Inscription réussie:', response);
		  this.authService.setToken(response.token);
		  this.router.navigate(['/']); // Redirige après inscription
      this.toastr.success('Inscription réussie');
		}
    catch (error) {
		  console.error('Erreur d\'inscription', error);
      this.toastr.error('Erreur d\'inscription');
		}
	}
}
