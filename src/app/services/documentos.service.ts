import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environments';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Documento } from '../models/documentos.models';
import { DocumentoFileResponse } from '../interface/Documentos';


@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient) { }

  errorHandler(error: any) {
    let errorMessage = '';
  
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  listaProcesos() {
    return this.http
    .get<ResponseModel>(
      `${environment.api}Documento/ConsultarProcesos`
    )
    .pipe(catchError(this.errorHandler));
  }

  listaMacroprocesos() {
    return this.http
    .get<ResponseModel>(
      `${environment.api}Documento/ConsultarMacroprocesos`
    )
    .pipe(catchError(this.errorHandler));
  }

  listaTipoDocumentos() {
    return this.http
    .get<ResponseModel>(
      `${environment.api}Documento/ConsultarTipoDocumentos`
    )
    .pipe(catchError(this.errorHandler));
  }

  listaAreas() {
    return this.http
    .get<ResponseModel>(
      `${environment.api}Documento/ConsultarAreas`
    )
    .pipe(catchError(this.errorHandler));
  }

  listarDepartamentos() {
    return this.http
    .get<ResponseModel>(
      `${environment.api}Documento/ConsultarDepartamentos`
    )
    .pipe(catchError(this.errorHandler));
  }

  guardarDocumento(documento: Documento) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = documento;
    return this.http
      .post<ResponseModel>(`${environment.api}Documento/CargarDocumentos`, body, {headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  actualizarDocumento(documento: Documento) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = documento;
    return this.http
      .put<ResponseModel>(`${environment.api}Documento/ActualizarDocumento`, body, {headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  obtenerDocumento(request: number) {
    return this.http
      .get<ResponseModel>(`${environment.api}Documento/ObtenerDocumento?codigo=${request}`)
      .pipe(catchError(this.errorHandler));
  }

  consultarVersionDocumento(codigo: number, version: string) {
    return this.http
      .get<ResponseModel>(`${environment.api}Documento/ConsultarVersionDocumento?codigo=${codigo}&version=${version}`)
      .pipe(catchError(this.errorHandler));
  }

  listarVersionDocumento(codigo: number) {
    return this.http
    .get<ResponseModel>(`${environment.api}Documento/ListaVersionDocumento?codigo=${codigo}`)
    .pipe(catchError(this.errorHandler));
  }

  buscarDocumentos(request: Documento) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = request;
    return this.http
      .post<ResponseModel>(`${environment.api}Documento/BuscarDocumentos`, body, {headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  descargarDocumento(codigo: number): Observable<{ blob: Blob, nombre: string, tipo: string, additionalData: any }> {
    return this.http.get(`${environment.api}Documento/DescargarDocumento?codigo=${codigo}`, { observe: 'response', responseType: 'blob' })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          let nombre = '';
          if (contentDisposition) {
            const matches = /filename\*?=(?:UTF-8'')?(.+)$/.exec(contentDisposition);
            if (matches && matches[1]) {
              nombre = decodeURIComponent(matches[1].replace(/"/g, ''));
            }
          }
          const tipo = response.headers.get('Content-Type') || '';
          return {
            blob: response.body as Blob,
            nombre: nombre,
            tipo: tipo,
            additionalData: response.headers
          };
        })
      );
  }

  descargarVersionDocumento(codigo: number, version: string): Observable<{ blob: Blob, nombre: string, tipo: string, additionalData: any }> {
    return this.http.get(`${environment.api}Documento/DescargarVersionDocumento?codigo=${codigo}&version=${version}`, { observe: 'response', responseType: 'blob' })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          let nombre = '';
          if (contentDisposition) {
            const matches = /filename\*?=(?:UTF-8'')?(.+)$/.exec(contentDisposition);
            if (matches && matches[1]) {
              nombre = decodeURIComponent(matches[1].replace(/"/g, ''));
            }
          }
          const tipo = response.headers.get('Content-Type') || '';
          return {
            blob: response.body as Blob,
            nombre: nombre,
            tipo: tipo,
            additionalData: response.headers
          };
        })
      );
  }

}
