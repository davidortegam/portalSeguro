import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/response.model';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ControlEntities, Decision, SelectedFiles } from '../models/vencimiento.model';
import { ControlItem } from '../models/filtro.model';


@Injectable({
  providedIn: 'root'
})
export class VencimientoService {

  constructor(private http: HttpClient) { }
  consultarTabla(ramo: string,
    producto: string,
    desde: string,
    hasta: string,
    nom_agente: string,
    num_poliza_grupo: string,
    estado:string
  ) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = {
      p_cod_ramo: ramo,
      p_producto: producto,
      p_fecha_inicio_vigencia: desde,
      p_fecha_fin_vigencia: hasta,
      p_nombre_agente: nom_agente,
      p_num_poliza_grupo: num_poliza_grupo,
      p_estado: estado
    }
    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarRegistros`, body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarTablaVida(
    ramo: string,
    producto: string,
    poliza: string,
    desde: string,
    hasta: string,
    nombreAgente: string,
    ejecutivo: string,
    modalidad: string,
    polizaGrupo: string,
    estado: string
  ) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = {
      p_cod_ramo: ramo,
      p_producto: producto,
      p_poliza: poliza,
      p_fecha_inicio_vigencia: desde,
      p_fecha_fin_vigencia: hasta,
      p_nombre_agente: nombreAgente,
      p_ejecutivo: ejecutivo,
      p_modalidad: modalidad,
      p_poliza_grupo: polizaGrupo,
      p_estado: estado
    }
    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarRegistrosVida`,
       body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarTablaGeneral(
    ramo: string,
    desde: string,
    hasta: string,
    nombreTomador: string,
    nombreAgente: string,
    suscriptor: string,
    facultativo: string,
    polizaGrupo: string,
    estado: string,
    
  ) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = {
      p_cod_ramo: ramo,
      p_fecha_inicio_vigencia: desde,
      p_fecha_fin_vigencia: hasta,
      p_nombre_tomador: nombreTomador,
      p_nombre_agente: nombreAgente,
      p_suscriptor: suscriptor,
      p_facultativo: facultativo,
      p_poliza_grupo: polizaGrupo,
      p_estado: estado
    }
    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarRegistrosGeneral`,
        body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarAccesoPagina(
    p_cod_usuario: string
  ) {
      const headerOptions = new HttpHeaders();

      headerOptions.set('Content-Type', 'application/json');
    
      return this.http
        .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarAccesoPagina?usuario=${p_cod_usuario}`,
          "", { headers: headerOptions })
        .pipe(catchError(this.errorHandler));
  }
  guardarDecision(
    p_num_poliza: string,
    p_num_spto: string,
    p_num_apli: string,
    p_num_spto_apli: string,
    p_num_riesgo: string,
    p_pdf_64: string,
    p_observaciones: string,
    p_decision: string,
    p_accion:string,
    p_cod_usuario: string
  ) {
    const headerOptions = new HttpHeaders();
    const body = {
      p_num_poliza: p_num_poliza,
      p_num_spto: p_num_spto,
      p_num_apli: p_num_apli,
      p_num_spto_apli: p_num_spto_apli,
      p_num_riesgo: p_num_riesgo,
      p_pdf_64: p_pdf_64,
      p_observaciones: p_observaciones,
      p_decision: p_decision,
      p_accion: p_accion,
      p_cod_usuario: p_cod_usuario
    }
    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/GuardarDecision`,
        body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarDecision(
    p_num_poliza: string,
    p_num_spto: string,
    p_num_riesgo: string
  ) {
    const headerOptions = new HttpHeaders();
    
    headerOptions.set('Content-Type', 'application/json');
    const body = {
      p_num_poliza: p_num_poliza,
      p_num_spto: p_num_spto,
      p_num_riesgo: p_num_riesgo
    }
    

    return this.http
      .post<Decision>(`${environment.api}Vencimiento/ConsultarDecision`,
       body, { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarRamo(p_sector: string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarRamo?p_sector=${p_sector}`,
        '', { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarPersona(p_tipo: string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarPersona?p_tipo=${p_tipo}`,
        '', { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarPolizaGrupo() {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarPolizaGrupo`,
        '', { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarTomador(p_documento: string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarTomador?documento=${p_documento}`,
        '', { headers: headerOptions })
      .pipe(catchError(this.errorHandler));
  }
  consultarModalidadPoliza(p_cod_ramo: string) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');

    return this.http
      .post<ResponseModel>(`${environment.api}Vencimiento/ConsultarModalidadPoliza?cod_ramo=${p_cod_ramo}`,
        '', { headers: headerOptions })
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
