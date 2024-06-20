import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { TokenService } from '../app/helper/token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {

    constructor(private router: Router, private tokenService: TokenService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.tokenService.isValidToken()) {
            if (this.tokenService.isTokenExpired()) {
                this.router.navigateByUrl('/login');
                return false;
            } else
                return true;
        } else {
            this.router.navigateByUrl('/login');
            return false;
        }
    }

}
