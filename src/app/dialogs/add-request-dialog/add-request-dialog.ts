import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../angular-material-module';
import { StandardModule } from '../../standard-module';
import { RequestsService } from '../../services/requests';
import { CategoriesService } from '../../services/categories';

@Component({
  selector: 'app-add-request-dialog',
  imports: [StandardModule, MaterialModule],
  templateUrl: './add-request-dialog.html',
  styleUrl: './add-request-dialog.css',
})
export class AddRequestDialog {
  private fb = inject(FormBuilder);
  private requestsService = inject(RequestsService);
  private categoriesService = inject(CategoriesService);
  private snackbar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<AddRequestDialog>);

  form = this.fb.group({
    categoryId: ['', Validators.required],
    object: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(1)]],
    motivation: ['', Validators.required],
  });

  isLoading = false;
  categories: any[] = [];

  ngOnInit() {
    this.categoriesService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: () =>
        this.snackbar.open('Errore nel caricamento categorie', 'Chiudi', {
          duration: 3000,
        }),
    });
  }

  save() {
    if (this.form.invalid) {
      const { quantity, price } = this.form.value;

      if (quantity !== null && quantity! <= 0) {
        this.snackbar.open('La quantità deve essere maggiore di 0', 'Chiudi', {
          duration: 3000,
        });
      }

      if (price !== null && price! < 0) {
        this.snackbar.open('Il prezzo non può essere negativo', 'Chiudi', {
          duration: 3000,
        });
      }

      return;
    }

    const cleanValue = {
      ...this.form.value,
      categoryId: this.form.value.categoryId ?? '',
      object: this.form.value.object ?? '',
      quantity: this.form.value.quantity ?? 1,
      price: this.form.value.price ?? 0,
      motivation: this.form.value.motivation ?? '',
    };

    this.isLoading = true;
    this.requestsService.createRequest(cleanValue).subscribe({
      next: (created) => {
        this.snackbar.open('Richiesta creata con successo', 'Chiudi', {
          duration: 2000,
        });
        this.dialogRef.close(created);
      },
      error: (err) => {
        this.snackbar.open(
          err.error?.message || 'Errore nella creazione',
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
