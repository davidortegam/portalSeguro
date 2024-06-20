import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotizarComponent } from './cotizar.component';
import { FormularioComponent } from './formulario/formulario.component';

const routes: Routes = [
  {path: '', component: CotizarComponent, data:{breadcrumb:null}},
  {path:'formulario/:ramo/:modalidad',component:FormularioComponent, data:{breadcrumb:'Formulario - cotización'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizarRoutingModule { }
