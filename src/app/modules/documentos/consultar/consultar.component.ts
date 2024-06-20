import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, forkJoin, of, Subscription, tap, throwError, Observable } from 'rxjs';
import * as XLSX from 'xlsx-js-style';
import { Documento } from 'src/app/models/documentos.models';
import { DocumentosService } from 'src/app/services/documentos.service';
import { GestionService } from 'src/app/helper/gestion.service';


@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  user: string = '';
  classGrid: string = 'col-md-4 col-sm-6 pt-3';

  panelOpenState = true;
  data = new MatTableDataSource<Documento>();
  displayedColumns: string[] = [];
  dataVersion = new MatTableDataSource<Documento>();
  displayedVersionColumns: string[] = [];

  allProceso: string = "TP";
  allMacroproceso: string = "TM";
  allTiposDocumento: number = 0;
  allAreas: string = "TA";
  allDepartamentos: string = 'TD';

  listaProcesos: any;
  listaMacroprocesos: any;
  listaMacroprocesosFiltrada: any;
  listaTipoDocumento: any;
  listaTipoDocumentoFiltrada: any;
  listaAreas: any;
  listaDepartamentos: any;
  listaDepartamentosFiltrada: any;

  searchForm: Documento = {} as Documento;

  searchFormGroup = this._formBuilder.group({
    proceso: [''],
    macroProceso: [''],
    area: [''],
    departamento: [''],
    codigoRef: [''],
    tipoDocumentos: [0],
    nombreDocumento: [''],
    palabrasClaves: [''],
    fechaCreacionDesde: [],
    fechaCreacionhasta: [],
    fechaActualizacionDesde: [],
    fechaActualizacionhasta: [],
  })

  rangeDates: Date[] | undefined;

  documento: Documento = {} as Documento;

  visible: boolean = false;
  codigoDocumentoVersion: number = 0;
  nombreDocumentoVersion: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private _documentosService: DocumentosService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private _router: Router,
    private gestionService: GestionService
  ) { }

  ngOnInit(): void {
    this.user = this.gestionService.obtenerUsuario();
    this.classGrid = this.user === 'DEFAULT' ? 'col-md-4 col-sm-6 pt-3' : 'col-md-3 col-sm-6 pt-3';
    this.displayedColumns = this.user === 'DEFAULT' ?
      [
        'NOMBRE_DOCUMENTO',
        'NOM_MACROPROCESO',
        'SOLICITANTE_ACT',
        'FECHA_ACTUALIZACION'
      ] :
      [
        'ACCIONES',
        'NOM_PROCESO',
        'AREA',
        'DEPARTAMENTO',
        'CODIGO',
        'NOM_MACROPROCESO',
        'NOMBRE_DOCUMENTO',
        'VERSION_DOCUMENTO',
        'FECHA_CREACION',
        'FECHA_ACTUALIZACION'
      ]
    this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';
    this.data.paginator = this.paginator;

    this.displayedVersionColumns = [
      'NOMBRE_DOCUMENTO',
      'VERSION_DOCUMENTO',
      'RESPONSABLE_AUT',
      'SOLICITANTE_ACT',
      'FECHA_ACTUALIZACION'
    ]

    this.loadData().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadData(): Observable<any> {
    this._spinner.show();

    const dataProcesos = this._documentosService.listaProcesos();
    const dataMacroprocesos = this._documentosService.listaMacroprocesos();
    const dataTipoDocumentos = this._documentosService.listaTipoDocumentos();
    const dataAreas = this._documentosService.listaAreas();
    const dataDepartamentos = this._documentosService.listarDepartamentos();

    return forkJoin([dataProcesos, dataMacroprocesos, dataTipoDocumentos, dataAreas, dataDepartamentos])
      .pipe(
        tap(([procesosRes, macroprocesosRes, tipoDocumentosRes, areasRes, departamentosRes]) => {
          this.listaProcesos = procesosRes.data;
          this.listaMacroprocesos = macroprocesosRes.data;
          this.listaTipoDocumento = tipoDocumentosRes.data;
          this.listaAreas = areasRes.data;
          this.listaDepartamentos = departamentosRes.data;
          this._spinner.hide();
        }),
        catchError((error) => {
          console.error('Error fetching data:', error);
          this._spinner.hide();
          this._toaster.error("Error al cargar la data");
          return throwError(() => error);
        }),
        finalize(() => this._spinner.hide())
      );
  }

  handleChangeProceso(event: any) {
    const macroprocesoFiltro = event === 'TP' ? this.listaMacroprocesos : this.listaMacroprocesos.filter((f: { COD_PROCESO: any; }) => f.COD_PROCESO === event);
    this.listaMacroprocesosFiltrada = macroprocesoFiltro;
    const tipoDocumentosFiltro = this.listaTipoDocumento.filter((f: { COD_PROCESO: any; }) => f.COD_PROCESO === event);
    this.listaTipoDocumentoFiltrada = tipoDocumentosFiltro;
    this.searchFormGroup.patchValue({
      macroProceso: '',
      tipoDocumentos: null
    });
  }

  handleChangeArea(event: any) {
    const departamentoFiltro = this.listaDepartamentos.filter((f: { COD_AREA: any; }) => f.COD_AREA === event);
    this.listaDepartamentosFiltrada = departamentoFiltro;
  }

  keyWordFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  Buscar() {

    this._spinner.show();

    const form = this.searchFormGroup.value;
    this.searchForm.PROCESO = form.proceso === 'TP' ? null : form.proceso;
    this.searchForm.MACROPROCESO = form.macroProceso === 'TM' ? null : form.macroProceso;
    this.searchForm.AREA = form.area === 'TA' ? null : form.area;
    this.searchForm.DEPARTAMENTO = form.departamento === 'TD' ? null : form.departamento;
    this.searchForm.CODIGO_REF = form.codigoRef;
    this.searchForm.NOMBRE_DOCUMENTO = form.nombreDocumento;
    this.searchForm.TIPO_DOCUMENTO = form.tipoDocumentos === 0 ? null : form.tipoDocumentos;
    this.searchForm.PALABRAS_CLAVES = form.palabrasClaves;
    this.searchForm.Fecha_creacion_desde = form.fechaCreacionDesde;
    this.searchForm.Fecha_creacion_hasta = form.fechaCreacionhasta;
    this.searchForm.Fecha_actualizacion_desde = form.fechaActualizacionDesde;
    this.searchForm.Fecha_actualizacion_hasta = form.fechaActualizacionhasta;

    this._documentosService.buscarDocumentos(this.searchForm)
      .pipe(
        catchError((err) => {
          this._spinner.hide();
          this._toaster.error("Error al buscar los documentos");
          return throwError(() => err);
        }),
        finalize(() => this._spinner.hide())
      )
      .subscribe((res) => {
        this.data = new MatTableDataSource<Documento>(res.data);
        this.data.paginator = this.paginator;
      });
  }

  downloadFile(codigo: any, nombre: any) {

    this._spinner.show();

    this._documentosService.descargarDocumento(codigo)
      .pipe(
        finalize(() => this._spinner.hide())
      )
      .subscribe((response) => {
        try {
          const url = window.URL.createObjectURL(response.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombre;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error al descargar el archivo', error);
          this._toaster.error("Error al descargar el archivo");
        }
      })
  }

  exportToExcel(): void {
    const columnsToExport: (keyof Documento)[] = this.user === 'DEFAULT' ?
      [
        'NOMBRE_DOCUMENTO',
        'NOM_MACROPROCESO',
        'SOLICITANTE_ACT',
        'FECHA_ACTUALIZACION'
      ] :
      [
        'NOM_PROCESO',
        'AREA',
        'DEPARTAMENTO',
        'CODIGO',
        'NOM_MACROPROCESO',
        'NOMBRE_DOCUMENTO',
        'VERSION_DOCUMENTO',
        'FECHA_CREACION',
        'FECHA_ACTUALIZACION'
      ];
    const dataToExport = this.data.data.map((doc: Documento) => {
      const filteredDoc: { [key: string]: any } = {};
      columnsToExport.forEach((col) => {
        filteredDoc[col as string] = doc[col];
      });
      return filteredDoc;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    // estilos para el excel
    // Establecer estilos para las celdas de encabezado
    const headerCells = Object.keys(ws).filter(cell => cell.match(/^[A-Z]+1$/));
    headerCells.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = { font: { bold: true } };
      }
    });

    // Fijar el mismo ancho para todas las columnas
    const colWidth = 20;
    ws['!cols'] = Array(columnsToExport.length).fill({ wch: colWidth });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Documentos');
    XLSX.writeFile(wb, 'Documentos.xlsx');
  }

  downloadFileVersion(nombre: any, version: any) {

    this._spinner.show();

    this._documentosService.descargarVersionDocumento(this.codigoDocumentoVersion, version)
      .pipe(
        finalize(() => this._spinner.hide())
      )
      .subscribe((response) => {
        try {
          const url = window.URL.createObjectURL(response.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombre;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error('Error al descargar el archivo', error);
          this._toaster.error("Error al descargar el archivo");
        }
      })
  }

  showDialog(codigo: number, nombre: string) {
    if (this.user === 'DEFAULT') {
      return;
    }
    this._spinner.show();

    this._documentosService.listarVersionDocumento(codigo)
      .pipe(
        catchError((err) => {
          this._spinner.hide();
          this._toaster.error("Error al buscar versiones del documento");
          return throwError(() => err);
        }),
        finalize(() => this._spinner.hide())
      )
      .subscribe((res) => {
        this.dataVersion = new MatTableDataSource<Documento>(res.data);
        this.nombreDocumentoVersion = `Histórico de ${nombre}`;
        this.codigoDocumentoVersion = codigo;
      });

    this.visible = true;
  }

  clearScreen(): void {
    this.data = new MatTableDataSource<Documento>();
    this.searchFormGroup.reset();
  }

  goToEdit(codigo: any) {
    let params = { codigo };
    this._router.navigate(['/Procesos y manuales/administracion'], { queryParams: params });
  }

}
