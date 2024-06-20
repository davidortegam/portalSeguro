import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticateService } from '../services/authenticate.service';
import { ResponseModel } from '../models/response.model';
import { GestionService } from '../helper/gestion.service';
import { LstFeature, Rol, Sectores } from '../models/rol.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  nuevoObjeto: any[] = [];
  opciones:any[]=[];
  sector:any[]=[];
  data!: Rol;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private gestionService: GestionService,
    private cookieService: CookieService, private router: Router) {}
  ngOnInit(): void {
    this.cargarOpciones();

  }
  cargarOpciones(){
    try {
      this.data = this.gestionService.obtenerInfoCargoSuscriptorLocal();
        this.sector = this.data.sectores;
    } catch (error) {
    }
  }

  cerrarSesion() {
    Swal.fire({
      title: 'Vas a cerrar sesión, ¿estás seguro?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#da2d25',
      cancelButtonText: 'No',
      width: 300
    }).then((result: any) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.cookieService.deleteAll();
        this.router.navigate(['/login']);
      }
    });
  }

  redirigir(opciones:any){
    this.router.navigate([opciones.opc_descripcion+'/'+opciones.opc_ruta]).then(()=>{
    });
  }
}
