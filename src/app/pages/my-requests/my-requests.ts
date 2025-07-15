import { Component, inject } from '@angular/core';
import { RequestsService } from '../../services/requests';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StandardModule } from '../../standard-module';
import { MaterialModule } from '../../angular-material-module';
import { EditRequestDialog } from '../../dialogs/edit-request-dialog/edit-request-dialog';
import { MatDialog } from '@angular/material/dialog';
import { AddRequestDialog } from '../../dialogs/add-request-dialog/add-request-dialog';

@Component({
  selector: 'app-my-requests',
  imports: [StandardModule, MaterialModule],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.css',
})
export class MyRequests {
  private requestsService = inject(RequestsService);
  private snackbar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  requests: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadRequests();
  }

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

  deleteRequest(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questa richiesta?')) return;

    this.requestsService.deleteRequest(id).subscribe({
      next: () => {
        this.snackbar.open('Richiesta eliminata con successo', 'OK', {
          duration: 2000,
        });
        this.loadRequests(); // ricarica lista
      },
      error: (err) => {
        let message = "Errore durante l'eliminazione della richiesta";
        if (err.status === 403 || err.status === 400) {
          message =
            err.error?.message || 'Non autorizzato o richiesta non eliminabile';
        } else if (err.status === 404) {
          message = 'Richiesta non trovata';
        }
        this.snackbar.open(message, 'Chiudi', { duration: 3000 });
      },
    });
  }

  editRequest(request: any) {
    this.dialog
      .open(EditRequestDialog, {
        width: '500px',
        data: request,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadRequests();
      });
  }

  canEditOrDelete(request: any): boolean {
    return request.state === 'pending';
  }
}
