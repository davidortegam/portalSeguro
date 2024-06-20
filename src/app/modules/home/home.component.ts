import { Component, OnInit } from '@angular/core';
import { GestionService } from 'src/app/helper/gestion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  nombre:string='';
  constructor(private gestionService: GestionService){}
  ngOnInit(): void {
    this.nombre=this.gestionService.obtenerUsuarioNombre();
  }

}
