import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizarRoutingModule } from './cotizar-routing.module';
import { CotizarComponent } from './cotizar.component';
import { MaterialExampleModule } from 'src/app/materialClass';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioComponent } from './formulario/formulario.component';


@NgModule({
  declarations: [
    CotizarComponent,
    FormularioComponent
  ],
  imports: [
    CommonModule,
    CotizarRoutingModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CotizarModule { }
