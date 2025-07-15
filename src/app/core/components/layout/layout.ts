import { Component, inject } from '@angular/core';

import { Auth as AuthSrv } from '../../../services/auth';
import { MatDividerModule } from '@angular/material/divider';
import { MaterialModule } from '../../../angular-material-module';
import { RouterOutlet } from '@angular/router';
import { StandardModule } from '../../../standard-module';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, StandardModule, MaterialModule, MatDividerModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private authSrv = inject(AuthSrv);
  user: User | null = null;
  isAdmin: boolean = false;

  async ngOnInit() {
    this.user = await this.authSrv.fetchUser();
    this.isAdmin = this.user?.role === 'admin';
  }

  logout() {
    this.authSrv.logout();
  }
}
