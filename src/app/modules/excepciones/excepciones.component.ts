import { Component,OnInit,ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Comisiones } from 'src/app/models/comisiones.models';
import { GestionService } from 'src/app/helper/gestion.service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.css'],
  standalone: true,
    imports: [DialogModule, MatTableModule,MatPaginatorModule,MatExpansionModule, ConfirmDialogModule, ToastModule,FormsModule, ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatDatepickerModule],
    providers: [ConfirmationService, MessageService]
})
export class ExcepcionesComponent implements OnInit{
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: string = '';
  classGrid: string = 'col-md-4 col-sm-6 pt-3';
  excepcionFormGroup = this._formBuilder.group({
    ramo: [''],
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
  codigoDocumentoVersion: number = 0;
  nombreDocumentoVersion: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private _spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    // public dialog: MatDialog,
    // private route: ActivatedRoute,
    // private cargarService: CargarService,
    private gestionService: GestionService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    // private imprimirService: ImprimirService,
    // private router: Router,
    // private datePipe: DatePipe
  ) {}
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
        'RAMO',
        'COMERCIAL',
        'AGENTE',
        'POLIZA',
        'COBERTURA',
        'AGENTEDOS',
        'RAPPEL_UNO',
      ]
    
      this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';
    this.data.paginator = this.paginator;

  }

  consultar(){
    console.log("Consultar");
    const respuestaFalsa = [ { CODIGO_CIA: 1,RAMO:162, SUBCENTRAL: 99, ESTRUCTURAL: 9999,COMERCIAL:40, AGENTE: 99,POLIZA: 987,COBERTURA: 999, MONEDA:99,FECHA_VALIDEZ:"06/12/2009", AGENTEDOS:15,agentetres:15,RAPPEL_UNO:5,RAPPEL_DOS:10,ASESOR:99 } ]
    this.data = new MatTableDataSource<Comisiones>(respuestaFalsa);
  }

  clearScreen(): void {
    this.data = new MatTableDataSource<Comisiones>();
    this.excepcionFormGroup.reset();
  }

  goToAdd() {
    if (this.user === 'DEFAULT') {
      return;
    }
      this._spinner.show();
      const respuestaFalsa = [ { CODIGO_CIA: 1,RAMO:162, SUBCENTRAL: 99, ESTRUCTURAL: 9999,COMERCIAL:40, AGENTE: 99,POLIZA: 987,COBERTURA: 999, MONEDA:99,FECHA_VALIDEZ:"06/12/2009", AGENTEDOS:15,agentetres:15,RAPPEL_UNO:5,RAPPEL_DOS:10,ASESOR:99 } ]
      this.nombreDocumentoVersion = "Creación y Modificación de Datos";
      this.excepcionNuevoFormGroup.get('ramo')?.setValue('');
      this.excepcionNuevoFormGroup.get('subcentral')?.setValue('');
      this.excepcionNuevoFormGroup.get('estructural')?.setValue('');
      this.excepcionNuevoFormGroup.get('comercial')?.setValue('');
      this.visible = true;
      this._spinner.hide();
  }

  goToEdit(codigo: any, nombre:string) {
    let params = { codigo };
    let nombres = "Documento";
    if (this.user === 'DEFAULT') {
      return;
    }
      this._spinner.show();
      const respuestaFalsa = [ { CODIGO_CIA: 1,RAMO:162, SUBCENTRAL: 99, ESTRUCTURAL: 9999,COMERCIAL:40, AGENTE: 99,POLIZA: 987,COBERTURA: 999, MONEDA:99,FECHA_VALIDEZ:"06/12/2009", AGENTEDOS:15,agentetres:15,RAPPEL_UNO:5,RAPPEL_DOS:10,ASESOR:99 } ]
      this.nombreDocumentoVersion = "Creacion y Modificacion de Datos";
      this.codigoDocumentoVersion = codigo;
      this.visible = true;
      this.excepcionNuevoFormGroup.get('ramo')?.setValue('162');
      this.excepcionNuevoFormGroup.get('subcentral')?.setValue('90');
      this.excepcionNuevoFormGroup.get('estructural')?.setValue('9999');
      this.excepcionNuevoFormGroup.get('comercial')?.setValue('40');
      this._spinner.hide();
  }

  Buscar(){
    console.log("Buscar")
  }

  eliminarFila(codigo: any){
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
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Registro Borrado' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Rechazaste' });
        }
      });
  }

  grabar(){
    console.log("grabar");
  }
}
