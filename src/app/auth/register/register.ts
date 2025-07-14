import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OAuthManager } from '../../../utils/oauth';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { getFieldName } from '../../../utils/get_field_name';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  oauth = new OAuthManager({
    enableGoogleAuth: false,
    enableGitHubAuth: false,
  });

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyed$ = new Subject<void>();
  private authsrv = inject(Auth);

  registerForm: FormGroup = new FormGroup({});
  hidePassword = true;
  hideConfirmPassword = true;
  registerError: string = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        checkpassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: [this.matchPasswordsValidator()],
      }
    );

    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.registerError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // Password visibility toggle
  togglePasswordVisibility(isConfirmPassword: boolean = false) {
    if (!isConfirmPassword) this.hidePassword = !this.hidePassword;
    else this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  matchPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const checkpassword = group.get('checkpassword')?.value;
      return password === checkpassword ? null : { passwordMismatch: true };
    };
  }

  // Registration method
  register(): void {
    if (!this.registerForm.valid) {
      const messages: string[] = [];

      Object.entries(this.registerForm.controls).forEach(([name, control]) => {
        if (control.invalid) {
          const errors = control.errors || {};
          this.registerForm.markAllAsTouched();

          if (errors['required']) {
            messages.push(`${getFieldName(name)} è obbligatorio.`);
          }
          if (errors['email']) {
            messages.push(`${getFieldName(name)} deve essere un'email valida.`);
          }
          if (errors['minlength']) {
            messages.push(
              `${getFieldName(name)} deve contenere almeno ${
                errors['minlength'].requiredLength
              } caratteri.`
            );
          }
        }
      });

      // Controllo validatore di gruppo (passwordMismatch)
      if (this.registerForm.errors?.['passwordMismatch']) {
        messages.push('Le password non corrispondono.');
      }

      this.snackBar.open(messages.join(' '), 'Chiudi', {
        duration: 5000,
      });

      return;
    }

    const formData = new FormData();
    const formValues = this.registerForm.value;
    const user = this.registerForm.value;

    Register;
    this.authsrv
      .register(user)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((err) => {
          this.registerError = err?.error?.message || 'Errore di registrazione';
          this.snackBar.open(this.registerError, 'Chiudi', {
            duration: 3000,
          });
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this.snackBar.open('Registrazione completata!', 'Chiudi', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      });
  }
}
