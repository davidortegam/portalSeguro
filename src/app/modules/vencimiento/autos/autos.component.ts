import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/models/response.model';
import { VencimientoService } from 'src/app/services/vencimiento.service';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { VencimientoAuto } from '../../../models/vencimiento.model';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogOverviewExampleDialog } from '../vencimiento.component';
import { ControlItem } from '../../../models/filtro.model';
import { Observable, filter, map, startWith } from 'rxjs';
import { GestionService } from '../../../helper/gestion.service';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';



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


export const _filterUnico = (value: string): string[] => {
  const filterValue = value.toLowerCase();
  const devuelve: string[] = [];
  return devuelve.filter(option => option.toLowerCase().includes(filterValue));
}

@Component({
  selector: 'app-autos',
  templateUrl: './autos.component.html',
  styleUrls: ['./autos.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    }
  ]
})
export class AutosComponent implements OnInit {

  panelOpenState = true;

  displayedColumns: string[] = [
    'RAMO',
    'PRODUCTO',
    'POLIZA',
    'TOMADOR',
    'AGENTE',
    'MARCA',
    'MODELO',
    'ANIOFABRICA',
    'PRIMANETACUMVIGENCIA',
    'SinUltimaVigencia',
    'NomModalidadPoliza',
    'NumPolizaGrupo',
    'NomPolizaGrupo',
    'NumContratoPoliza',
    'NomContratoPoliza',
    'CalculoPrimaRenovacion',
    'Tasa',
    'PropuestaRenovacion',
    'ACCION'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  rol: number = 0;
  @ViewChild('TABLE') table!: ElementRef;
  dataSource = new MatTableDataSource<VencimientoAuto>();
  rama!: ControlItem[];
  agente!: ControlItem[];
  poliza_grupo!: ControlItem[];
  estado_vencimiento: any[] = [
    { Key: 'Renovar', Value: 'Renovar' },
    { Key: 'No Renovar', Value: 'No Renovar' },
    { Key: 'Por Definir', Value: 'Por Definir' },
    { Key: '', Value: 'Todo' }
  ]

  myControl = new FormControl('');
  options!: ControlItem[];
  filteredOptions!: Observable<ControlItem[]>;
  seleccionado !: ControlItem[];
  consultaFormGroup = this._formBuilder.group({
    desde: [new Date('01-01-2015')],
    hasta: [new Date('01-02-2016')],
    ramo: [''],
    producto: [''],
    num_poliza_grupo: [''],
    nom_agente: [''],
    estado: ['Todos']
  });
  datePipe = new DatePipe('en-US');
  permiso: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private vencimientoService: VencimientoService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private gestionService: GestionService,
    private router: Router,
    public globalService: GlobalService
  ) {
    this.vencimientoService.consultarAccesoPagina(this.gestionService.obtenerUsuario())
      .subscribe((resp: ResponseModel) => {
        for (let permisos of resp.data) {
          if (permisos.CodPagina == 'SECTOR_AUTOS') {
            this.permiso = 'valido';
          }

        }
        if (this.permiso != 'valido') {
          this.router.navigate(['/home'])
        }
        this.permiso = '';
      });

    const initialDates = this.getInitialDates();
    this.consultaFormGroup = this._formBuilder.group({
      desde: [initialDates.fromDate],
      hasta: [initialDates.toDate],
      ramo: [''],
      producto: [''],
      num_poliza_grupo: [''],
      nom_agente: [''],
      estado: ['Todos']
    });
  }

  ngOnInit() {

    console.log('Rol' + this.gestionService.obtenerInfoCargoSuscriptorLocal().cod_rol);
    this.rol = this.gestionService.obtenerInfoCargoSuscriptorLocal().cod_rol;
    this.dataSource.paginator = this.paginator;
    this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';

    this.vencimientoService.consultarRamo('Autos').
      subscribe((resp: ResponseModel) => {
        this.rama = resp.data as ControlItem[];
      });
    this.vencimientoService.consultarPersona('Agente').
      subscribe((resp: ResponseModel) => {
        this.agente = resp.data as ControlItem[];
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
    this.consultaFormGroup.controls["producto"].setValue('');
    this.consultaFormGroup.controls["nom_agente"].setValue('');

    this.dataSource.data = [];
  }
  openDialog(element: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        element,
        origin: 'auto'
      }
    });

    dialogRef.componentInstance.formSubmit.subscribe(result => {
      if (result) {
        if (result.origin === 'auto') {
          const index = this.dataSource.data.findIndex(item => item.index === result.index);
          this.dataSource.data[index].Decision = result.decision;
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Autos');
    XLSX.writeFile(workBook, this.datePipe.transform(Date.now(), 'ddMMyyyy_HHmmss')! + '.xlsx');
  }

  buscar() {
    this.spinner.show();
    let pol_grupo = (<HTMLInputElement>document.getElementById('seleccione_grupo')).value;
    let separa_poliza_grupo = pol_grupo.split('-');

    this.vencimientoService.consultarTabla(this.consultaFormGroup.controls["ramo"].value ?? "0",
      this.consultaFormGroup.controls["producto"].value ?? "",
      this.datePipe.transform(this.consultaFormGroup.controls['desde'].value!, 'yyyy-MM-dd')!,
      this.datePipe.transform(this.consultaFormGroup.controls['hasta'].value!, 'yyyy-MM-dd')!,
      this.consultaFormGroup.controls["nom_agente"].value ?? "",
      separa_poliza_grupo[0] ?? "",

      this.consultaFormGroup.controls["estado"].value ?? "",

    ).subscribe((resp: ResponseModel) => {

      if (resp.succeeded == true) {
        const datos = resp.data.map((item: any, index: any) => ({ ...item, index }));
        this.dataSource = new MatTableDataSource<VencimientoAuto>(datos);
        this.dataSource.paginator = this.paginator;
        $("#descarga").removeAttr('disabled');
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

