import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './consultar.component';

const routes: Routes = [{ path: '', component: ConsultarComponent, data:{breadcrumb:null} }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultarRoutingModule { }
