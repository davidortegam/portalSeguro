import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { CookieService } from 'ngx-cookie-service';
import { LstFeature, Rol } from '../models/rol.model';
// import { InfoCargo } from '../models/cargo/cargo.interface';

@Injectable({
    providedIn: 'root'
})

export class GestionService {

    constructor(private cookieService: CookieService) { }

    guardaInfoCargoSuscriptorLocal(infoCargo: Rol): void {
        localStorage.setItem(environment.iCargoCkName, window.btoa(JSON.stringify(infoCargo)));
    }

    obtenerInfoCargoSuscriptorLocal(): Rol {
        let infoCargo;

        try {
            infoCargo = JSON.parse(window.atob(localStorage.getItem(environment.iCargoCkName) || ''));
        } catch (error) {
            infoCargo = {} as Rol;
        }
        return infoCargo;
    }

    guardaUsuario(usuario: string): void {
        this.cookieService.set(environment.codUsuario, window.btoa(usuario));
    }

    obtenerUsuario(): string {
        return window.atob(this.cookieService.get(environment.codUsuario) || '');
    }

    guardaEmail(email: string): void {
        this.cookieService.set(environment.email, window.btoa(email));
    }

    obtenerEmail(): string {
        return window.atob(this.cookieService.get(environment.email) || '');
    }

    guardaUsuarioNombre(nombre: string): void {
        this.cookieService.set(environment.nombreUsuario, window.btoa(nombre));
    }

    obtenerUsuarioNombre(): string {
        return window.atob(this.cookieService.get(environment.nombreUsuario) || '');
    }
    guardaRamoNombre(nombre: string): void {
      this.cookieService.set(environment.nombreRamo, window.btoa(nombre));
    }

    obtenerRamoNombre(): string {
      return window.atob(this.cookieService.get(environment.nombreRamo) || '');
    }

}
