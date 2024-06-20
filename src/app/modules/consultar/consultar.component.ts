import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/models/response.model';
import { CotizarService } from 'src/app/services/cotizar.service';
import { ImprimirService } from 'src/app/services/imprimir.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css'],
})
export class ConsultarComponent implements OnInit {
  sector: string | null = '';
  ConsultFormGroup = this._formBuilder.group({
    ramo: ['', Validators.required],
    modalidad: ['', Validators.required],
    riesgo: [],
    cod_docum: [],
    cotizacion: [],
    desde: [Date.now()-7, Validators.required],
    hasta: [Date.now(), Validators.required],
  });
  displayedColumns: string[] = [
    'fecha',
    'cotizacion',
    'estado',
    'producto',
    'modalidad',
    'valor',
    'asegurado',
    'reporte'
  ];
  dataSource: any[] = [];
  producto: Generica[] = [];
  modalidad: Generica[] = [];
  sectorV: any;
  ramoV: any;
  modalidadV: any;
  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private cotizaService: CotizarService,
    private imprimirService: ImprimirService,
    private router: Router,
    private datePipe: DatePipe
  ) {}
  
  ngOnInit(): void {
    this.sector = this.route.snapshot.paramMap.get('sector');
    this.cargarRamo();
    this.ConsultFormGroup.controls['desde'].setValue(Date.now());
  }

  cargarRamo() {
    this.spinner.show();
    this.cotizaService.obtenerRamo(this.sector!, '1').subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded && resp.data.length > 0) {
          this.producto = resp.data;
        } else {
          this.toaster.warning(
            'No tiene productos asignados en el sector seleccionado',
            'Información'
          );
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
  consultar(){
    this.spinner.show();
    this.imprimirService.consultarCotizaciones(this.ConsultFormGroup.controls['ramo'].value!,this.datePipe.transform(this.ConsultFormGroup.controls['desde'].value!,'yyyy-MM-dd')!,this.datePipe.transform(this.ConsultFormGroup.controls['hasta'].value!,'yyyy-MM-dd')!,this.ConsultFormGroup.controls['modalidad'].value!).subscribe(
      //this.imprimirService.consultarCotizaciones("1",this.sector!,"871",this.datePipe.transform(this.ConsultFormGroup.controls['desde'].value!,'yyyy-MM-dd')!,this.datePipe.transform(this.ConsultFormGroup.controls['hasta'].value!,'yyyy-MM-dd')!,"87108").subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.dataSource = resp.data;
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
  descargarReporte(element:any){
    this.spinner.show();
    this.imprimirService.doc(element.NUM_POLIZA,"0").subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.toaster.success('Descargando pdf...');
                const linkSource = `data:application/pdf;base64,${resp.data}`;
                const downloadLink = document.createElement("a");
                const fileName = element.NUM_POLIZA+".pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
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
}
interface Generica {
  Key: string;
  Value: string;
}
interface Reporte {
}
