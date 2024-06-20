import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from './materialClass';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthInterceptorService } from './helper/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { CargarComponent } from './modules/cargar/cargar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrarComponent } from './modules/administrar/administrar.component';
import { VencimientoComponent } from './modules/vencimiento/vencimiento.component';
import { AutosComponent } from './modules/vencimiento/autos/autos.component';
import { GeneralComponent } from './modules/vencimiento/general/general.component';
import { VidaComponent } from './modules/vencimiento/vida/vida.component';
import { data } from 'jquery';
import { ConsultarComponent } from './modules/documentos/consultar/consultar.component';
import { CargarDocumentosComponent } from './modules/documentos/cargar/cargar.component';
import { ExcepcionesComponent } from './modules/excepciones/excepciones.component';
import { ComisionesComponent } from './modules/comisiones/comisiones.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: ["dd.MM.yyyy", "dd/MM/yyyy", "dd,MM,yyyy"], // to accept different input styles from user
  },
  display: {
    dateInput: "dd.MM.yyyy", // display format in input field
    monthYearLabel: 'yyyy MMMM',
    dateA11yLabel: 'MMMM d, y',//'LL',
    monthYearA11yLabel: 'MMMM yyyy'
  },
};
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    BreadcrumbComponent,
    CargarComponent,
    AdministrarComponent,
    VencimientoComponent,
    AutosComponent,
    GeneralComponent,
    VidaComponent,
    ConsultarComponent,
    CargarDocumentosComponent,

    ComisionesComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    NgxSpinnerModule.forRoot({type:'ball-scale-multiple'}),
    ToastModule,
    FileUploadModule,
    CalendarModule,
    DialogModule,
    PanelModule,
    CardModule,
    ConfirmDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
