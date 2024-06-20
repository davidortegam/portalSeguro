import { CommonModule, DatePipe } from '@angular/common';
import { OnInit, ChangeDetectionStrategy, Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GestionService } from 'src/app/helper/gestion.service';
import { CargarConsentimiento } from 'src/app/models/consentimiento.model';
import { ResponseModel } from 'src/app/models/response.model';
import { CargarService } from 'src/app/services/cargar.service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
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
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    }
]
})
export class AdministrarComponent  implements OnInit{
  displayedColumns: string[] = [
    // 'COD_CIA',
    'TIP_DOCUM',
    'COD_DOCUM',
    'PERSONA',
    // 'APE1_TERCERO',
    // 'APE2_TERCERO',
    // 'NOM_TERCERO',
    'EMAIL',
    'TLF_MOVIL',
    'NOM_DOMICILIO',
    // 'TIP_DOCUM_RP',
    // 'COD_DOCUM_RP',
    // 'APE1_TERCERO_RP',
    // 'APE2_TERCERO_RP',
    // 'NOM_TERCERO_RP',
    // 'EMAIL_RP',
    'MCA_ACEPTACION',
    'FECHA_ACEPTACION',
    'COD_USR_ACEPTACION',
    'FUENTE',
    'FEC_BAJA',
    'COD_USR_BAJA',
    'OBSERVACION',
    'ACCION'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('TABLE') table!: ElementRef;
  dataSource = new MatTableDataSource<CargarConsentimiento>();
  opciones: any[] = [
    { Key: 'S', Value: 'Aceptado' },
    { Key: 'N', Value: 'Rechazado' },
    { Key: 'T', Value: 'Todo' }
  ];
  found:boolean=false;
  datePipe = new DatePipe('en-US');
  consultaFormGroup = this._formBuilder.group({
    desde: [new Date('01-01-2020')],
    hasta: [new Date('01-01-3000')],
    documento: [''],
    persona: [''],
    estado: ['']
  });
  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    // private route: ActivatedRoute,
    private cargarService: CargarService,
    private gestionService: GestionService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    // private imprimirService: ImprimirService,
    private router: Router,
    
    // private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.gestionService.obtenerInfoCargoSuscriptorLocal().sectores.forEach((s:any)=>{
      s.opciones.find((o:any)=>{
        if(o.opc_value == "administrar"){
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
    this.consultaFormGroup.controls["estado"].setValue("T");
    // this.consultaFormGroup.controls['desde'].setValue(Date.now());
    // this.consultaFormGroup.controls['hasta'].setValue(Date.now());
    // this.openDialog("");
  }
  buscar(){
    this.spinner.show();
    this.cargarService.consultarTabla(this.consultaFormGroup.controls["persona"].value??"",this.consultaFormGroup.controls["documento"].value??"",this.consultaFormGroup.controls["estado"].value??"",this.datePipe.transform(this.consultaFormGroup.controls['desde'].value!,'yyyy-MM-dd')!,this.datePipe.transform(this.consultaFormGroup.controls['hasta'].value!,'yyyy-MM-dd')!).subscribe((resp:ResponseModel)=>{
      if(resp.succeeded == true){
        this.dataSource = new MatTableDataSource<CargarConsentimiento>(resp.data);
        this.dataSource.paginator = this.paginator;
      }else {
        this.toaster.warning(resp.message, 'Información');
      }
      this.spinner.hide();
    },
    () => {
      this.spinner.hide();
      this.toaster.error('No se pudo establecer la conexión');
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  representante(element:any){
    Swal.fire({
      title: "Representante legal",
      icon: "info",
      html: `
        <p> Tipo Documento: ${element.tip_docum_rp}</p>
        <p> Documento: ${element.cod_docum_rp}</p>
        <p> Nombre Persona: ${element.ape1_tercero_rp} ${element.ape2_tercero_rp} ${element.nom_tercero_rp}</p>
        <p> Email: ${element.email_rp}</p>
      `,
      confirmButtonColor: '#da2d25',
      showCloseButton: false,
      focusConfirm: false,
      confirmButtonText: 'Aceptar',
      imageHeight: 500,
      imageWidth: 500
    });
  }
  openDialog(element:any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscar();
    });
  }
  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, this.datePipe.transform(Date.now(),'ddMMyyyy_HHmmss')!+'.xlsx');
}
}
@Component({
  selector: 'dialog-baja',
  templateUrl: 'dialog-baja.html',
  styleUrls: ['./administrar.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    //MatDialogTitle,
    //MatDialogContent,
    //MatDialogActions,
    //MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog implements OnInit {
  constructor(
    private cargarService: CargarService,
    private gestionService: GestionService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
  }
  Baja(observacion:string){
    
    this.cargarService.darBaja(this.data.Id,this.gestionService.obtenerUsuario(),observacion).subscribe((resp)=>{
      if (resp.succeeded == true){
        Swal.fire({
          title: "Éxito!",
          text: "Registro actualizado con éxito",
          icon: "success"
        });
        this.dialogRef.close();
      }else{
        Swal.fire({
          title: "Oops!",
          text: resp.data,
          icon: "error"
        });
        this.dialogRef.close();
      }
    },()=>{
      Swal.fire({
        title: "Oops!",
        text: "Ocurrió un error, vuelva a intentar",
        icon: "error"
      });
      this.dialogRef.close();
    });
  }
}