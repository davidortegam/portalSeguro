import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard.guard';
import { CargarComponent } from './modules/cargar/cargar.component';
import { AdministrarComponent } from './modules/administrar/administrar.component';
import { VencimientoComponent } from './modules/vencimiento/vencimiento.component';
import { AutosComponent } from './modules/vencimiento/autos/autos.component';
import { GeneralComponent } from './modules/vencimiento/general/general.component';
import { VidaComponent } from './modules/vencimiento/vida/vida.component';
import { ConsultarComponent } from './modules/documentos/consultar/consultar.component';
import { CargarDocumentosComponent } from './modules/documentos/cargar/cargar.component';
import { ExcepcionesComponent } from './modules/excepciones/excepciones.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), data:{breadcrumb:null},canActivate: [AuthGuard] },
  { path: 'Protección de Datos/cargar', component: CargarComponent, data:{breadcrumb:'Carga Masiva Protección de datos'},canActivate: [AuthGuard] },
  // { path: 'ingresar', component: ComisionesComponent, data:{breadcrumb:'Excepción de comisiones'},canActivate: [AuthGuard] },
  { path: 'Protección de Datos/administrar', component: AdministrarComponent, data:{breadcrumb:'Consola Administrativa Protección de datos'},canActivate: [AuthGuard] },
  { path: 'Procesos y manuales/consulta', component: ConsultarComponent, data:{breadcrumb:'Consultar Documentos'},canActivate: [AuthGuard] },
  { path: 'Procesos y manuales/administracion', component: CargarDocumentosComponent, data:{breadcrumb:'Administrar Documentos'},canActivate: [AuthGuard] },
  // { path: 'cotizar/:sector', loadChildren: () => import('./modules/cotizar/cotizar.module').then(m => m.CotizarModule), data:{breadcrumb:'Cotizar'},canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  // { path: 'consultar/:sector', loadChildren: () => import('./modules/consultar/consultar.module').then(m => m.ConsultarModule), data:{breadcrumb:'Consultar'},canActivate: [AuthGuard]},
  { path: 'Vencimiento/poliza', component: VencimientoComponent, data: { breadcrumb: 'Vencimiento - Pólizas' }, canActivate: [AuthGuard] },
  { path: 'Vencimiento/autos', component: AutosComponent, data: { breadcrumb: 'Vencimiento - Pólizas - Sector Auto' }, canActivate: [AuthGuard] },
  { path: 'Vencimiento/vida', component: VidaComponent, data: { breadcrumb: 'Vencimiento - Pólizas - Sector Vida' }, canActivate: [AuthGuard] },
  { path: 'Vencimiento/general', component: GeneralComponent, data: { breadcrumb: 'Vencimiento - Pólizas - Sector General' }, canActivate: [AuthGuard] },
  { path: 'Excepción Comisiones/administrar', component: ExcepcionesComponent, data:{breadcrumb:'Administrar Comisiones'},canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }, 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
