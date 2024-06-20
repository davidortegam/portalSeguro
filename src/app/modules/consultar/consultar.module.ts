import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ConsultarRoutingModule } from './consultar-routing.module';
import { ConsultarComponent } from './consultar.component';
import { MaterialExampleModule } from 'src/app/materialClass';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConsultarComponent
  ],
  imports: [
    CommonModule,
    ConsultarRoutingModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    DatePipe
  ]
})
export class ConsultarModule { }
