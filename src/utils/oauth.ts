import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { gitHubSVG } from '../app/svg/github.svg';
import { googleSVG } from '../app/svg/google.svg';
import { inject } from '@angular/core';

interface OAuthConfig {
  enableGoogleAuth?: boolean;
  enableGitHubAuth?: boolean;
}

export class OAuthManager {
  private sanitizer = inject(DomSanitizer);
  constructor(private config: OAuthConfig = {}) {}

  autenticateWithGoogle(): void {
    window.location.href = `${environment.googleAuthLink}`;
  }

  autenticateWithGithub(): void {
    window.location.href = `${environment.gitHubAuthLink}`;
  }

  // Restituisce l'SVG di Google come HTML "sicuro"
  googleSVG(pixel: number = 24): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(googleSVG(`${pixel}`));
  }

  gitHubSVG(pixel: number = 24): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(gitHubSVG(`${pixel}`));
  }

  get showGoogleAuth(): boolean {
    return this.config.enableGoogleAuth ?? false;
  }

  get showGitHubAuth(): boolean {
    return this.config.enableGitHubAuth ?? false;
  }
}
