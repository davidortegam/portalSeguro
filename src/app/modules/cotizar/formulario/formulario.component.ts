import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CotizarService } from 'src/app/services/cotizar.service';
import { ResponseModel } from 'src/app/models/response.model';
import Swal from 'sweetalert2';
import {
  P2000060,
  P2000040,
  P2000020,
  P2000030,
  P2000031,
  PlyMpgS,
} from 'src/app/models/cargabuzones.models';
import { DatePipe, formatDate } from '@angular/common';
import { GestionService } from 'src/app/helper/gestion.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Tercero } from 'src/app/models/tercero.models';

@Component({
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  providers:[{provide: MAT_DATE_LOCALE, useValue: 'en_GB'}]
})
export class FormularioComponent implements OnInit {
  datePipe = new DatePipe('en-US');
  DatosAseguradoFormGroup = this._formBuilder.group({
    tip_docum: ['', Validators.required],
    cod_docum: ['', Validators.required],
    nom_tercero: ['', Validators.required],
    ape1_tercero: ['', Validators.required],
    ape2_tercero: ['', Validators.required],
    fec_nacimiento: ['', Validators.required],
    sexo: ['', Validators.required],
    tlf_numero: ['', Validators.required],
    email: ['', Validators.required],
    provincia: ['', Validators.required],
    ciudad: ['', Validators.required],
    parroquia: ['', Validators.required],
    direccion: ['', Validators.required],
    depExt: ['', Validators.required],
    ocupacion: ['', Validators.required],
    nivelRiesgo: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    broker: ['', Validators.required],
    ejecutivo: ['', Validators.required],
    oficina: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    descuento: [0, Validators.max(5)],
    recargo: [0, Validators.max(20)],
    primaTotal: [0, Validators.min(1)],
  });
  fourFormGroup = this._formBuilder.group({
    forma_pago: ['',Validators.required],
    desde: ['', Validators.required],
    hasta: ['', Validators.required],
  });
  events: string[] = [];
  tasa: any;
  ramo: string | null = '';
  sector: string | null = '';
  modalidad: string | null = '';
  infoTercero: any;
  riesgo: string = '';
  isFocus: boolean = false;
  isContado: boolean = false;
  displayedColumns: string[] = ['cobertura', 'suma', 'tasa', 'primaNetaAnual'];
  dataSource: Cobertura[] = [];
  datosVariables: DatosVariables[] = [];
  tipBenef: TipBenef[] = [];
  p2000030: P2000030 = {} as P2000030;
  p2000031: P2000031 = {} as P2000031;
  p2000020: P2000020 = {} as P2000020;
  p2000040: P2000040 = {} as P2000040;
  p2000060: P2000060 = {} as P2000060;
  Cargap2000020: P2000020[] = [];
  Cargap2000040: P2000040[] = [];
  Cargap2000060: P2000060[] = [];
  generos: Combo[] = [
    { Key: '1', Value: 'Masculino' },
    { Key: '0', Value: 'Femenino' },
  ];
  opciones: Combo[] = [
    { Key: '1', Value: 'Si' },
    { Key: '2', Value: 'No' },
  ];
  metodosPago: Combo[] = [];
  tipoDocumento: Combo[] = [
    { Key: 'CI', Value: 'CEDULA DE IDENTIDAD' },
    { Key: 'PS', Value: 'PASAPORTE' },
    { Key: 'RUC', Value: 'REGISTRO UNICO CONTRIBUYENTE' },
  ];
  formaPago: Combo[] = [];
  provincias: Combo[] = [];
  ciudad: Combo[] = [];

  parroquia: Combo[] = [];
  brokers: Combo[] = [];
  ejecutivos: Combo[] = [];
  oficinas: Combo[] = [];
  nivelRiesgo: string = '';
  ocupaciones: any[] = [];
  filteredOcp!: Observable<any[]>;
  filteredBroker!: Observable<Combo[]>;
  filteredEjec!: Observable<Combo[]>;
  tercero: Tercero = {} as Tercero;

  primaNeta: number = 0;
  impuestosRecargos: number = 0;
  primaTotal: number = 0;
  dateH:string = '';

  cargaBatch: PlyMpgS = {} as PlyMpgS;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private cotizaService: CotizarService,
    private router: Router,
    private gestionService: GestionService
  ) {}
  ngOnInit(): void {
    this.ramo = this.route.snapshot.paramMap.get('ramo');
    this.sector = this.route.snapshot.paramMap.get('sector');
    this.modalidad = this.route.snapshot.paramMap.get('modalidad');
    this.cargaInicial();
    this.DatosAseguradoFormGroup.controls['tip_docum'].setValue(
      this.tipoDocumento[0].Key
    );
  }
  private _filterOcp(Key: string): any[] {
    const filterValue = Key.toString().toLowerCase();
    return this.ocupaciones.filter((option) =>
      option.VALUE.toLowerCase().includes(filterValue)
    );
  }
  private _filterBrok(Key: string): Combo[] {
    const filterValue = Key.toString().toLowerCase();
    return this.brokers.filter((option) =>
      option.Value.toLowerCase().includes(filterValue)
    );
  }
  private _filterEject(Key: string): Combo[] {
    const filterValue = Key.toString().toLowerCase();
    return this.ejecutivos.filter((option) =>
      option.Value.toLowerCase().includes(filterValue)
    );
  }
  cargaInicial() {
    this.cargarCampos();
    this.cargarDatos();
    this.cargarBenef();
    this.cargarOcupaciones();
    this.cargarEjecutivos();
    this.cargarBrokers();
    this.cargarProvincia();
    this.cargarFormasPago();
  }
  verRiesgos(riesgo: any, event: any) {
    if (event.isUserInput) {
      this.riesgo = riesgo.KEY;
      this.DatosAseguradoFormGroup.controls['nivelRiesgo'].setValue(riesgo.KEY);
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
  mostrarTextoCombo(opcion: Combo): string {
    return opcion && opcion.Value ? opcion.Value : '';
  }
  mostrarTextoCombo2(opcion: any): string {
    return opcion && opcion.VALUE ? opcion.VALUE : '';
  }
  cargarTercero() {
    this.spinner.show();
    this.cotizaService
      .validaCampoGenerico(
        this.DatosAseguradoFormGroup.controls['tip_docum'].value!,
        this.DatosAseguradoFormGroup.controls['cod_docum'].value!,
        this.ramo!
      )
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded == true && resp.data == '') {
            this.cotizaService
              .obtenerTercero(
                this.DatosAseguradoFormGroup.controls['tip_docum'].value!,
                this.DatosAseguradoFormGroup.controls['cod_docum'].value!
              )
              .subscribe((resp: ResponseModel) => {
                if (resp.succeeded && resp.data.NOM_TERCERO != '') {
                  // this.toaster.success(resp.message,'',{
                  //   closeButton: true,
                  //   disableTimeOut: true,
                  //   progressBar:true
                  // });
                  this.popup();
                  this.infoTercero = resp.data;
                  this.DatosAseguradoFormGroup.controls['nom_tercero'].setValue(
                    this.infoTercero.NOM_TERCERO
                  );
                  this.DatosAseguradoFormGroup.controls[
                    'ape1_tercero'
                  ].setValue(this.infoTercero.APE1_TERCERO);
                  this.DatosAseguradoFormGroup.controls[
                    'ape2_tercero'
                  ].setValue(this.infoTercero.APE2_TERCERO);
                  this.DatosAseguradoFormGroup.controls[
                    'fec_nacimiento'
                  ].setValue(this.infoTercero.FEC_NACIMIENTO);
                  this.DatosAseguradoFormGroup.controls['sexo'].setValue(
                    this.infoTercero.MCA_SEXO
                  );
                  this.DatosAseguradoFormGroup.controls['tlf_numero'].setValue(
                    this.infoTercero.TLF_NUMERO
                  );
                  this.DatosAseguradoFormGroup.controls['email'].setValue(
                    this.infoTercero.EMAIL
                  );
                  this.DatosAseguradoFormGroup.controls['direccion'].setValue(
                    this.infoTercero.NOM_DOMICILIO1 +
                      this.infoTercero.NOM_DOMICILIO2 +
                      this.infoTercero.NOM_DOMICILIO3
                  );
                } else {
                  this.DatosAseguradoFormGroup.controls['nom_tercero'].setValue(
                    ''
                  );
                  this.DatosAseguradoFormGroup.controls[
                    'ape1_tercero'
                  ].setValue('');
                  this.DatosAseguradoFormGroup.controls[
                    'ape2_tercero'
                  ].setValue('');
                  this.DatosAseguradoFormGroup.controls[
                    'fec_nacimiento'
                  ].setValue('');
                  this.DatosAseguradoFormGroup.controls['sexo'].setValue(
                    '0'
                  );
                  this.DatosAseguradoFormGroup.controls['tlf_numero'].setValue(
                    ''
                  );
                  this.DatosAseguradoFormGroup.controls['email'].setValue('');
                  this.toaster.warning(resp.message, 'Información');
                }
              });
          } else {
            this.DatosAseguradoFormGroup.controls['nom_tercero'].setValue(' ');
            this.DatosAseguradoFormGroup.controls['ape1_tercero'].setValue('');
            this.DatosAseguradoFormGroup.controls['ape2_tercero'].setValue('');
            this.DatosAseguradoFormGroup.controls['fec_nacimiento'].setValue(
              ''
            );
            this.DatosAseguradoFormGroup.controls['sexo'].setValue('0');
            this.DatosAseguradoFormGroup.controls['tlf_numero'].setValue('');
            this.DatosAseguradoFormGroup.controls['email'].setValue('');
            this.toaster.warning(resp.data, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  popup() {
    Swal.fire({
      title: 'Datos tomados desde TronWeb',
      icon: 'info',
      timer: 4000,
      confirmButtonText: 'Aceptar',
      timerProgressBar: true,
      confirmButtonColor: '#da2d25',
    });
  }
  popupFin(icon: any, num_poliza_definitivo: string, producto: string) {
    var html: string = '';
    if(icon == 'success'){
      html = '<p>' +
      producto +
      '</p>' +
      '<p>Fecha Vigencia: ' +
      this.cargaBatch.fec_efec_spto +
      ' - ' +
      this.cargaBatch.fec_vcto_spto +
      '</p>' +
      '<p>Valor: ' +
      this.primaTotal.toFixed(2) +
      '</p>';
    }else if(icon == 'error'){
      html = 'Se ah generado un error al realizar la cotización.';
    }
    Swal.fire({
      title: 'Cotización N°: ' + num_poliza_definitivo,
      icon: icon,
      html:html,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#da2d25',
    }).then((result)=>{
      if(result['isConfirmed']){
        this.router.navigate(['home']);
      }
    });
  }
  onSelectionChangeProvincia(provincia: any, event: any) {
    if (event.isUserInput) {
      this.tercero.p_cod_estado = provincia.Key;
      this.cargarCiudad(provincia.Key);
    }
  }
  onSelectionChangeCiudad(ciudad: any, event: any) {
    if (event.isUserInput) {
      this.tercero.p_cod_prov = ciudad.Key;
      this.cargarParroquia(ciudad.Key);
    }
  }
  onSelectionChangeParroquia(parroquia: any, event: any) {
    if (event.isUserInput) {
      this.tercero.p_cod_localidad = parroquia.Key;
    }
  }
  onSelectionChangeBroker(broker: any, event: any) {
    if (event.isUserInput) {
      this.cargaBatch.cod_agt = broker.Key;
      this.cargarOficinas(broker.Key);
    }
  }
  onSelectionChangeEjecutivo(ejecutivo: any, event: any) {
    if (event.isUserInput) {
      this.p2000030.cod_ejecutivo = ejecutivo.Key;
    }
  }
  onSelectionChangeFormaPago(formaPago: any, event: any) {
    if (event.isUserInput) {
      this.p2000030.cod_fracc_pago = formaPago.Key;
    }
  }
  onSelectionGenero(genero: any, event: any) {
    if (event.isUserInput) {
      this.infoTercero.MCA_SEXO = genero.Key;
    }
  }
  addEvent(event: MatDatepickerInputEvent<Date>) {
    const date = this.fourFormGroup.controls['desde'].value!;
    const dateN = new Date(date);

    this.fourFormGroup.controls['hasta'].setValue(formatDate(dateN.setFullYear(2024),'dd/MM/yyyy','en'));

    this.dateH = formatDate(dateN.setFullYear(2024),'yyyy-MM-dd','en');
  }
  cargarProvincia() {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica('A1000104', '5', 'COD_PAIS=ECU')
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.provincias = resp.data;
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarCiudad(provincia: string) {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica(
        'A1000100',
        '13',
        'COD_PAIS=ECU|COD_ESTADO=' + provincia
      )
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.ciudad = resp.data;
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarParroquia(ciudad: string) {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica('A1000102', '1', 'COD_PAIS=ECU|COD_PROV=' + ciudad)
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.parroquia = resp.data;
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarBrokers() {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica('V1001390', '3', 'COD_CIA=1|COD_ACT_TERCERO=2')
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.brokers = resp.data;
            this.filteredBroker = this.secondFormGroup.controls[
              'broker'
            ].valueChanges.pipe(
              startWith(''),
              map((value) =>
                value ? this._filterBrok(value) : this.brokers.slice()
              )
            );
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarEjecutivos() {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica('V1001390', '3', 'COD_CIA=1|COD_ACT_TERCERO=11')
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.ejecutivos = resp.data;
            this.filteredEjec = this.secondFormGroup.controls[
              'ejecutivo'
            ].valueChanges.pipe(
              startWith(''),
              map((value) =>
                value ? this._filterEject(value) : this.ejecutivos.slice()
              )
            );
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarOficinas(p_cod_agt: number) {
    this.spinner.show();
    this.cotizaService.obtenerOficinas(p_cod_agt).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.oficinas = resp.data;
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarCampos() {
    this.spinner.show();
    this.cotizaService
      .obtenerCampos('1', this.sector!, this.ramo!, this.modalidad!, 'DCOB')
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded && resp.data.length > 0) {
            resp.data.forEach((e: any) => {
              if (e.MCA_VISIBLE == 'S') {
                if (e.NUM_SECU_CAMPO == 1) {
                  this.dataSource.push({
                    id: e.COD_CAMPO,
                    cobertura: e.TXT_LABEL_CAMPO,
                    suma: 0,
                    tasa: 0.00001,
                    primaNetaAnual: 0,
                  });
                } else {
                  this.dataSource.push({
                    id: e.COD_CAMPO,
                    cobertura: e.TXT_LABEL_CAMPO,
                    suma: 0,
                    tasa: 0.00001,
                    primaNetaAnual: 0,
                  });
                }
              }
            });
            this.dataSource = [...this.dataSource];
          } else {
            this.toaster.warning(resp.message, 'Información');
            this.router.navigate(['home']);
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarDatos() {
    this.spinner.show();
    this.cotizaService
      .obtenerCampos('1', this.sector!, this.ramo!, this.modalidad!, 'DVARP')
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded && resp.data.length > 0) {
            resp.data.forEach((e: any) => {
              if (e.MCA_VISIBLE == 'S') {
                if (e.TIP_NIVEL == 1) {
                  this.datosVariables.push({
                    cod_campo: e.COD_CAMPO,
                    num_riesgo: 0,
                    num_secu: e.NUM_SECU_CAMPO,
                    tip_nivel: e.TIP_NIVEL,
                    val_campo: e.TXT_VLR_DEFECTO,
                    val_cor_campo: e.TXT_VLR_DEFECTO,
                  });
                } else if (e.TIP_NIVEL == 2) {
                  this.datosVariables.push({
                    cod_campo: e.COD_CAMPO,
                    num_riesgo: 1,
                    num_secu: e.NUM_SECU_CAMPO,
                    tip_nivel: e.TIP_NIVEL,
                    val_campo: e.TXT_VLR_DEFECTO,
                    val_cor_campo: e.TXT_VLR_DEFECTO,
                  });
                }
              }
            });
          } else {
            this.toaster.warning(resp.message, 'Información');
            this.router.navigate(['home']);
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarBenef() {
    this.spinner.show();
    this.cotizaService.obtenerBenef(Number(this.ramo)).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded && resp.data.length > 0) {
          resp.data.forEach((e: any) => {
            if (e.TIP_NIVEL == 1) {
              this.tipBenef.push({
                mca_pct: e.MCA_PCT,
                mca_suma_100: e.MCA_SUMA_100,
                num_riesgo: 0,
                pct_participacion: 0,
                tip_benef: e.TIP_BENEF,
                tip_nivel: e.TIP_NIVEL,
              });
            } else if (e.TIP_NIVEL == 2) {
              if (e.MCA_SUMA_100 == 'S') {
                this.tipBenef.push({
                  mca_pct: e.MCA_PCT,
                  mca_suma_100: e.MCA_SUMA_100,
                  num_riesgo: 1,
                  pct_participacion: 100,
                  tip_benef: e.TIP_BENEF,
                  tip_nivel: e.TIP_NIVEL,
                });
              } else {
                this.tipBenef.push({
                  mca_pct: e.MCA_PCT,
                  mca_suma_100: e.MCA_SUMA_100,
                  num_riesgo: 1,
                  pct_participacion: 0,
                  tip_benef: e.TIP_BENEF,
                  tip_nivel: e.TIP_NIVEL,
                });
              }
            }
          });
        } else {
          this.toaster.warning(resp.message, 'Información');
          this.router.navigate(['home']);
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarFormasPago() {
    this.spinner.show();
    this.cotizaService
      .svcListaGenerica(
        'A1001402',
        '3',
        'COD_CIA=1|COD_CIA=1|COD_RAMO=146|COD_MON=14|FEC_VALIDEZ=01012010|COD_NIVEL1=93|COD_NIVEL2=931|COD_NIVEL3=8012|COD_CIA=1|TIP_DOCUM=CI|COD_DOCUM='
      )
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded) {
            this.formaPago = resp.data;
          } else {
            this.toaster.warning(resp.message, 'Información');
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  cargarOcupaciones() {
    this.spinner.show();
    this.cotizaService.obtenerOcupaciones().subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.ocupaciones = resp.data;
          this.filteredOcp = this.DatosAseguradoFormGroup.controls[
            'ocupacion'
          ].valueChanges.pipe(
            startWith(''),
            map((value) =>
              value ? this._filterOcp(value) : this.ocupaciones.slice()
            )
          );
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  asignarTasa(event: any, element: any) {
    element.tasa = event.target.value;
    event.target.value = event.target.valueAsNumber.toFixed(2);
    this.calcularSuma(element);
  }
  asignarSuma(event: any, element: any) {
    element.suma = event.target.value;
    event.target.value = this.formatearNumero(event.target.value);
    this.calcularSuma(element);
  }
  sumaFormat(event: any, element: any) {
    if (event.target.value == 0) {
      event.target.value = '';
    } else {
      event.target.value = event.target.value.toString().replaceAll(',', '');
    }
  }
  sumaBlur(event: any, element: any) {
    event.target.value = this.formatearNumero(element.suma);
  }
  calcularSuma(element: any) {
    element.primaNetaAnual = (element.suma * element.tasa) / 1000;
    this.primaNeta = 0;
    this.impuestosRecargos = 0;
    this.primaTotal = 0;
    this.dataSource.forEach((e) => {
      this.primaNeta += e.primaNetaAnual;
    });
    this.impuestosRecargos =
      (this.primaNeta * this.thirdFormGroup.controls['recargo'].value!) / 100 +
      (this.primaNeta * -this.thirdFormGroup.controls['descuento'].value!) /
        100;
    this.primaTotal = this.primaNeta + this.impuestosRecargos;
    this.thirdFormGroup.controls['primaTotal'].setValue(this.primaTotal);
  }
  changeRecargoDescuento() {
    if (this.thirdFormGroup.valid) {
      this.impuestosRecargos = 0;
      this.primaTotal = 0;
      this.impuestosRecargos =
        (this.primaNeta * this.thirdFormGroup.controls['recargo'].value!) /
          100 +
        (this.primaNeta * -this.thirdFormGroup.controls['descuento'].value!) /
          100;
      this.primaTotal = this.primaNeta + this.impuestosRecargos;
      this.thirdFormGroup.controls['primaTotal'].setValue(this.primaTotal);
    }
  }
  formatearNumero(nStr: any) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  numPresupuesto() {
    //this.spinner.show();
    this.cotizaService.consultaPresupuesto().subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargaBatch.num_poliza = resp.data.toString();
          this.cargarBatch();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cotizar() {
    this.CrearTercero();
    this.numPresupuesto();
  }
  cargarBatch() {
    const date = new Date(Date.now());
    this.spinner.show();
    this.cargaBatch.tip_spto_accion = null;
    this.cargaBatch.num_spto_apli = 0;
    this.cargaBatch.num_apli = 0;
    this.cargaBatch.cod_negocio = 'EM|'+this.gestionService.obtenerUsuarioNombre();
    this.cargaBatch.tip_mvto_batch = '8';
    this.cargaBatch.num_orden = 1;
    this.cargaBatch.num_spto_anulado = null;
    this.cargaBatch.num_poliza_cliente = '';
    this.cargaBatch.cod_cia = 1;
    this.cargaBatch.cod_usr_captura = 'EMIWEB1';
    this.cargaBatch.cod_mon = 14;
    this.cargaBatch.num_contrato = null;
    this.cargaBatch.cod_tip_spto = '';
    this.cargaBatch.fec_efec_spto = this.datePipe.transform(
      this.fourFormGroup.controls['desde'].value,
      'yyyy-MM-dd'
    )!;
    this.cargaBatch.fec_vcto_spto = this.datePipe.transform(
      this.dateH,'yyyy-MM-dd'
    )!;
    this.cargaBatch.txt_motivo_spto = '';
    this.cargaBatch.sub_cod_spto = null;
    this.cargaBatch.num_spto = 0;
    this.cargaBatch.cod_spto = null;
    this.cargaBatch.nom_excepcion = null;
    this.cargaBatch.cod_excepcion = null;
    this.cargaBatch.mca_renueva = null;
    this.cargaBatch.mca_renueva_tmp = null;
    this.cargaBatch.cod_nivel1 = 93;
    this.cargaBatch.num_poliza_grupo = '';
    this.cargaBatch.cod_ramo = Number(this.ramo);
    this.cargaBatch.fec_actu = this.datePipe.transform(
      date,
      'yyyy-MM-dd'
    )!;
    this.cargaBatch.mca_prima_manual = 'S';
    this.cargaBatch.max_spto_vigente = null;
    this.cargaBatch.cant_renovaciones = null;
    this.cargaBatch.mca_anulacion_por_deuda = 'N';
    this.cargaBatch.mca_pre_renovacion = 'N';
    this.cargaBatch.fec_tratamiento = this.datePipe.transform(
      date,
      'yyyy-MM-dd'
    )!;
    this.cargaBatch.idn_val = '';
    this.cargaBatch.mca_periodicidad = null;
    this.cargaBatch.mca_porrata = 'S';
    this.cargaBatch.num_recibo = 0;
    this.cargaBatch.num_subcontrato = null;
    this.cargaBatch.cod_nivel2 = 931;
    this.cargaBatch.cod_sector = Number(this.sector);
    this.cargaBatch.hora_desde = null;
    this.cargaBatch.tip_situ = '1';
    this.cargaBatch.tip_autoriza_ct = '1';
    //this.cargaBatch.cod_agt = 0;
    this.cargaBatch.cod_nivel3 = 8004;
    this.cargaBatch.tip_poliza_tr = 'F';
    this.cargaBatch.num_poliza_tronador = null;
    this.cargaBatch.mca_devuelve_todo = 'N';
    this.cargaBatch.num_riesgos = '1';
    this.cargaBatch.cod_usr = 'EMIWEB1';

    this.cotizaService.cargarBatch(this.cargaBatch).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargarP2000030();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarP2000030() {
    //this.spinner.show();
    this.p2000030.cod_cia = this.cargaBatch.cod_cia;
    this.p2000030.cod_sector = this.cargaBatch.cod_sector;
    this.p2000030.cod_ramo = this.cargaBatch.cod_ramo;
    this.p2000030.num_poliza = this.cargaBatch.num_poliza;
    this.p2000030.num_spto = this.cargaBatch.num_spto;
    this.p2000030.num_apli = this.cargaBatch.num_apli;
    this.p2000030.num_spto_apli = this.cargaBatch.num_spto_apli;
    this.p2000030.fec_validez = this.datePipe.transform(
      '2005-01-01',
      'yyyy-MM-dd'
    )!;
    this.p2000030.fec_emision = null; //this.formatDate('2023-08-22');
    this.p2000030.fec_emision_spto = null; //this.formatDate('2023-08-22');
    this.p2000030.fec_efec_poliza = this.cargaBatch.fec_efec_spto;
    this.p2000030.fec_vcto_poliza = this.cargaBatch.fec_vcto_spto; //this.datePipe.transform(Date.now(),'yyyy-MM-dd')!;
    this.p2000030.fec_efec_spto = this.cargaBatch.fec_efec_spto;
    this.p2000030.fec_vcto_spto = this.cargaBatch.fec_vcto_spto; //this.datePipe.transform(Date.now(),'yyyy-MM-dd')!;
    this.p2000030.tip_duracion = '1';
    this.p2000030.num_riesgos = this.cargaBatch.num_riesgos;
    this.p2000030.cod_mon = this.cargaBatch.cod_mon;
    //this.p2000030.cod_fracc_pago = 1;
    this.p2000030.cant_renovaciones = 0;
    this.p2000030.num_renovaciones = 0;
    this.p2000030.tip_coaseguro = 0;
    this.p2000030.num_presupuesto = null;
    this.p2000030.num_poliza_anterior = null;
    this.p2000030.num_poliza_cliente = null;
    this.p2000030.num_contrato = this.cargaBatch.num_contrato;
    this.p2000030.num_poliza_grupo = this.cargaBatch.num_poliza_grupo;
    this.p2000030.num_secu_grupo = null;
    this.p2000030.cod_spto = this.cargaBatch.cod_spto;
    this.p2000030.sub_cod_spto = this.cargaBatch.sub_cod_spto;
    this.p2000030.cod_tip_spto = this.cargaBatch.cod_tip_spto;
    this.p2000030.tip_spto = 'XX';
    this.p2000030.txt_motivo_spto = this.cargaBatch.txt_motivo_spto;
    this.p2000030.tip_docum =
      this.DatosAseguradoFormGroup.controls['tip_docum'].value!;
    this.p2000030.cod_docum =
      this.DatosAseguradoFormGroup.controls['cod_docum'].value!;
    this.p2000030.cod_cuadro_com = 2;
    this.p2000030.cod_agt = this.cargaBatch.cod_agt;
    this.p2000030.pct_agt = 100;
    this.p2000030.cod_org = null;
    this.p2000030.cod_asesor = null;
    this.p2000030.cod_nivel1 = 93;
    this.p2000030.cod_nivel2 = 931;
    this.p2000030.cod_nivel3 = 8004;
    this.p2000030.cod_compensacion = 1;
    this.p2000030.tip_gestor = 'DO';
    this.p2000030.cod_gestor = '8004';
    this.p2000030.mca_regulariza = 'N';
    this.p2000030.tip_regulariza = '0';
    this.p2000030.pct_regulariza = null;
    this.p2000030.cod_indice = null;
    this.p2000030.anios_max_duracion = null;
    this.p2000030.meses_max_duracion = null;
    this.p2000030.dias_max_duracion = null;
    this.p2000030.cod_agt2 = null;
    this.p2000030.pct_agt2 = 0;
    this.p2000030.cod_agt3 = null;
    this.p2000030.pct_agt3 = 0;
    this.p2000030.cod_agt4 = null;
    this.p2000030.pct_agt4 = 0;
    this.p2000030.duracion_pago_prima = null;
    this.p2000030.cod_envio = '';
    //this.p2000030.cod_ejecutivo = 700000;
    this.p2000030.mca_tomadores_alt = 'N';
    this.p2000030.mca_reaseguro_manual = 'N';
    this.p2000030.mca_prorrata = 'S';
    this.p2000030.mca_prima_manual = 'S';
    this.p2000030.mca_provisional = 'N';
    this.p2000030.fec_autorizacion = null;
    this.p2000030.mca_poliza_anulada = 'N';
    this.p2000030.mca_spto_anulado = 'N';
    this.p2000030.num_spto_anulado = null;
    this.p2000030.fec_spto_anulado = null;
    this.p2000030.mca_spto_tmp = 'N';
    this.p2000030.mca_datos_minimos = 'N';
    this.p2000030.mca_impresion = 'N';
    this.p2000030.mca_exclusivo = 'N';
    this.p2000030.cod_usr = this.cargaBatch.cod_usr;
    this.p2000030.cod_nivel3_captura = 8004;
    this.p2000030.fec_actu = null; //this.formatDate('2023-08-22');
    this.p2000030.mca_reaseguro_marco = 'N';
    this.p2000030.tip_poliza_tr = 'F';
    this.p2000030.num_poliza_tr = null;
    this.p2000030.imp_cuota_inicial = null;
    this.p2000030.num_poliza_siguiente = null;
    this.p2000030.cod_dst_agt = null;
    this.p2000030.cod_cuadro_coa = null;
    this.p2000030.tip_rea = '0';
    this.p2000030.num_spto_publico = null;
    this.p2000030.val_mca_int = null;
    this.p2000030.hora_desde = '00:00';
    this.p2000030.num_subcontrato = null;
    this.p2000030.cod_negocio = this.cargaBatch.cod_negocio;
    this.p2000030.num_secu_cta_tar = null;
    this.p2000030.val_cambio = null;
    this.p2000030.fec_vcto_spto_publico = null;
    this.p2000030.num_spto_grp = null;
    this.p2000030.cod_canal1 = '1';
    this.p2000030.cod_canal2 = '10';
    this.p2000030.cod_canal3 = '1001';

    this.cotizaService.guardarP2000030(this.p2000030).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargarP2000031();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarP2000031() {
    //this.spinner.show();
    this.p2000031.cod_cia = this.cargaBatch.cod_cia;
    this.p2000031.num_poliza = this.cargaBatch.num_poliza;
    this.p2000031.num_spto = this.cargaBatch.num_spto;
    this.p2000031.num_apli = this.cargaBatch.num_apli;
    this.p2000031.num_spto_apli = this.cargaBatch.num_spto_apli;
    this.p2000031.num_riesgo = this.cargaBatch.num_riesgos;
    this.p2000031.tip_spto = this.p2000030.tip_spto;
    this.p2000031.cod_modalidad = Number(this.modalidad);
    this.p2000031.nom_riesgo = this.DatosAseguradoFormGroup.controls['ape1_tercero']+' '+this.DatosAseguradoFormGroup.controls['ape2_tercero']+' '+this.DatosAseguradoFormGroup.controls['nom_tercero'];
    this.p2000031.fec_efec_riesgo = this.p2000030.fec_efec_spto;
    this.p2000031.fec_vcto_riesgo = this.p2000030.fec_vcto_spto;
    this.p2000031.mca_baja_riesgo = 'N';
    this.p2000031.mca_vigente = 'S';
    this.p2000031.mca_exclusivo = null;
    this.p2000031.cod_usr_exclusivo = null;
    this.p2000031.num_certificado = null;
    this.p2000031.nom_certificado = null;
    this.p2000031.txt_id_riesgo = null;

    this.cotizaService.guardarP2000031(this.p2000031).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargarP2000020();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarP2000020() {
    //this.spinner.show();
    this.datosVariables.forEach((e: DatosVariables) => {
      if(e.cod_campo == 'FEC_NACIMIENTO'){
        e.val_campo = this.datePipe.transform(this.DatosAseguradoFormGroup.controls['fec_nacimiento'].value,'ddMMyyyy')!;
        e.val_cor_campo = this.datePipe.transform(this.DatosAseguradoFormGroup.controls['fec_nacimiento'].value,'ddMMyyyy')!;
      }
      if(e.cod_campo == 'MCA_SEXO'){
        e.val_campo = this.infoTercero.MCA_SEXO;
        e.val_cor_campo = this.infoTercero.MCA_SEXO;
      }
      if(e.cod_campo == 'FEC_ENTREGA_DOCUM'){
        e.val_campo = this.datePipe.transform(Date.now(),'ddMMyyyy')!;
        e.val_cor_campo = this.datePipe.transform(Date.now(),'ddMMyyyy')!;
      }
      if(e.cod_campo == 'FEC_SOLICITUD_EMISION'){
        e.val_campo = this.datePipe.transform(Date.now(),'ddMMyyyy')!;
        e.val_cor_campo = this.datePipe.transform(Date.now(),'ddMMyyyy')!;
      }
        (this.p2000020.cod_cia = this.cargaBatch.cod_cia),
        (this.p2000020.num_poliza = this.cargaBatch.num_poliza),
        (this.p2000020.num_spto = this.cargaBatch.num_spto),
        (this.p2000020.num_apli = this.cargaBatch.num_apli),
        (this.p2000020.num_spto_apli = this.cargaBatch.num_spto_apli),
        (this.p2000020.num_riesgo = e.num_riesgo),
        (this.p2000020.num_periodo = 1),
        (this.p2000020.tip_nivel = e.tip_nivel),
        (this.p2000020.cod_campo = e.cod_campo),
        (this.p2000020.val_campo = e.val_campo),
        (this.p2000020.val_cor_campo = e.val_cor_campo),
        (this.p2000020.num_secu = e.num_secu),
        (this.p2000020.txt_campo = ''),
        (this.p2000020.mca_baja_riesgo = 'N'),
        (this.p2000020.mca_vigente = 'S'),
        (this.p2000020.mca_vigente_apli = 'S'),
        (this.p2000020.cod_ramo = this.cargaBatch.cod_ramo),
        (this.p2000020.tip_subnivel = null);
      this.Cargap2000020.push(this.p2000020);
      this.p2000020 = {} as P2000020;
    });
    this.cotizaService.guardarP2000020(this.Cargap2000020).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargarP2000040();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarP2000040() {
    //this.spinner.show();

    this.dataSource.forEach((e: Cobertura) => {
      (this.p2000040.cod_cia = this.cargaBatch.cod_cia),
        (this.p2000040.num_poliza = this.cargaBatch.num_poliza),
        (this.p2000040.num_spto = this.cargaBatch.num_spto),
        (this.p2000040.num_apli = this.cargaBatch.num_apli),
        (this.p2000040.num_spto_apli = this.cargaBatch.num_spto_apli),
        (this.p2000040.num_riesgo = 1),
        (this.p2000040.num_periodo = 1),
        (this.p2000040.num_secu = 1),
        (this.p2000040.cod_cob = e.id),
        (this.p2000040.suma_aseg = e.suma),
        (this.p2000040.imp_unidad = null),
        (this.p2000040.pct_participacion = null),
        (this.p2000040.cod_mon_capital = this.cargaBatch.cod_mon),
        (this.p2000040.suma_aseg_baja_stro = null),
        (this.p2000040.suma_aseg_spto = e.suma),
        (this.p2000040.tasa_cob = e.tasa),
        (this.p2000040.cod_franquicia = null),
        (this.p2000040.cod_limite = null),
        (this.p2000040.suma_aseg_sup = null),
        (this.p2000040.mca_baja_riesgo = 'N'),
        (this.p2000040.mca_vigente = 'S'),
        (this.p2000040.mca_vigente_apli = 'S'),
        (this.p2000040.mca_baja_cob = 'N'),
        (this.p2000040.cod_secc_reas = 240),
        (this.p2000040.imp_agr = 0),
        (this.p2000040.imp_agr_rel = null),
        (this.p2000040.imp_agr_spto = null),
        (this.p2000040.imp_agr_rel_spto = null),
        (this.p2000040.mes_base_regulariza = null),
        (this.p2000040.anio_base_regulariza = null),
        (this.p2000040.pct_enfermedad = null),
        (this.p2000040.duracion_profesion = null),
        (this.p2000040.pct_profesion = null),
        (this.p2000040.duracion_enfermedad = null),
        (this.p2000040.val_franquicia_min = null),
        (this.p2000040.val_franquicia_max = null),
        (this.p2000040.cod_ramo = this.cargaBatch.cod_ramo),
        (this.p2000040.suma_aseg_baja_stro_acc = null),
        (this.p2000040.cod_mon_franquicia = null),
        this.Cargap2000040.push(this.p2000040);
      this.p2000040 = {} as P2000040;
    });
    this.cotizaService.guardarP2000040(this.Cargap2000040).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.cargarP2000060();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  cargarP2000060() {
    //this.spinner.show();

    this.tipBenef.forEach((e: TipBenef) => {
      (this.p2000060.cod_cia = this.cargaBatch.cod_cia),
        (this.p2000060.num_poliza = this.cargaBatch.num_poliza),
        (this.p2000060.num_spto = this.cargaBatch.num_spto),
        (this.p2000060.num_apli = this.cargaBatch.num_apli),
        (this.p2000060.num_spto_apli = this.cargaBatch.num_spto_apli),
        (this.p2000060.num_riesgo = e.num_riesgo),
        (this.p2000060.tip_benef = e.tip_benef),
        (this.p2000060.num_secu = 1),
        (this.p2000060.tip_docum = this.p2000030.tip_docum),
        (this.p2000060.cod_docum = this.p2000030.cod_docum),
        (this.p2000060.mca_principal = 'N'),
        (this.p2000060.mca_calculo = 'N'),
        (this.p2000060.mca_baja = 'N'),
        (this.p2000060.mca_vigente = 'S'),
        (this.p2000060.pct_participacion = e.pct_participacion),
        (this.p2000060.fec_vcto_cesion = null),
        (this.p2000060.imp_cesion = null),
        (this.p2000060.num_prestamo = null),
        (this.p2000060.tip_relac = null),
        (this.p2000060.cod_subscripcion = null),
        (this.p2000060.mca_vip = 'N');

      this.Cargap2000060.push(this.p2000060);
      this.p2000060 = {} as P2000060;
    });
    this.cotizaService.guardarP2000060(this.Cargap2000060).subscribe(
      (resp: ResponseModel) => {
        if (resp.succeeded) {
          this.ejecutaBatch();
        } else {
          this.toaster.warning(resp.message, 'Información');
        }
        //this.spinner.hide();
      },
      () => {
        //this.spinner.hide();
        this.toaster.error('No se pudo establecer la conexión');
      }
    );
  }
  ejecutaBatch() {
    this.spinner.show();
    this.cotizaService
      .ejecutarBatch(
        this.cargaBatch.fec_tratamiento,
        this.cargaBatch.num_poliza
      )
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded && resp.data.length > 0) {
            this.popupFin(
              'success',
              resp.data,
              this.gestionService.obtenerRamoNombre()
            );
          } else {
            this.toaster.warning(resp.message, 'Información');
            this.popupFin(
              'error',
              this.cargaBatch.num_poliza,
              this.gestionService.obtenerRamoNombre()
            );
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toaster.error('No se pudo establecer la conexión');
        }
      );
  }
  CrearTercero() {
    const date = new Date(Date.now());
    this.tercero.p_fec_tratamiento = this.datePipe.transform(date,'yyyy-MM-dd')!;
    this.tercero.p_tip_mvto_batch = '8';
    this.tercero.p_cod_cia = 1;
    this.tercero.p_tip_docum = this.DatosAseguradoFormGroup.controls['tip_docum'].value!;
    this.tercero.p_cod_docum = this.DatosAseguradoFormGroup.controls['cod_docum'].value!;
    this.tercero.p_cod_act_tercero = 1;
    this.tercero.p_mca_fisico = 'S';
    this.tercero.p_ape1_tercero = this.DatosAseguradoFormGroup.controls['ape1_tercero'].value!;
    this.tercero.p_ape2_tercero = this.DatosAseguradoFormGroup.controls['ape2_tercero'].value!;
    this.tercero.p_nom_tercero = this.DatosAseguradoFormGroup.controls['nom_tercero'].value!;
    this.tercero.p_tip_nacionalidad = 1;
    this.tercero.p_cod_nacionalidad = 'ECU';
    this.tercero.p_nom_domicilio1 = this.DatosAseguradoFormGroup.controls['direccion'].value!;
    this.tercero.p_cod_pais = 'ECU';
    //this.tercero.p_cod_prov = 901;
    this.tercero.p_cod_postal = '90150';
    this.tercero.p_tlf_numero = this.DatosAseguradoFormGroup.controls['tlf_numero'].value!;
    this.tercero.p_email = this.DatosAseguradoFormGroup.controls['email'].value!;
    this.tercero.p_email_com = this.DatosAseguradoFormGroup.controls['email'].value!;
    this.tercero.p_fec_nacimiento = this.datePipe.transform(this.DatosAseguradoFormGroup.controls['fec_nacimiento'].value!,'yyyy-MM-dd');
    this.tercero.p_cod_ocupacion = 0;
    this.tercero.p_cod_profesion = 0;
    this.tercero.p_mca_sexo = this.infoTercero.MCA_SEXO;
    this.tercero.p_cod_idioma = 'ES';
    this.tercero.p_cod_usr = 'EMIWEB';
    this.tercero.p_tlf_movil = this.DatosAseguradoFormGroup.controls['tlf_numero'].value!;;
    //this.tercero.p_cod_estado = 9;
    this.tercero.p_txt_email = this.DatosAseguradoFormGroup.controls['email'].value!;
    //this.tercero.p_cod_localidad = 50;
    this.tercero.p_mca_vip = 'N';
    this.tercero.p_mca_plan_fidelizacion = 'N';
    this.tercero.p_mca_domicilio_comprobado = 'N';
    this.tercero.p_mca_domicilio_com_comprobado = 'N';
    this.tercero.p_mca_domicilio_etiq_comprobado = 'N';
    this.tercero.p_mca_tlf_numero_comprobado = 'N';
    this.tercero.p_mca_fax_numero_comprobado = 'N';
    this.tercero.p_mca_email_comprobado = 'N';
    this.tercero.p_mca_tlf_numero_com_comprobado = 'N';
    this.tercero.p_mca_fax_numero_com_comprobado = 'N';
    this.tercero.p_mca_email_com_comprobado = 'N';
    this.tercero.p_mca_tlf_movil_comprobado = 'N';
    this.tercero.p_mca_busca_comprobado = 'N';
    this.tercero.p_mca_txt_email_comprobado = 'N';
    this.tercero.p_mca_pers_exp_politica = 'N';
    this.tercero.p_mca_docum_comprobado = 'N';
    this.tercero.p_mca_cuenta_propia = 'N';
    this.tercero.p_mca_primas_mayor_lim = 'N';
    this.tercero.p_mca_obl_fiscal_otros_paises = 'N';



    this.spinner.show();
    this.cotizaService
      .svcCrearTercero(this.tercero)
      .subscribe(
        (resp: ResponseModel) => {
          if (resp.succeeded && resp.data.length > 0) {
          } else {
            this.toaster.warning(resp.message, 'Información');
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
interface Combo {
  Key: string;
  Value: string;
}
export interface Cobertura {
  id: number;
  cobertura: string;
  suma: number;
  tasa: number;
  primaNetaAnual: number;
}
export interface DatosVariables {
  num_riesgo: number;
  tip_nivel: number;
  cod_campo: string;
  val_campo: string;
  val_cor_campo: string;
  num_secu: number;
}
export interface TipBenef {
  tip_nivel: number;
  tip_benef: string;
  mca_pct: string;
  mca_suma_100: string;
  pct_participacion: number;
  num_riesgo: number;
}
