import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './game/pages/inicio/inicio.component';
import { TableroComponent } from './game/pages/tablero/tablero.component';


const routes: Routes = [
  {
    path: "",
    component: InicioComponent,
    pathMatch: "full"
  },
  {
    path: ":level",
    component: TableroComponent,
  }
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
