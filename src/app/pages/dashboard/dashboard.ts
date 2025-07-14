import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Auth } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../angular-material-module';
import { User as UserService } from '../../services/user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AsyncPipe, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private userService = inject(UserService);
  private authSrv = inject(Auth);
  private http = inject(HttpClient);

  user$ = this.userService.getCurrentUser();
  user: any;

  async ngOnInit() {
    this.user = await this.authSrv.fetchUser();
  }

  joinTournament() {
    this.http
      .post(`${environment.apiUrl}/users/tournament/join`, {})
      .subscribe({
        next: () => window.location.reload(),
      });
  }

  becomeOrganizer() {
    this.http
      .post(`${environment.apiUrl}/users/tournament/become-organizer`, {})
      .subscribe({
        next: () => window.location.reload(),
      });
  }
}
