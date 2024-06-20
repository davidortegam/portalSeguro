import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticateService } from '../services/authenticate.service';
import { ResponseModel } from '../models/response.model';
import { Router } from '@angular/router';
import { TokenService } from '../helper/token.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { GestionService } from '../helper/gestion.service';
import {MatIconModule} from '@angular/material/icon';




@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit{

  hide = true;
  usuario = new FormControl('',[Validators.required]);
  password = new FormControl('',[Validators.required]);
  version = environment.version;
  show: boolean = false;
  icono: string = "";


  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private authenticateService: AuthenticateService, private router: Router,
    private cookieService: CookieService,private tokenService: TokenService,private toaster: ToastrService, private gestionService: GestionService){
  }
  ngOnInit(): void {
    localStorage.clear();
    this.cookieService.deleteAll();
    this.version = environment.version;
    if(this.show == true){
      this.icono = 'visibility_off';
    }else{
      this.icono = 'visibility';
    }
  }
  hidef(){

  }
  passwordf() {
    this.show = !this.show;
    if(this.show == true){
      this.icono = 'visibility_off';
    }else{
      this.icono = 'visibility';
    }
  }

  login(){

    if(this.usuario.valid == true && this.password.valid == true){
      this.spinner.show();
      this.authenticateService.validarUsuario(this.usuario.value!.toUpperCase(),this.password.value!)
      .subscribe((resp: ResponseModel) => {
        if (resp.succeeded) {
          localStorage.setItem(environment.tokenName, resp.data.token);
          this.gestionService.guardaUsuarioNombre(resp.data.nombres);
          this.gestionService.guardaUsuario(resp.data.cod_usuario);
          this.gestionService.guardaEmail(resp.data.email);
          this.toaster.success('¡Bienvenido! '+resp.data.nombres);
          this.authenticateService.obtenerRol(this.usuario.value!.toUpperCase()).subscribe((res:ResponseModel)=>{
            this.gestionService.guardaInfoCargoSuscriptorLocal(res.data);
            this.router.navigate(['/home']);
          })
        }else{
          this.toaster.warning(resp.message, 'Información');
        }
          this.spinner.hide();
      }, () => {
        localStorage.clear();
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      });
    }else{
      this.toaster.warning('Usuario y contraseña Obligatorios');
    }
  }

}
