import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cotizador de vida';
  panelOpenState = false;
  constructor(public globalService: GlobalService,private router: Router){
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        if (event.urlAfterRedirects === '/login')
          this.globalService.isLoginPage = true;
        else
          this.globalService.isLoginPage = false;

      });
  }
}
