import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OAuthManager } from '../../../utils/oauth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginError = '';
  hidePassword = true;
  oauth = new OAuthManager({
    enableGoogleAuth: false,
    enableGitHubAuth: false,
  });
  loginForm: FormGroup = new FormGroup({});
  private destroyed$ = new Subject<void>();

  // Dependency Injection moderna (Angular 14+)
  private fb = inject(FormBuilder);
  private authSrv = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // Pulisce l'errore appena l'utente modifica qualcosa nei campi
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authSrv
        .login(username, password)
        .pipe(
          takeUntil(this.destroyed$),
          catchError((err) => {
            this.loginError = err?.error?.message || 'Errore di login';
            this.snackBar.open(this.loginError, 'Chiudi', { duration: 3000 });
            return throwError(() => err);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Login effettuato con successo!', 'Chiudi', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard']);
        });
    } else {
      this.snackBar.open('Compila tutti i campi obbligatori', 'Chiudi', {
        duration: 3000,
      });
    }
  }

  // Pulizia memory leak su destroy del componente
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
