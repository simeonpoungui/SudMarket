import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentabiliteComponent } from './rentabilite/rentabilite.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from "../core/core.module";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RentabiliteComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    CoreModule
],
exports: [
  RentabiliteComponent
]
})
export class RentabiliteModule { }
