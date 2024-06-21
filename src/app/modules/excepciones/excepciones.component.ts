import { Component,OnInit,ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Comisiones } from 'src/app/models/comisiones.models';
import { GestionService } from 'src/app/helper/gestion.service';
import { ComisionService } from 'src/app/services/comision.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { catchError, finalize, forkJoin, of, Subscription, tap, throwError, Observable } from 'rxjs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { Console } from 'console';

@Component({
  selector: 'app-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.css'],
  standalone: true,
    imports: [DialogModule, MatSelectModule, MatTableModule,MatPaginatorModule,MatExpansionModule, ConfirmDialogModule, ToastModule,FormsModule, ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatDatepickerModule],
    providers: [ConfirmationService, MessageService, ComisionService]
})
export class ExcepcionesComponent implements OnInit{
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: string = '';
  classGrid: string = 'col-md-4 col-sm-6 pt-3';
  busquedaFormGroup = this._formBuilder.group({
    ramo: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
    subcentral: [''],
    estructural: [''],
    comercial: [''],
    agente: [''],
    poliza: [''],
    cobertura: [''],
    fechaValidez: ['']
  });

  excepcionNuevoFormGroup = this._formBuilder.group({
    ramo: [''],
    subcentral: [''],
    estructural: [''],
    comercial: [''],
    agente: [''],
    poliza: [''],
    cobertura: [''], //ojito esto es un catalogo tal vz habria que crear n micro para que cargue esos datos
    moneda: [''],
    ingresoFechaVal: [''],
    Agentenp: [''],
    Agentecartera: [''],
    Rapper: [''],
    RapperCartera: [''],
    Asesor: [''],
    AsesorCartera: [''],
    Objeto: [''],
    ObjetoAnulacion: [''],
    Observaciones: [''],
    PolizaGrupo: [''],
    ContratoPoliza: [''],
  });

  
  panelOpenState = true;
  data = new MatTableDataSource<Comisiones>();
  dataVersion = new MatTableDataSource<Comisiones>();
  displayedColumns: string[] = [];
  
  visible: boolean = false;
  codigoEdicion: number = 0;
  nombreDocumentoVersion: string = '';

  listaCobertura: any; 
  constructor(
    private _formBuilder: FormBuilder,
    private _spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _toaster: ToastrService,
    private _comisionService: ComisionService,
    // private route: ActivatedRoute,
    private gestionService: GestionService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    // private router: Router,
    // private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.user = this.gestionService.obtenerUsuario();
    this.classGrid = this.user === 'DEFAULT' ? 'col-md-4 col-sm-6 pt-3' : 'col-md-3 col-sm-6 pt-3';
    this.displayedColumns = this.user === 'DEFAULT' ?
      [
        'COMERCIAL',
        'AGENTE',
        'POLIZA',
        'COBERTURA'
      ] :
      [
        'ACCIONES',
        'Ramo',
        'Comercial',
        'Agente',
        'Poliza',
        'Cobertura',
        'Agentenp',
        'Rapper',
      ]
    
      this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';
    this.data.paginator = this.paginator;

  }

  loadData(): Observable<any> {
    this._spinner.show();
    const dataCobertura = this._comisionService.listarCobertura('90','01');

    return forkJoin([dataCobertura])
      .pipe(
        tap(([procesosRes]) => {
          this.listaCobertura = procesosRes.data;
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

  consultar(){
    console.log("Consultar");
    if (this.busquedaFormGroup.invalid) {
      this.markFormGroupTouched(this.busquedaFormGroup);
      this._toaster.warning('Por favor, complete todos los campos obligatorios, O corrija el tipo de dato');
      return;
    }
    const respuestaFalsa = [ { Ramo:'162', Subcentral: '99', Estructural: '9999',Comercial:'40', Agente: '99',Poliza: '987',Cobertura: '999', Moneda:'99',IngresoFechaVal:"06/12/2009", Agentenp:'15',Agentecartera:'15',Rapper:'5',RapperCartera:'10',Asesor:'99' },{ Ramo:'162', Subcentral: '99', Estructural: '9999',Comercial:'40', Agente: '99',Poliza: '987',Cobertura: '999', Moneda:'99',IngresoFechaVal:"06/12/2009", Agentenp:'15',Agentecartera:'15',Rapper:'5',RapperCartera:'10',Asesor:'99' }]
    this.data = new MatTableDataSource<Comisiones>(respuestaFalsa);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  clearScreen(): void {
    this.data = new MatTableDataSource<Comisiones>();
    this.busquedaFormGroup.reset();
  }

  clearScreenModal(): void {
    this.excepcionNuevoFormGroup.reset();
  }

  goToAdd() {
    if (this.user === 'DEFAULT') {
      return;
    }
      this._spinner.show();
      //const fechaActual = new Date().toISOString().split('T')[0];
      const fechaFormateada = this.formatearFecha(new Date()); 
      this.nombreDocumentoVersion = "Creación y Modificación de Datos";
      this.codigoEdicion = 0;
      this.excepcionNuevoFormGroup.get('ramo')?.setValue('');
      this.excepcionNuevoFormGroup.get('subcentral')?.setValue('');
      this.excepcionNuevoFormGroup.get('estructural')?.setValue('');
      this.excepcionNuevoFormGroup.get('comercial')?.setValue('');
      this.excepcionNuevoFormGroup.get('agente')?.setValue('');
      this.excepcionNuevoFormGroup.get('poliza')?.setValue('');
      this.excepcionNuevoFormGroup.get('cobertura')?.setValue('');
      this.excepcionNuevoFormGroup.get('moneda')?.setValue('');
      this.excepcionNuevoFormGroup.get('ingresoFechaVal')?.setValue(fechaFormateada);
      this.visible = true;
      this._spinner.hide();
  }

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  goToEdit(codigo: any, nombre:string) {
    console.log(codigo,nombre);
    if (this.user === 'DEFAULT') {
      return;
    }
      this._spinner.show();
      const respuestaFalsa = [ { CODIGO_CIA: 1,RAMO:162, SUBCENTRAL: 99, ESTRUCTURAL: 9999,COMERCIAL:40, AGENTE: 99,POLIZA: 987,COBERTURA: 999, MONEDA:99,FECHA_VALIDEZ:"06/12/2009", AGENTEDOS:15,agentetres:15,RAPPEL_UNO:5,RAPPEL_DOS:10,ASESOR:99 } ]
      this.nombreDocumentoVersion = "Creación y Modificación de Datos";
      this.codigoEdicion = 1;
      this.visible = true;
      this.excepcionNuevoFormGroup.get('ramo')?.setValue(respuestaFalsa[0].RAMO.toString());
      this.excepcionNuevoFormGroup.get('subcentral')?.setValue(respuestaFalsa[0].SUBCENTRAL.toString());
      this.excepcionNuevoFormGroup.get('estructural')?.setValue(respuestaFalsa[0].ESTRUCTURAL.toString());
      this.excepcionNuevoFormGroup.get('comercial')?.setValue(respuestaFalsa[0].COMERCIAL.toString());
      this.excepcionNuevoFormGroup.get('agente')?.setValue(respuestaFalsa[0].AGENTE.toString());
      this.excepcionNuevoFormGroup.get('poliza')?.setValue(respuestaFalsa[0].POLIZA.toString());
      this.excepcionNuevoFormGroup.get('cobertura')?.setValue(respuestaFalsa[0].COBERTURA.toString());
      this.excepcionNuevoFormGroup.get('moneda')?.setValue(respuestaFalsa[0].MONEDA.toString());
      this.excepcionNuevoFormGroup.get('ingresoFechaVal')?.setValue(respuestaFalsa[0].FECHA_VALIDEZ.toString());
      this._spinner.hide();
  }

  eliminarFila(codigo: any){
    console.log(codigo);
    this.confirmationService.confirm({
        message: 'Estas seguro de Eliminar el Registro?',
        header: 'Confirmación de Borrar',
        icon: 'pi pi-question-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"pi pi-check",
        rejectIcon:"pi pi-times",
        acceptLabel: "Si",
        defaultFocus: "reject",

        accept: () => {
            //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Registro Borrado' });
            this._toaster.error('Registro Borrado');
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Rechazaste' });
            this._toaster.info('Se rechazó la operación');
        }
      });
  }

  grabar(){ 
    if (this.excepcionNuevoFormGroup.valid) {
      const valores = this.excepcionNuevoFormGroup.value;
      const comision: Comisiones = {
        Ramo: valores.ramo,
        Subcentral: valores.subcentral,
        Estructural:  valores.estructural,
        Comercial:  valores.comercial,
        Agente:  valores.agente,
        Poliza:  valores.poliza,
        Cobertura:  valores.cobertura,
        Moneda:  valores.moneda,
        IngresoFechaVal: valores.ingresoFechaVal,
        Agentenp: valores.agente,
        Agentecartera: valores.Agentecartera,
        Rapper: valores.Rapper,
        RapperCartera: valores.RapperCartera,
        Asesor: valores.Asesor,
        AsesorCartera:valores.AsesorCartera,
        Objeto: valores.Objeto,
        ObjetoAnulacion : valores.ObjetoAnulacion,
        Observaciones: valores.Observaciones,
        PolizaGrupo: valores.PolizaGrupo,
        ContratoPoliza: valores.ContratoPoliza,
      };

      this._comisionService.agregarExcepcion(
        comision
      ).subscribe(
        (respuesta) => {
          // Manejar la respuesta exitosa
          console.log('Grabación exitosa:', respuesta);
          Swal.fire({
            title: "Éxito!",
            text: "Registro actualizado con éxito",
            icon: "success"
          });
        },
        (error) => {
          // Manejar el error
          console.error('Error al grabar:', error);
          Swal.fire({
            title: "Oops!",
            text: "Ocurrió un error, vuelva a intentar",
            icon: "error"
          });
          this.visible = false;
        }
      );
    } else {
      // El formulario no es válido, manejar el error
      console.error('El formulario no es válido');
    }
  }
}
