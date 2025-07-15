import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../angular-material-module';
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { AddRequestDialog } from '../../dialogs/add-request-dialog/add-request-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private userService = inject(UserService);
  private authSrv = inject(Auth);
  private http = inject(HttpClient);

  user: null | User = null;
  currentUser$ = this.authSrv.currentUser$; // Observable<User | null>
  isAdmin: boolean = false;

  async ngOnInit(): Promise<void> {
    this.user = await this.authSrv.fetchUser();
    if (this.user) {
      this.isAdmin = this.user.role === 'admin';
    }
    console.log('Dashboard initialized', this.user);
  }
}
