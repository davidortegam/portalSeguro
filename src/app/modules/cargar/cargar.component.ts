import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GestionService } from 'src/app/helper/gestion.service';
import { CargarConsentimiento } from 'src/app/models/consentimiento.model';
import { ResponseModel } from 'src/app/models/response.model';
import { CargarService } from 'src/app/services/cargar.service.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css'],
})
export class CargarComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'COD_CIA',
    'TIP_DOCUM',
    'COD_DOCUM',
    'APE1_TERCERO',
    'APE2_TERCERO',
    'NOM_TERCERO',
    'EMAIL',
    'TLF_MOVIL',
    'NOM_DOMICILIO',
    'TIP_DOCUM_RP',
    'COD_DOCUM_RP',
    'APE1_TERCERO_RP',
    'APE2_TERCERO_RP',
    'NOM_TERCERO_RP',
    'EMAIL_RP',
    'FECHA_ACEPTACION',
  ];
  dataSource = new MatTableDataSource<CargarConsentimiento>();
  data: any = [];
  correctas: number = 0;
  incorrectas: number = 0;
  file: any;
  arrayBuffer: any;
  filelist: any;
  value: number = 0;
  total: number = 0;
  errores: string[] = [];
  datePipe = new DatePipe('en-US');
  carga: CargarConsentimiento = {} as CargarConsentimiento;
  found:boolean=false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    // private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    // private route: ActivatedRoute,
    private cargarService: CargarService,
    private gestionService: GestionService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    private router: Router,
  ) // private imprimirService: ImprimirService,
  
  // private datePipe: DatePipe
  {}
  ngOnInit() {
    this.gestionService.obtenerInfoCargoSuscriptorLocal().sectores.forEach((s:any)=>{
      s.opciones.find((o:any)=>{
        if(o.opc_value == "cargar"){
          this.found = true;
        }
      });
    });
    if(this.found===false){
      this.router.navigate(['/home']);
    }
    this.dataSource.paginator = this.paginator;
    this._MatPaginatorIntl.itemsPerPageLabel = 'Registros por página';
    this._MatPaginatorIntl.firstPageLabel = 'Primera página';
    this._MatPaginatorIntl.lastPageLabel = 'Última página';
    this._MatPaginatorIntl.nextPageLabel = 'Siguiente';
    this._MatPaginatorIntl.previousPageLabel = 'Anterior';
  }
    cargar() {
      try{
    this.correctas = 0;
    this.incorrectas = 0;
    this.spinner.show();
    var i = 1;
    this.errores = [];
    this.data.forEach((c: any) => {
      c.cod_usr_aceptacion = this.gestionService.obtenerUsuario();
      c.fuente = 'CARGA MASIVA';
      if(c.FECHA_ACEPTACION.length <= 10 ){
        c.FECHA_ACEPTACION = c.FECHA_ACEPTACION.replace(/(\d+[/])(\d+[/])/, '$2$1');
      }
      var d = new Date(c.FECHA_ACEPTACION);
      c.FECHA_ACEPTACION = d.toISOString();
      this.cargarService.guardarTabla(c).subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.correctas++;
            i++;
          } else {
            this.errores.push(c.N + ' - ' + resp.message);
            this.incorrectas++;
            i++;
          }
        },
        () => {
          this.incorrectas++;
          i++;
          this.errores.push(c.N + ' - error');
          this.toaster.error('No se pudo establecer la conexión');
        }
      ).add(()=>{
        if(this.incorrectas+this.correctas == this.data.length){
          this.spinner.hide();
        }
        if (this.errores.length == this.incorrectas && this.incorrectas+this.correctas == this.data.length && this.errores.length > 0){
          this.enviarcorreo();
        }
      });
    });
  }catch(e){
    console.log(e);
    this.toaster.error("Error en formato");
    this.spinner.hide();
  }
  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {
        type: 'binary',
        cellDates: true,
      });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { raw: true });
      this.dataSource = new MatTableDataSource<CargarConsentimiento>(
        XLSX.utils.sheet_to_json(ws, { raw: true })
      );
      var i=1;
      this.dataSource.data.forEach((d:any)=>{
        d.N = i++;
        d.COD_DOCUM = d.COD_DOCUM.toString();
      });
      this.dataSource.paginator = this.paginator;
      this.data = this.dataSource.data;
    };
    reader.readAsBinaryString(target.files[0]);
  }
  verIncorrectas() {
    if (this.errores.length > 0) {
      const dialogRef = this.dialog.open(DialogIncorrectas, {
        data: this.errores,
      });
  
      // dialogRef.afterClosed().subscribe(result => {
      //   this.buscar();
      // });
    }
  }
  enviarcorreo() {
    this.spinner.show();
    this.errores.sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
    this.cargarService
      .enviarcorreo(this.gestionService.obtenerEmail(),"Errores Carga Masiva",
        this.errores
          .map(function (item) {
            return item;
          })
          .join('<br><br>')
      )
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.toaster.success('Correo enviado');
          } else {
            this.toaster.error('No se pudo enviar el correo');
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
@Component({
  selector: 'dialog-baja',
  templateUrl: 'dialog-incorrectas.html',
  styleUrls: ['./cargar.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule
    //MatDialogTitle,
    //MatDialogContent,
    //MatDialogActions,
    //MatDialogClose,
  ],
})
export class DialogIncorrectas implements OnInit {
  constructor(
    private cargarService: CargarService,
    private gestionService: GestionService,
    public dialogRef: MatDialogRef<DialogIncorrectas>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
  }
}