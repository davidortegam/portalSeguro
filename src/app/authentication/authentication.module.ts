import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { MaterialExampleModule } from '../materialClass';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule, ReactiveFormsModule,
    MaterialExampleModule,
    MatIconModule
  ]
})
export class AuthenticationModule { }
