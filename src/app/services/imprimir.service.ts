import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ImprimirService {

  constructor(private http: HttpClient) { }

  consultarCotizaciones(cod_ramo:string,fec_desde:string,fec_hasta:string,cod_modalidad:string) {
    return this.http.get<ResponseModel>(`${environment.api}Imprimir/svcConsultarCotizaciones?cod_ramo=${cod_ramo}&fec_desde=${fec_desde}&fec_hasta=${fec_hasta}&cod_modalidad=${cod_modalidad}`).pipe(catchError(this.errorHandler));
  }
  doc(num_poliza:string,num_spto:string) {
    var request = {
      "val1":num_poliza,
      "val2":num_spto
    }
    return this.http.post<ResponseModel>(`${environment.api}Imprimir/svcObtenerToken`,request,{headers: new HttpHeaders({ timeout: `${20000}` })}).pipe(catchError(this.errorHandler));
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
