import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestsService } from '../../services/requests';
import { StandardModule } from '../../standard-module';
import { MaterialModule } from '../../angular-material-module';
import { Auth } from '../../services/auth';
import { User as UserSrv } from '../../services/user';

@Component({
  selector: 'app-pending-requests',
  imports: [StandardModule, MaterialModule],
  templateUrl: './pending-requests.html',
  styleUrl: './pending-requests.css',
})
export class PendingRequests {
  private requestsService = inject(RequestsService);
  private snackbar = inject(MatSnackBar);
  private authSrv = inject(Auth);
  private userService = inject(UserSrv);

  adminId: string = '';
  requests: any[] = [];
  isLoading = true;
  userMap = new Map<string, string>();

  getFullName(userId: string): string {
    return this.userMap.get(userId) || userId;
  }

  async ngOnInit() {
    const user = await this.authSrv.fetchUser();
    this.adminId = user!.id!;

    // 🔽 carica utenti solo per admin
    this.userService.getAll().subscribe({
      next: (users) => {
        this.userMap = new Map(
          users.map((u) => [u.id!, `${u.firstName} ${u.lastName}`])
        );
        this.loadPending();
      },
      error: (err) => {
        this.snackbar.open('Errore nel caricamento utenti', 'Chiudi', {
          duration: 3000,
        });
        this.loadPending(); // comunque carica le richieste
      },
    });
    console.log('UserMap:', this.userMap);
    console.log(
      'Request userId:',
      this.requests.map((r) => r.userId)
    );
  }

  loadPending() {
    this.isLoading = true;
    this.requestsService.getToApprove().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackbar.open('Errore nel caricamento', 'Chiudi', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  approve(id: string) {
    this.requestsService.approve(id, this.adminId).subscribe({
      next: () => {
        this.snackbar.open('Richiesta approvata', 'Chiudi', { duration: 2000 });
        this.loadPending();
      },
      error: (err: any) => {
        this.snackbar.open(
          err.error?.message || "Errore nell'approvazione",
          'Chiudi',
          { duration: 3000 }
        );
      },
    });
  }

  reject(id: string) {
    this.requestsService.reject(id, this.adminId).subscribe({
      next: () => {
        this.snackbar.open('Richiesta rifiutata', 'Chiudi', { duration: 2000 });
        this.loadPending();
      },
      error: (err: any) => {
        this.snackbar.open(
          err.error?.message || 'Errore nel rifiuto',
          'Chiudi',
          { duration: 3000 }
        );
      },
    });
  }
}
