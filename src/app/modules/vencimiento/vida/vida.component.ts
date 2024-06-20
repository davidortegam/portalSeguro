import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/models/response.model';
import { VencimientoService } from 'src/app/services/vencimiento.service';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { PrimaNetaVida, SinestralidadUltVigeVida, TomadorVida, VencimientoVida } from '../../../models/vencimiento.model';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { debug } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { DialogOverviewExampleDialog, PopUpComponent } from '../vencimiento.component';
import { ControlItem } from '../../../models/filtro.model';
import { Observable,  map,  startWith } from 'rxjs';
import { GestionService } from '../../../helper/gestion.service';
import { Router } from '@angular/router';

export class AppDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  override format(date: Date, displayFormat: any): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}

@Component({
  selector: 'app-vida',
  templateUrl: './vida.component.html',
  styleUrls: ['./vida.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    }
  ]
})
export class VidaComponent implements OnInit {

  panelOpenState = true;

  displayedColumns: string[] = [
    'POLIZA',
    'IDSOLICITANTE',
    'TOMADOR',
    'RIESGOS',
    'AGENTE',
    'EJECUTIVOMAPFRE',
    'FACULTATIVO',
    'SUMA_ASEGURADA',
    'PRIMANETA_ACUMVIGENCIA',
    'SINIESTRALIDADULTTIMAVIG',
    'NUMCUOTASVENCIDAS',
    'COMISION',
    'POLIZAGRUPO',
    'ACCION'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dtOptions: any;
  @ViewChild('TABLE') table!: ElementRef;
  dataSource = new MatTableDataSource<VencimientoVida>();
  rama!: ControlItem[];
  agente!: ControlItem[];
  ejecutivos!: ControlItem[];
  modalidades!: ControlItem[];
  myControl = new FormControl('');
  options!: ControlItem[];
  filteredOptions!: Observable<ControlItem[]>;
  estado_vencimiento: any[] = [
    { Key: 'Renovar', Value: 'Renovar' },
    { Key: 'No Renovar', Value: 'No Renovar' },
    { Key: 'Por Definir', Value: 'Por Definir' },
    { Key: '', Value: 'Todo' }
  ]

  consultaFormGroup = this._formBuilder.group({
    desde: [new Date('01-01-2022')],
    hasta: [new Date('01-02-2022')],
    ramo: [''],
    producto: [''],
    poliza: [''],
    nombreAgente: [''],
    ejecutivo: [''],
    modalidad: [''],
    polizaGrupo: [''],
    estado: ['']
  });
  datePipe = new DatePipe('en-US');

  visibleTomador: boolean = false;
  dataTomador = new MatTableDataSource<TomadorVida>();
  displayedColumnsTomador = [
    'fechaNacimiento',
    'generoTomador'
  ];
  visiblePrima: boolean = false;
  dataPrima = new MatTableDataSource<PrimaNetaVida>();
  displayedColumnsPrima = [
    'extraPrima',
    'desctTecnico',
    'desctComercial',
    'desctFormaPage'
  ];
  visibleSiniestro: boolean = false;
  dataSiniestro = new MatTableDataSource<SinestralidadUltVigeVida>();
  displayedColumnsSiniestro = [
    'cantidadSiniestros',
    'indemnizaTotalVigencia',
    'reservaSiniestros',
    'vigencia',
    'numeroRiesgos'
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,

    private vencimientoService: VencimientoService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private gestionService: GestionService,
    private router: Router,
  ) {
    let permiso = '';
    this.vencimientoService.consultarAccesoPagina(this.gestionService.obtenerUsuario())
      .subscribe((resp: ResponseModel) => {


        for (let permisos of resp.data) {
          if (permisos.CodPagina == 'SECTOR_VIDA') {
            permiso = 'valido';
          }

        }
        if (permiso != 'valido') {
          this.router.navigate(['/home'])
        }
        permiso = '';
      });
    const initialDates = this.getInitialDates();
    this.consultaFormGroup = this._formBuilder.group({
      desde: [initialDates.fromDate],
      hasta: [initialDates.toDate],
      ramo: [''],
      producto: [''],
      poliza: [''],
      nombreAgente: [''],
      ejecutivo: [''],
      modalidad: [''],
      polizaGrupo: [''],
      estado: ['']
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';

    this.vencimientoService.consultarRamo('Vida').
      subscribe((resp: ResponseModel) => {
        this.rama = resp.data as ControlItem[];
      });
    this.vencimientoService.consultarPersona('Agente').
      subscribe((resp: ResponseModel) => {
        this.agente = resp.data as ControlItem[];
      });
    this.vencimientoService.consultarPersona('Ejecutivo').
      subscribe((resp: ResponseModel) => {
        this.ejecutivos = resp.data as ControlItem[];
      });
    this.vencimientoService.consultarPolizaGrupo().
      subscribe((resp: ResponseModel) => {
        this.options = resp.data as ControlItem[];
      });

    this.filteredOptions = this.myControl
      .valueChanges.pipe(
        startWith(''),
        map(label => this._filterGroup(label || '')),
      );
    
  }

  limpiarFiltros() {
    const initialDates = this.getInitialDates();
    this.consultaFormGroup.controls["desde"].setValue(initialDates.fromDate);
    this.consultaFormGroup.controls["hasta"].setValue(initialDates.toDate);
    this.consultaFormGroup.controls["ramo"].setValue('');
    this.consultaFormGroup.controls["producto"].setValue('');
    this.consultaFormGroup.controls["poliza"].setValue('');

    this.consultaFormGroup.controls["nombreAgente"].setValue('');
    this.consultaFormGroup.controls["ejecutivo"].setValue('');
    this.consultaFormGroup.controls["modalidad"].setValue('');

    this.consultaFormGroup.controls["polizaGrupo"].setValue('');
    this.consultaFormGroup.controls["estado"].setValue('');

    this.dataSource.data = [];
  }

  cargarModalidades(event: any) {

    console.log(event);
    this.vencimientoService.consultarModalidadPoliza('629').
      subscribe((resp: ResponseModel) => {
        this.modalidades = resp.data as ControlItem[];
      });
  }
  private _filterGroup(label: string): ControlItem[] {
    let devuelve: ControlItem[] = [];
    if (label) {
      const filterValue = label.toUpperCase();
      devuelve = this.options.filter(option => option.LABEL.includes(filterValue));
      return devuelve;

    }
    return this.options;
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        element,
        origin: 'vida'
      }
    });

    dialogRef.componentInstance.formSubmit.subscribe(result => {
      if (result) {
        if (result.origin === 'vida') {
          const index = this.dataSource.data.findIndex(item => item.index === result.index);
          this.dataSource.data[index].PropuestaRenovacion = result.decision;
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
  
  openDialog2(element: any): void {
    this.dataTomador.data = [];
    const tomador = {} as TomadorVida;
    tomador.id = 1;
    tomador.fechaNacimiento = element.FecNacimientoTomador;
    tomador.generoTomador = element.GeneroTomador;
    this.dataTomador.data.push(tomador);
    this.dataTomador.data = [...this.dataTomador.data];
  
    this.visibleTomador = true;

    // const dialogRef = this.dialog.open(PopUpComponent, {
             
    //   data: {
    //     htmlContent: `<div>
    //                     <p>Fecha de nacimiento : ${element.FecNacimientoTomador}</p>
    //                     <p>Género del Tomador : ${element.GeneroTomador}</p>
    //                   </div>`
    //         }
  
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log('Dialog result:', result);
    // });
  }

  openDialog3(element: any): void {
    this.dataPrima.data = [];
    const primaNeta = {} as PrimaNetaVida;
    primaNeta.id = 1;
    primaNeta.extraPrima = element.ExtraPrima;
    primaNeta.desctTecnico = element.DesctoTecnico;
    primaNeta.desctComercial = element.DesctoComercial;
    primaNeta.desctFormaPago = element.DesctoFormaPago;
    this.dataPrima.data.push(primaNeta);
    this.dataPrima.data = [...this.dataPrima.data];

    this.visiblePrima = true;

    // const dialogRef = this.dialog.open(PopUpComponent, {

    //   data: {
    //     htmlContent: `<div>
    //                     <p>Extra Prima : ${element.ExtraPrima}</p>
    //                     <p>Descuento Técnico: ${element.DesctoTecnico}</p>
    //                     <p>Descuento Comercial : ${element.DesctoComercial}</p>
    //                     <p>Descuento Por Forma de Pago: ${element.DesctoFormaPago}</p>
    //                   </div>` }

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log('Dialog result:', result);
    // });
  }

  openDialog4(element: any): void {
    this.dataSiniestro.data = [];
    const siniestro = {} as SinestralidadUltVigeVida;
    siniestro.id = 1;
    siniestro.cantidadSiniestros = element.SinHistorica;
    siniestro.indemnizaTotalVigencia = element.IndemnizaTotalVigencia;
    siniestro.reservaSiniestros = element.ReservaSiniestrosHistorico;
    siniestro.vigencia = element.FinalVigenciaPoliza;
    siniestro.numeroRiesgos = element.NumRiesgos;
    this.dataSiniestro.data.push(siniestro);
    this.dataSiniestro.data = [...this.dataSiniestro.data];

    this.visibleSiniestro = true;

    // const dialogRef = this.dialog.open(PopUpComponent, {

    //   data: {
    //     htmlContent: `<div>
    //                     <p>Cantidad de Siniestros : ${element.SinHistorica}</p>
    //                     <p>Indemniza Total Vigencia: ${element.IndemnizaTotalVigencia}</p>
    //                     <p>Reserva de Siniestros : ${element.ReservaSiniestrosHistorico}</p>
    //                     <p>Vigencia: ${element.FinalVigenciaPoliza}</p>
    //                     <p>Número de Riesgos: ${element.NumRiesgos}</p>
    //                   </div>` }

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log('Dialog result:', result);
    // });
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Vida');
    XLSX.writeFile(workBook, this.datePipe.transform(Date.now(), 'ddMMyyyy_HHmmss')! + '.xlsx');
  }

  buscar() {
    this.spinner.show();

    let pol_grupo = (<HTMLInputElement>document.getElementById('seleccione_grupo')).value;
    let separa_poliza_grupo = pol_grupo.split('-');
    console.log(separa_poliza_grupo);


    this.vencimientoService.
      consultarTablaVida(
      this.consultaFormGroup.controls["ramo"].value ?? "0",
      this.consultaFormGroup.controls["producto"].value ?? "",
      this.consultaFormGroup.controls["poliza"].value ?? "",
      this.datePipe.transform(this.consultaFormGroup.controls['desde'].value!, 'yyyy-MM-dd')!,
      this.datePipe.transform(this.consultaFormGroup.controls['hasta'].value!, 'yyyy-MM-dd')!,
      this.consultaFormGroup.controls["nombreAgente"].value ?? "",
      this.consultaFormGroup.controls["ejecutivo"].value ?? "",
      this.consultaFormGroup.controls["modalidad"].value ?? "",
      separa_poliza_grupo[0] ?? "",
      this.consultaFormGroup.controls["estado"].value ?? ""
      ).subscribe((resp: ResponseModel) => {

      if (resp.succeeded == true) {
        const datos = resp.data.map((item: any, index: any) => ({ ...item, index }));
        this.dataSource = new MatTableDataSource<VencimientoVida>(datos);
        this.dataSource.paginator = this.paginator;
        $("#descargaVida").removeAttr('disabled');
        
      }
      else {
        this.toaster.warning(resp.message, 'Información');
      }
      this.spinner.hide();
    },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      })
  }

  getInitialDates(): { fromDate: Date, toDate: Date } {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 45);

    const firstDayOfMonth = new Date(futureDate.getFullYear(), futureDate.getMonth(), 1);
    const lastDayOfMonth = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0);

    return { fromDate: firstDayOfMonth, toDate: lastDayOfMonth };
  }
}
