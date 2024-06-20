import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/response.model';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { CargarConsentimiento } from '../models/consentimiento.model';

@Injectable({
  providedIn: 'root'
})
export class CargarService {

  constructor(private http: HttpClient) { }
  guardarTabla(carga: CargarConsentimiento) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = carga;
    return this.http
      .post<ResponseModel>(`${environment.api}Cargar/CargarBase`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }
  consultarTabla(persona:string, documento: string, estado: string, fecha_desde: string, fecha_hasta: string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = {
      p_persona: persona,
      p_documento: documento,
      p_estado: estado,
      p_fecha_desde: fecha_desde,
      p_fecha_hasta: fecha_hasta
    }
    return this.http
      .post<ResponseModel>(`${environment.api}Cargar/ConsultarRegistros`,body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }
  darBaja(id: number, user: string, observacion: any) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/text');
    const body = {
      val1:user,
      val2:observacion
    };
    return this.http
      .put<ResponseModel>(`${environment.api}Cargar/DarBajaRegistro?id=${id}`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }
  correoErrores(errores:string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/text');
    const body = {
      val1:errores,
      val2:""
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cargar/CorreoErrores`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }
  enviarcorreo(correo:string,asunto:string,errores:string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/text');
    const body = {
      to:correo,
      asunto:asunto,
      mensaje:errores
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cargar/enviarCorreo`,body,{headers: headerOptions})
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
