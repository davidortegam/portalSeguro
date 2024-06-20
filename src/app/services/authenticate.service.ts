import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }

  validarUsuario(usuario:string, password:string) {
    const body = {
      "usuario":usuario,
      "password":password
    }
    return this.http.post<ResponseModel>(`${environment.api}Auth/LdapAuthenticateUser`,body).pipe(catchError(this.errorHandler));
  }

  obtenerRol(usuario:string) {
    return this.http.get<ResponseModel>(`${environment.api}Auth/GetVerificarOpciones?usuario=${usuario}`).pipe(catchError(this.errorHandler));
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
