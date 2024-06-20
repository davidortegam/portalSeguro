import { CommonModule, DatePipe } from '@angular/common';
import { Component,OnInit, ViewChild, Inject, Input, EventEmitter, Output } from '@angular/core';
import { GestionService } from 'src/app/helper/gestion.service';
import { ResponseModel } from 'src/app/models/response.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VencimientoService } from '../../services/vencimiento.service';
import { Decision, Lista, VencimientoAuto } from '../../models/vencimiento.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-vencimiento',
  templateUrl: './vencimiento.component.html',
  styleUrls: ['./vencimiento.component.css']
})
export class VencimientoComponent implements OnInit{

  dataCargada: boolean = false;
  isHovered: { [key: string]: boolean } = {};

  seleccionado: string = '';
  combo: any[] = [];
  lista!: Lista[];
  permiso_pagina: any[] = [];
  constructor(private router: Router,
    private _spinner: NgxSpinnerService,
    private vencimientoService: VencimientoService,
    private gestionService: GestionService)
  { }

  ngOnInit() {
   
    this._spinner.show();
    this.vencimientoService.consultarAccesoPagina(this.gestionService.obtenerUsuario())
      .subscribe((resp: ResponseModel) => {
   
        this.permiso_pagina = resp.data;
        for (let permisos of this.permiso_pagina) {
          if (permisos.CodPagina == 'SECTOR_AUTOS') {
            this.combo.push('Autos');
          }
          if (permisos.CodPagina == 'SECTOR_VIDA') {
            this.combo.push('Vida');
          }
          if (permisos.CodPagina == 'SECTOR_GENERAL') {
            this.combo.push('General');
          }

        }
        
        this.dataCargada = true;
        this._spinner.hide();
      });
    
  }
  onSelected(value: any): void {

    this.seleccionado = value;

    if (this.seleccionado == 'Autos') {
      this.router.navigate(['/Vencimiento/autos']);
    }
    if (this.seleccionado == 'Vida') {
      this.router.navigate(['/Vencimiento/vida']);
    }
    if (this.seleccionado == 'General') {
      this.router.navigate(['/Vencimiento/general']);
    }
  }

  getIconClass(sector: string) {
    switch (sector) {
      case 'Vida':
        return 'pi-heart';
      case 'Autos':
        return 'pi-car';
      case 'General':
        return 'pi-user';
      default:
        return 'pi-info-circle';
    }
  }

  onMouseEnter(event: Event) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'translateY(-10px)';
    card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  }

  onMouseLeave(event: Event) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  }

  onMouseDown(event: Event) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'translateY(10px)';
    card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  }

  onMouseUp(event: Event) {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = 'translateY(-10px)';
    card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  }
  

}

@Component({
  selector: 'dialogo',
  templateUrl: 'dialogo.html',
  styleUrls: ['./vencimiento.component.css'
              ],
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatOptionModule,
    MatIconModule,
    FileUploadModule,
    ToastModule
  ],
  providers: [MessageService]
})

export class DialogOverviewExampleDialog implements OnInit {
  datos!: VencimientoAuto;
  base64String: string = '';
  estado: string = '';
  observacion_: string = '';
  estados: string[] = ['Renovar', 'No Renovar', 'Por Definir'];
  opcionSeleccionada!: string;
  valor: string = '';
  guarda_act: string = '1';
  @Input() progress = 0;
  onChange(event: any) {
    this.estado = event;
  }

  emisor: string = '';
  index: number | null | undefined;
  @Output() formSubmit = new EventEmitter<any>();

  @ViewChild('fileUpload', {static: false}) fileUpload: any;

  constructor(
    private vencimientoService: VencimientoService,
    private _formBuilder: FormBuilder,
    private gestionService: GestionService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
   @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }
 
  ngOnInit() {
    this.datos = this.data.element;
    this.emisor = this.data.origin;
    if (this.emisor === 'vida') {
      this.index = this.datos.index;
    }
    this.opcionSeleccionada = '';
    this.consultarDecision(this.dialogRef.componentInstance.data['Poliza']);
  }
  
  consultarDecision(element: string) {
    this.vencimientoService.consultarDecision(this.dialogRef.componentInstance.data['Poliza'], this.dialogRef.componentInstance.data['NumSpto'], this.dialogRef.componentInstance.data['NumRiesgos']  
    ).subscribe((resp) => {
      this.opcionSeleccionada = this.estados[Number(this.estados.findIndex(x => x === resp.p_decision))];
      this.observacion_ = resp.p_observaciones;
      this.guarda_act = (resp.p_observaciones || resp.p_decision) ? '2' : '1';
      this.base64String = resp.p_pdf_64;
    });
  };
  onNoClick(): void {
    this.dialogRef.close();
  }
  guardaFormGroup = this._formBuilder.group({
    num_poliza: [''],
    estado: [''],
    observacion: [''],
    pdf_64: ['']

  });
  subirArchivo(event: any) {
    console.log('event', event.target.files[0])
    const file = event.target.files[0];
    const reader = new FileReader; 
    reader.onloadend = () => {
      this.base64String = '';
      this.base64String = reader.result as string;
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Upload File
  showButton: boolean = false;
  selectedFile: File | null = null;
  onFileChange(event: any) {
    console.log('event new upload', event.currentFiles[0])
    this.selectedFile = event.currentFiles[0];
    const file = event.currentFiles[0]
    const reader = new FileReader; 
    reader.onloadend = () => {
      this.base64String = '';
      this.base64String = reader.result as string;
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  onRemove(event: any) {
    this.selectedFile = null;
    this.base64String = '';
  }
  //

  Guardar(observacion: string) {
    
    this.vencimientoService.guardarDecision(this.datos.Poliza ?? "",
                                            this.datos.NumSpto ?? "",
                                            this.datos.NumApli ?? "",
                                            this.datos.NumSptoApli ?? "",
                                            this.datos.NumRiesgos ?? "",
                                            this.base64String,
                                            observacion ?? "",
                                            this.guarda_act == '1' ? this.estado : (this.guarda_act == '2' ? this.opcionSeleccionada:''),
                                            this.guarda_act,
                                            this.gestionService.obtenerUsuario() ?? ""
    ).subscribe((resp) => {
      if (resp.succeeded == true) {
        this.formSubmit.emit({ index: this.datos.index, origin: this.emisor, decision: this.opcionSeleccionada });
        Swal.fire({
          title: "Éxito!",
          text: "Registro actualizado con éxito",
          icon: "success"
        });
       this.dialogRef.close();
      } else {
        Swal.fire({
          title: "Oops!",
          text: resp.data,
          icon: "error"
        });
       // this.dialogRef.close();
      }
    }, () => {
      Swal.fire({
        title: "Oops!",
        text: "Ocurrió un error, vuelva a intentar",
        icon: "error"
      });
     // this.dialogRef.close();
    });
  }
}

@Component({
  selector: 'popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['./vencimiento.component.css'],
  standalone: true
})
export class PopUpComponent {
  htmlContent!: string;
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.htmlContent = this.data.htmlContent;
  }

 
  onNoClick(): void {
    this.dialogRef.close();
  }
}
