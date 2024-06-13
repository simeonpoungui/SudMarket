import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CoreModule } from '../core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { FicheUserComponent } from './users/fiche-user/fiche-user.component';
import { FicheUserConnectedComponent } from './users/fiche-user-connected/fiche-user-connected.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersFormComponent,
    FicheUserComponent,
    FicheUserConnectedComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    CoreModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class UsersModule { }
