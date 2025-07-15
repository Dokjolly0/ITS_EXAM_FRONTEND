import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StandardModule } from '../../standard-module';
import { MaterialModule } from '../../angular-material-module';
import { RequestsService } from '../../services/requests';

@Component({
  selector: 'app-edit-request-dialog',
  imports: [StandardModule, MaterialModule],
  templateUrl: './edit-request-dialog.html',
  styleUrl: './edit-request-dialog.css',
})
export class EditRequestDialog {
  isLoading = false;
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<EditRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      object: [this.data.object, Validators.required],
      quantity: [this.data.quantity, [Validators.required, Validators.min(1)]],
      price: [this.data.price, [Validators.required, Validators.min(1)]],
      motivation: [this.data.motivation, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.requestsService
      .updateRequest(this.data.id, this.form.value)
      .subscribe({
        next: (updated) => {
          this.snackbar.open('Richiesta aggiornata', 'Chiudi', {
            duration: 2000,
          });
          this.dialogRef.close(updated);
        },
        error: (err) => {
          this.snackbar.open(
            err.error?.message || 'Errore durante il salvataggio',
            'Chiudi',
            { duration: 3000 }
          );
          this.isLoading = false;
        },
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
