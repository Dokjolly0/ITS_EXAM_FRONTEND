import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from '../../services/categories';
import { RequestsService } from '../../services/requests';
import { StandardModule } from '../../standard-module';
import { MaterialModule } from '../../angular-material-module';

@Component({
  selector: 'app-stats',
  imports: [StandardModule, MaterialModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private requestsService = inject(RequestsService);
  private categoriesService = inject(CategoriesService);
  private snackbar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  stats: any[] = [];
  categories: any[] = [];
  form: FormGroup;
  isLoading = false;
  categoryMap = new Map<string, string>();

  constructor() {
    this.form = this.fb.group({
      month: [''],
      categoryId: [''],
    });
  }

  getCategoryName(id: string): string {
    return this.categoryMap.get(id) || id;
  }

  ngOnInit() {
    this.categoriesService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoryMap = new Map(
          data.map((cat) => [cat.id!, cat.description])
        );
      },
      error: () => {
        this.snackbar.open('Errore nel caricamento categorie', 'Chiudi', {
          duration: 3000,
        });
      },
    });
    this.fetchStats(); // iniziale senza filtri
  }

  fetchStats() {
    const { month, categoryId } = this.form.value;
    this.isLoading = true;

    this.requestsService.getStats(month, categoryId).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackbar.open('Errore nel caricamento statistiche', 'Chiudi', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  formatMonth(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      month: 'long',
      year: 'numeric',
    });
  }
}
