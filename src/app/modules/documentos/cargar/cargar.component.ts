import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentosService } from 'src/app/services/documentos.service';
import { catchError, concat, finalize, forkJoin, map, Observable, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Documento } from 'src/app/models/documentos.models';
import { ResponseModel } from 'src/app/models/response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService } from 'src/app/helper/gestion.service';


@Component({
  selector: 'app-cargar-documentos',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css'],
  providers: [MessageService]
})
export class CargarDocumentosComponent implements OnInit, OnDestroy {

  user: string = '';

  @ViewChild('fileUpload', {static: false}) fileUpload: any;

  showButton: boolean = false;
  disableButton: boolean = false;
  textoAccionArchivo: string = 'subirlo';
  textBtn: string = 'Guardar';
  nombreArchivoAnterior: string = '';
  tipoArchivoAnterior: string = '';
  iconFile: string = 'pi pi-file';
  iconStyle: string = "font-size: 2.5rem;";

  uploadedFiles: any[] = [];

  selectedFile: File | null = null;
  base64File: string | null = null;
  tipoArchivo: string | null = null;
  auto: boolean = true;

  saveFormGroup: FormGroup;

  codigo: number = 0;
  actualVersionDoc: string = '';
  documento: Documento = {} as Documento;

  files: any[] = [];

  listaProcesos: any;
  listaMacroprocesos: any;
  listaMacroprocesosFiltrada: any;
  listaTipoDocumento: any;
  listaTipoDocumentoFiltrada: any;
  listaAreas: any;
  listaDepartamentos: any;
  listaDepartamentosFiltrada: any;
  

  private subscriptions: Subscription = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private _documentosService: DocumentosService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router,
    private gestionService: GestionService
  ) {
    this.saveFormGroup = this._formBuilder.group({
      codigoRef: ['', Validators.required],
      proceso: ['', Validators.required],
      macroProceso: ['', Validators.required],
      tipoDocumentos: [Validators.required],
      nombreDocumento: ['', Validators.required],
      versionDocumento: ['', Validators.required],
      area: ['', Validators.required],
      departamento: ['', Validators.required],
      solicitanteActualizacion: ['', Validators.required],
      responsableAutorizacion: ['', Validators.required],
      palabrasClaves: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.user = this.gestionService.obtenerUsuario();
    if (this.user === 'DEFAULT') {
      this._router.navigate(['/home'])
    }

    concat(
      this.loadData(),
      this.loadDocumento()
    ).subscribe();

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

  loadDocumento(): Observable<any> {
    this._spinner.show();
    return this._route.queryParams.pipe(
      switchMap(params => {
        const codigoDoc = parseFloat(params['codigo']);
        if (codigoDoc) {
          this.codigo = codigoDoc;
          this.textoAccionArchivo = 'actualizarlo';
          this.textBtn = 'Actualizar';
          return this._documentosService.obtenerDocumento(codigoDoc)
            .pipe(
              catchError((err) => {
                this._spinner.hide();
                this._toaster.error('Error obteniendo documento', err);
                return throwError(() => err);
              }),
              finalize(() => this._spinner.hide()),
              map((resp: ResponseModel | null) => {
                this.documento = resp?.data[0] as Documento;
                this.nombreArchivoAnterior = this.documento.NOMBRE_DOCUMENTO ?? '';
                this.tipoArchivoAnterior = this.defineTypeFile(this.documento.TIPO_ARCHIVO ?? '');
                this.actualVersionDoc = this.documento.VERSION_DOCUMENTO ?? '';
                this.saveFormGroup.setValue({
                  codigoRef: this.documento.CODIGO_REF ?? '',
                  proceso: this.documento.PROCESO ?? '',
                  macroProceso: this.documento.MACROPROCESO ?? '',
                  tipoDocumentos: this.documento.TIPO_DOCUMENTO ?? null,
                  nombreDocumento: this.documento.NOMBRE_DOCUMENTO ?? '',
                  versionDocumento: this.documento.VERSION_DOCUMENTO ?? '',
                  area: this.documento.AREA ?? '',
                  departamento: this.documento.DEPARTAMENTO ?? '',
                  solicitanteActualizacion: this.documento.SOLICITANTE_ACT ?? '',
                  responsableAutorizacion: this.documento.RESPONSABLE_AUT ?? '',
                  palabrasClaves: this.documento.PALABRAS_CLAVES ?? ''
                });
                this.handleChangeProceso(this.documento.PROCESO, false);
                return this.documento;
              })
            );
        } else {
          this._spinner.hide();
          return of(null);
        }
      })
    );
  }

  handleChangeProceso(event: any, isChangeForm: boolean) {
    const macroprocesoFiltro = this.listaMacroprocesos.filter((f: { COD_PROCESO: any; }) => f.COD_PROCESO === event);
    this.listaMacroprocesosFiltrada = macroprocesoFiltro;
    const tipoDocumentosFiltro = this.listaTipoDocumento.filter((f: { COD_PROCESO: any; }) => f.COD_PROCESO === event);
    this.listaTipoDocumentoFiltrada = tipoDocumentosFiltro;
    if (isChangeForm) {
      this.saveFormGroup.patchValue({ 
        macroProceso: '',
        tipoDocumentos: '' 
      });
    }

    this.updateRequiredAreaDep(event);
  }

  updateRequiredAreaDep(proceso: any) {
    const areaControl = this.saveFormGroup.get('area');
    const departamentoControl = this.saveFormGroup.get('departamento');
  
    if (proceso !== 'INF') {
      areaControl!.setValidators([Validators.required]);
      departamentoControl!.setValidators([Validators.required]);
    } else {
      areaControl!.clearValidators();
      departamentoControl!.clearValidators();
    }
  
    areaControl!.updateValueAndValidity();
    departamentoControl!.updateValueAndValidity();
  }

  handleChangeArea(event: any) {
    const departamentoFiltro = this.listaDepartamentos.filter((f: { COD_AREA: any; }) => f.COD_AREA === event);
    this.listaDepartamentosFiltrada = departamentoFiltro;
  }

  onFileChange(event: any) {
    if (event.currentFiles.length > 0) {
      this.selectedFile = event.currentFiles[0];
      this.tipoArchivo = event.currentFiles[0].type;
      this.convertToBase64(this.selectedFile).then((base64: string) => {
        this.base64File = base64;
      }).catch(error => {
        this._toaster.error("Error al cargar el archivo");
        console.error('Error converting file to base64: ', error);
      });
    }
  }

  convertToBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => {
        reject('Error converting file to base64: ' + error);
      };
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
        console.error('Error al descargar el documento:', error);
        this._toaster.error("Error al descargar el archivo");
      }
    })
  }

  verifyVersion(): void {
    if (this.codigo > 0) {
      this._spinner.show();
      const form = this.saveFormGroup.value;
      this._documentosService.consultarVersionDocumento(this.codigo, form.versionDocumento)
        .pipe(
          catchError((err) => {
            this._spinner.hide();
            this._toaster.error('Error consultando versión de documento', err);
            return throwError(() => err);
          }),
          finalize(() => this._spinner.hide())
        )
        .subscribe((resp: ResponseModel | null) => {
          if (resp?.data.length > 0) {
            if (resp?.data[0].VERSION_DOCUMENTO !== this.actualVersionDoc) {
              this._toaster.warning('Ya ha ingresado anteriormente esa versión para el documento');
              this.disableButton = true;      
            } else {
              this.disableButton = false;  
            }
          }
          else {
            this.disableButton = false;
          }
          return resp
        });
    }
    
  }

  saveOrEdit():void {
    if (this.codigo > 0) {
      this.edit();
    } else {
      this.save();
    }
  }

  save(): void {
    if (this.saveFormGroup.invalid) {
      this.markFormGroupTouched(this.saveFormGroup);
      this._toaster.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (!this.base64File) {
      this._toaster.warning('Por favor, cargue un documento.');
      return;
    }

    this._spinner.show();
    this.disableButton = true;

    const form = this.saveFormGroup.value
    this.documento.CODIGO_REF = form.codigoRef;
    this.documento.PROCESO = form.proceso;
    this.documento.MACROPROCESO = form.macroProceso;
    this.documento.TIPO_DOCUMENTO = form.tipoDocumentos;
    this.documento.NOMBRE_DOCUMENTO = form.nombreDocumento;
    this.documento.VERSION_DOCUMENTO = form.versionDocumento;
    this.documento.FECHA_CREACION = new Date();
    this.documento.FECHA_ACTUALIZACION = null;
    this.documento.AREA = form.area;
    this.documento.DEPARTAMENTO = form.departamento;
    this.documento.SOLICITANTE_ACT = form.solicitanteActualizacion;
    this.documento.RESPONSABLE_AUT = form.responsableAutorizacion;
    this.documento.PALABRAS_CLAVES = form.palabrasClaves;
    this.documento.TIPO_ARCHIVO = this.tipoArchivo;
    this.documento.BASE64 = this.base64File;
    
    this._documentosService.guardarDocumento(this.documento)
    .pipe(
      catchError((err) => {
        this._spinner.hide();
        this.disableButton = false;
        this._toaster.error('Error guardando documento', err);
        return throwError(() => err);
      }),
      finalize(() => this._spinner.hide())
    )
    .subscribe((resp: ResponseModel | null) => {
      this._toaster.success('Documento guardado con éxito');
      this.clearScreen()
      return resp
    });
  }

  edit(): void {
    if (this.saveFormGroup.invalid) {
      this.markFormGroupTouched(this.saveFormGroup);
      this._toaster.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this._spinner.show();

    const form = this.saveFormGroup.value;
    this.documento.CODIGO = this.codigo;
    this.documento.CODIGO_REF = form.codigoRef;
    this.documento.PROCESO = form.proceso;
    this.documento.MACROPROCESO = form.macroProceso;
    this.documento.TIPO_DOCUMENTO = form.tipoDocumentos;
    this.documento.NOMBRE_DOCUMENTO = form.nombreDocumento;
    this.documento.VERSION_DOCUMENTO = form.versionDocumento;
    this.documento.FECHA_ACTUALIZACION = new Date();
    this.documento.AREA = form.area;
    this.documento.DEPARTAMENTO = form.departamento;
    this.documento.SOLICITANTE_ACT = form.solicitanteActualizacion;
    this.documento.RESPONSABLE_AUT = form.responsableAutorizacion;
    this.documento.PALABRAS_CLAVES = form.palabrasClaves;
    this.documento.TIPO_ARCHIVO = this.tipoArchivo ?? '';
    this.documento.BASE64 = this.base64File ?? '';
    
    this._documentosService.actualizarDocumento(this.documento)
    .pipe(
      catchError((err) => {
        this._spinner.hide();
        this._toaster.error('Error actualizando documento', err);
        return throwError(() => err);
      }),
      finalize(() => this._spinner.hide())
    )
    .subscribe((resp: ResponseModel | null) => {
      this._toaster.success('Documento actualizado con éxito');
      this.clearScreen();
      this.loadDocumento().subscribe();
      return resp
    });
  }

  clearScreen(): void {
    this.disableButton = false;
    this.fileUpload.clear()
    this.selectedFile = null;
    this.uploadedFiles = [];
    this.base64File = null;
    this.saveFormGroup.reset()
  }

  onRemove(event: any) { 
    this.selectedFile = null;
    this.uploadedFiles = [];
    this.base64File = null;
  }

  goToNew() {
    this.clearScreen();
    this.codigo = 0;
    this.textoAccionArchivo = 'subirlo';
    this.textBtn = 'Guardar';
    this.nombreArchivoAnterior = '';
    this.tipoArchivoAnterior = '';
    this.iconFile = 'pi pi-file';
    this.iconStyle = "font-size: 2.5rem;";
    this._router.navigate(['/Procesos y manuales/cargar'])
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  defineTypeFile(type: string): string {
    if (type === 'application/pdf') {
      this.iconFile = 'pi pi-file-pdf';
      this.iconStyle = "font-size: 2.5rem;  color: #E02117;";
      return 'pdf';
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      this.iconFile = 'pi pi-file-word';
      this.iconStyle = "font-size: 2.5rem;  color: #176EE0;";
      return 'docx';
    } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.iconFile = 'pi pi-file-excel';
      this.iconStyle = "font-size: 2.5rem;  color: #0C8F0C;";
      return 'xlsx';
    } else if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      this.iconFile = 'pi pi-file';
      this.iconStyle = "font-size: 2.5rem;  color: #E05D17;";
      return 'ppt';
    } else {
      return '';
    }
  }

}
