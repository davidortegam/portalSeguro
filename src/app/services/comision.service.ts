import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ResponseModel } from '../models/response.model';
import { Comisiones } from 'src/app/models/comisiones.models';

@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  constructor(
    private http: HttpClient
  ) { }

  listarCobertura(sector: string, cia: string){
    return this.http
      .get<ResponseModel>(
        `${environment.api}Comisiones/Cobertura?sector=${sector}&cia=${cia}`
      )
      .pipe(catchError(this.errorHandler));
  }

  consultarExcepcion(ramo: string, cia: string){
    return this.http
      .get<ResponseModel>(
        `${environment.api}Comisiones/ConsultarRegistros?sector=${ramo}&cia=${cia}`
      )
      .pipe(catchError(this.errorHandler));
  }

  agregarExcepcion(
    comision: Comisiones
  ): Observable<any> {
    const body = {
      Ramo : comision.Ramo,
      Subcentral : comision.Subcentral,
      Estructural : comision.Estructural,
      Comercial : comision.Comercial,
      Agente : comision.Agente,
      Poliza : comision.Poliza,
      Cobertura : comision.Cobertura,
      Moneda : comision.Moneda,
      IngresoFechaVal : comision.IngresoFechaVal,
      Agentenp : comision.Agentenp,
      Agentecartera : comision.Agentecartera,
      Rapper : comision.Rapper,
      RapperCartera : comision.RapperCartera,
      Asesor : comision.Asesor,
      AsesorCartera : comision.AsesorCartera,
      Objeto : comision.Objeto,
      ObjetoAnulacion : comision.Observaciones,
      Observaciones : comision.Observaciones,
      PolizaGrupo : comision.PolizaGrupo,
      ContratoPoliza : comision.ContratoPoliza
    };
console.log(body);
    const headerOptions = new HttpHeaders();
    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Comisiones/GuardarExcepcion`,
        body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }

  modificarExcepcion(ramo: string, cia: string){
    return this.http
      .get<ResponseModel>(
        `${environment.api}Comisiones/ModificarExcepcion?sector=${ramo}&cia=${cia}`
      )
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
