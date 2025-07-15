import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../angular-material-module';
import { Auth } from '../../services/auth';
import { User as UserService } from '../../services/user';
import { User } from '../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { AddRequestDialog } from '../../dialogs/add-request-dialog/add-request-dialog';
import { Request } from '../../core/models/request.model';
import { RequestsService } from '../../services/requests';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StandardModule } from '../../standard-module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StandardModule, MaterialModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private userService = inject(UserService);
  private authSrv = inject(Auth);
  private dialog = inject(MatDialog);
  private requestsService = inject(RequestsService);
  private snackbar = inject(MatSnackBar);

  user: null | User = null;
  currentUser$ = this.authSrv.currentUser$; // Observable<User | null>
  isAdmin: boolean = false;
  isLoading: boolean = false;
  requests: Request[] = []; // Replace with actual request type

  loadRequests() {
    this.isLoading = true;
    this.requestsService.getMyRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackbar.open('Errore nel caricamento delle richieste', 'Chiudi', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  openAddDialog() {
    this.dialog
      .open(AddRequestDialog, {
        width: '500px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadRequests?.(); // ricarica lista se presente
      });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.authSrv.fetchUser();
    if (this.user) {
      this.isAdmin = this.user.role === 'admin';
    }
    console.log('Dashboard initialized', this.user);
  }
}
