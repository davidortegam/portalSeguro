import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GestionService } from 'src/app/helper/gestion.service';
import { ResponseModel } from 'src/app/models/response.model';
import { CotizarService } from 'src/app/services/cotizar.service';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.scss'],
})
export class CotizarComponent implements OnInit {
  sector: string | null = '';
  ramoControl = new FormControl<Generica | null>(null, Validators.required);
  modalidadControl = new FormControl<Generica | null>(
    null,
    Validators.required
  );
  producto: Generica[] = [];
  modalidad: Generica[] = [];
  sectorV: any;
  ramoV: any;
  modalidadV: any;

  constructor(
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private cotizaService: CotizarService,
    private router: Router,
    private gestionService: GestionService
  ) {}
  ngOnInit(): void {
    this.sector = this.route.snapshot.paramMap.get('sector');
    this.cargarRamo();
  }

  cargarRamo() {
    this.spinner.show();
    this.cotizaService.obtenerRamo(this.sector!, '1').subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded && resp.data.length>0) {
          this.producto = resp.data;
          this.gestionService.guardaRamoNombre(resp.data[0].Key+' - '+resp.data[0].Value);
        } else {
          this.toaster.warning('No tiene productos asignados en el sector seleccionado', 'Información');
          this.router.navigate(['home']);
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }

  cargarModalidad(ramo: string) {
    this.spinner.show();
    this.cotizaService.obtenerModalidad(this.sector!, '1', ramo).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.modalidad = resp.data;
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }

  onselectionRamo(ramo: Generica, event: any) {
    if (event.isUserInput) {
      this.ramoV = ramo.Key;
      this.cargarModalidad(ramo.Key);
    }
  }
  onselectionModalidad(modalidad: Generica, event: any) {
    if (event.isUserInput) {
      this.modalidadV = modalidad.Key;
    }
  }
}

interface Generica {
  Key: string;
  Value: string;
}
