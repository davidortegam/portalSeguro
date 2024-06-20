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
import { NumSiniestrosVigenciaGeneral, PolizaGeneral, VencimientoGeneral } from '../../../models/vencimiento.model';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { debug } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { DialogOverviewExampleDialog, PopUpComponent } from '../vencimiento.component';
import { ControlItem } from '../../../models/filtro.model';
import { Observable, map, startWith } from 'rxjs';
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
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  panelOpenState = true;

  displayedColumns: string[] = [
    'RAMO',
    'POLIZA',
    'TOMADOR',
    'EJECUTIVOMAPFRE',
    'SUSCRIPTOR',
    'TIPOCOASEGURO',
    'FACULTATIVO',
    'SINIESTROSVIGENCIA',
    'SINIESTRAULTVIGENCIA',
    'VALOR',
    'PROPRENOVACION',
    'ACCION'
  ];

  rama!: ControlItem[];
  agente!: ControlItem[];
  subscriptor!: ControlItem[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dtOptions: any;
  @ViewChild('TABLE') table!: ElementRef;
  dataSource = new MatTableDataSource<VencimientoGeneral>();

  myControl = new FormControl('');
  options!: ControlItem[];
  filteredOptions!: Observable<ControlItem[]>;

  faculta: any[] = [
    { Key: 'S', Value: 'Si' },
    { Key: 'N', Value: 'No' },
    { Key: '', Value: 'Todo' }
  ];
  estadoVencimiento: any[] = [
    { Key: 'Renovar', Value: 'Renovar' },
    { Key: 'Por Renovar', Value: 'Por Renovar' },
    { Key: 'Por Definir', Value: 'Por Definir' },
    { Key: '', Value: 'Todo' }
  ]

  consultaFormGroup = this._formBuilder.group({
    desde: [new Date('01-01-2022')],
    hasta: [new Date('01-02-2022')],
    ramo: [''],
    documentoTomador: [''],
    nombreTomador: [''],
    nombreAgente: [''],
    suscriptor: [''],
    facultativo: [''],
    polizaGrupo: [''],
    estado: ['']
  });
  datePipe = new DatePipe('en-US');

  visiblePoliza: boolean = false;
  dataPoliza = new MatTableDataSource<PolizaGeneral>
  displayedColumnsPoliza = [
    'producto',
    'sumaAsegurada',
    'primaNeta',
    'numeroCuotasVencidas',
    'porcentajeComision',
    'numeroPolizaGrupo'
  ]
  visibleNumSiniestros: boolean = false;
  dataNumSiniestros = new MatTableDataSource<NumSiniestrosVigenciaGeneral>
  displayedColumnsNumSiniestros = [
    'numeroSiniestro',
    'numeroRiesgo',
    'nombreRiesgo',
    'reserva',
    'valorPagado',
    'estadoSiniestro',
    'causaSiniestro'
  ]

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private gestionService: GestionService,
    private vencimientoService: VencimientoService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private router: Router
  ) {
    let permiso = '';
   
    this.vencimientoService.consultarAccesoPagina(this.gestionService.obtenerUsuario())
      .subscribe((resp: ResponseModel) => {


        for (let permisos of resp.data) {
          if (permisos.CodPagina == 'SECTOR_GENERAL') {
            permiso = 'valido';
          }

        }
        if (permiso != 'valido') {
          this.router.navigate(['/home']);
         
        }
        permiso = '';
      });

    const initialDates = this.getInitialDates();  
    this.consultaFormGroup = this._formBuilder.group({
      desde: [initialDates.fromDate],
      hasta: [initialDates.toDate],
      ramo: [''],
      documentoTomador: [''],
      nombreTomador: [''],
      nombreAgente: [''],
      suscriptor: [''],
      facultativo: [''],
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

    this.vencimientoService.consultarRamo('General').
      subscribe((resp: ResponseModel) => {
        this.rama = resp.data as ControlItem[];
      }
    );
    this.vencimientoService.consultarPersona('Agente').
      subscribe((resp: ResponseModel) => {
        this.agente = resp.data as ControlItem[];
      });
    this.vencimientoService.consultarPersona('Suscriptor').
      subscribe((resp: ResponseModel) => {
        this.subscriptor = resp.data as ControlItem[];
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
  private _filterGroup(label: string): ControlItem[] {
    let devuelve: ControlItem[] = [];
    if (label) {
      const filterValue = label.toUpperCase();
      devuelve = this.options.filter(option => option.LABEL.includes(filterValue));
      return devuelve;

    }
    return this.options;
  }

  limpiarFiltros() {

    const initialDates = this.getInitialDates();

    this.consultaFormGroup.controls["desde"].setValue(initialDates.fromDate);
    this.consultaFormGroup.controls["hasta"].setValue(initialDates.toDate);
    this.consultaFormGroup.controls["ramo"].setValue('');
    this.consultaFormGroup.controls["documentoTomador"].setValue('');
    this.consultaFormGroup.controls["nombreTomador"].setValue('');

    this.consultaFormGroup.controls["nombreAgente"].setValue('');
    this.consultaFormGroup.controls["suscriptor"].setValue('');
    this.consultaFormGroup.controls["facultativo"].setValue('');

    this.consultaFormGroup.controls["polizaGrupo"].setValue('');
    this.consultaFormGroup.controls["estado"].setValue('');

    this.dataSource.data = [];
    
  }

  enviarDocumento(event: any) {
    var documento=event.target.value;
    if (event.keyCode == 9) {
      this.vencimientoService.consultarTomador(documento).
        subscribe((resp: ResponseModel) => {
          let element = resp.data;
          this.consultaFormGroup.controls["nombreTomador"].setValue(element[0].LABEL);
        });
    }
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        element,
        origin: 'general'
      }
    });

    dialogRef.componentInstance.formSubmit.subscribe(result => {
      if (result) {
        if (result.origin === 'general') {
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
    this.dataPoliza.data = [];
    const polizaGeneral = {} as PolizaGeneral;
    polizaGeneral.id = 1;
    polizaGeneral.producto = element.Producto;
    polizaGeneral.sumaAsegurada = element.SumaAsegurada;
    polizaGeneral.primaNeta = element.PRIMA_NETA_ANUAL_ASEGURADO;
    polizaGeneral.numeroCuotasVencidas = element.NumCuotavencida;
    polizaGeneral.porcentajeComision = element.Comision;
    polizaGeneral.numeroPolizaGrupo = element.NumPolizaGrupo;
    this.dataPoliza.data.push(polizaGeneral);
    this.dataPoliza.data = [...this.dataPoliza.data];

    this.visiblePoliza = true;

    // const dialogRef = this.dialog.open(PopUpComponent, {

    //   data: {
    //     htmlContent: `<div>
    //                     <p>Producto : ${element.Producto}</p>
    //                     <p>Suma Asegurada : ${element.SumaAsegurada}</p>
    //                     <p>Prima Neta Acum Vigencia : ${element.PRIMA_NETA_ANUAL_ASEGURADO}</p>
    //                     <p>Número de cuotas vencidas : ${element.NumCuotavencida}</p>
    //                     <p>% Comisión : ${element.Comision}</p>
    //                     <p>Número Póliza Grupo : ${element.NumPolizaGrupo}</p>
    //                  </div>` }

    // });

    // dialogRef.afterClosed().subscribe(result => {
    
    // });
  }

  openDialog3(element: any): void {
    this.dataNumSiniestros.data = [];
    const numSiniestros = {} as NumSiniestrosVigenciaGeneral;
    numSiniestros.id = 1;
    numSiniestros.numeroSiniestro = element.NoSiniestrosIndemVigencia;
    numSiniestros.numeroRiesgo = element.NumRiesgos;
    numSiniestros.nombreRiesgo = '';
    numSiniestros.reserva = '';
    numSiniestros.valorPagado = null;
    numSiniestros.estadoSiniestro = '';
    numSiniestros.causaSiniestro = '';
    this.dataNumSiniestros.data.push(numSiniestros);
    this.dataNumSiniestros.data = [...this.dataNumSiniestros.data];

    this.visibleNumSiniestros = true;

    // const dialogRef = this.dialog.open(PopUpComponent, {

    //   data: {
    //     htmlContent: `<div>
    //                     <p>Número de Siniestro : ${element.NoSiniestrosIndemVigencia}</p>
    //                     <p>Número de Riesgo : ${element.NumRiesgos}</p>
    //                     <p>Nombre de Riesgo : </p>
    //                     <p>Reserva : ${element.ReservaSiniestrosHistorico}</p>
    //                     <p>Valor Pagado : </p>
    //                     <p>Estado del Siniestro : </p>
    //                     <p>Causa del Siniestro : </p>
    //                  </div>` }

    // });

    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'General');
    XLSX.writeFile(workBook, this.datePipe.transform(Date.now(), 'ddMMyyyy_HHmmss')! + '.xlsx');
  }

  buscar() {
    this.spinner.show();

    let pol_grupo = (<HTMLInputElement>document.getElementById('seleccione_grupo')).value;
    let separa_poliza_grupo = pol_grupo.split('-');
    

    this.vencimientoService.
      consultarTablaGeneral(
        this.consultaFormGroup.controls["ramo"].value ?? "0",
        this.datePipe.transform(this.consultaFormGroup.controls['desde'].value!, 'yyyy-MM-dd')!,
        this.datePipe.transform(this.consultaFormGroup.controls['hasta'].value!, 'yyyy-MM-dd')!,
        this.consultaFormGroup.controls["documentoTomador"].value ?? "",
        this.consultaFormGroup.controls["nombreAgente"].value ?? "",
        this.consultaFormGroup.controls["suscriptor"].value ?? "",
        this.consultaFormGroup.controls["facultativo"].value ?? "",
        separa_poliza_grupo[0] ?? "",
        this.consultaFormGroup.controls["estado"].value ?? ""
      ).subscribe((resp: ResponseModel) => {

        if (resp.succeeded == true) {
          const datos = resp.data.map((item: any, index: any) => ({ ...item, index }));
          this.dataSource = new MatTableDataSource<VencimientoGeneral>(datos);
          this.dataSource.paginator = this.paginator;
          $("#descargaGeneral").removeAttr('disabled');
                 
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
