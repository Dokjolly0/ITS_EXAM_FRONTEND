import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StandardModule } from '../../standard-module';
import { MaterialModule } from '../../angular-material-module';

@Component({
  selector: 'app-categories',
  imports: [StandardModule, MaterialModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private categoriesService = inject(CategoriesService);
  private snackbar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  categories: any[] = [];
  isLoading = true;
  form: FormGroup;
  editIndex: number | null = null;

  constructor() {
    this.form = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoriesService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackbar.open('Errore nel caricamento delle categorie', 'Chiudi', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  saveCategory() {
    if (this.form.invalid) return;

    const body = { description: this.form.value.description };

    if (this.editIndex !== null) {
      const id = this.categories[this.editIndex].id;
      this.categoriesService.update(id, body).subscribe({
        next: () => {
          this.snackbar.open('Categoria aggiornata', 'Chiudi', {
            duration: 2000,
          });
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => {
          const msg = err.error?.message || 'Errore nella modifica';
          this.snackbar.open(msg, 'Chiudi', { duration: 3000 });
        },
      });
    } else {
      this.categoriesService.create(body).subscribe({
        next: () => {
          this.snackbar.open('Categoria creata', 'Chiudi', { duration: 2000 });
          this.resetForm();
          this.loadCategories();
        },
        error: () => {
          this.snackbar.open('Errore nella creazione', 'Chiudi', {
            duration: 3000,
          });
        },
      });
    }
  }

  editCategory(index: number) {
    this.editIndex = index;
    this.form.patchValue({ description: this.categories[index].description });
  }

  deleteCategory(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return;

    this.categoriesService.delete(id).subscribe({
      next: () => {
        this.snackbar.open('Categoria eliminata', 'Chiudi', { duration: 2000 });
        this.loadCategories();
      },
      error: (err) => {
        this.snackbar.open(
          err.error?.message || 'Categoria non eliminabile',
          'Chiudi',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  resetForm() {
    this.form.reset();
    this.editIndex = null;
  }
}
