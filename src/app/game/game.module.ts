import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioComponent } from './pages/inicio/inicio.component';
import { RouterModule } from '@angular/router';
import { TableroComponent } from './pages/tablero/tablero.component';
import { InfoComponent } from './pages/info/info.component';

@NgModule({
  declarations: [
    InicioComponent,
    TableroComponent,
    InfoComponent
  ],
  exports: [
    InicioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class GameModule { }
