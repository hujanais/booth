import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
  ],
  exports: [
    MatButtonModule,
    MatListModule,
    MatCardModule
  ]
})
export class AngularMaterialModule { }
