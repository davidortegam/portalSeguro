import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // public decodedToken: { [key: string]: string; } | undefined;

  constructor() {}

  get token(): string {
    return localStorage.getItem(environment.tokenName) || '';
  }

  get decodedToken(): any {
    try {
      var decoded = jwt_decode(this.token);
      return decoded;
    } catch {
      return undefined;
    }
  }

  isValidToken() {
    return this.decodedToken ? true : false;
  }

  getExpiryTime(): number {
    return this.decodedToken ? Number(this.decodedToken['exp']) : 0;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();

    if (expiryTime * 1000 < new Date().getTime()) {
      return true;
    } else {
      return false;
    }
  }

  getCodUsuario(): string {
    const token = this.decodedToken;
    return token ? token['cod_usuario'] : '';
  }
}
