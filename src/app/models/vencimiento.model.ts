import { ControlItem } from "./filtro.model";

export class VencimientoAuto {
  index: number | null | undefined;
  Agencia!: string;
  Ramo!: string;
  Producto!: string;
  Poliza!: string;
  NumSpto!: string;
  NumApli!: string;
  NumSptoApli!: string;
  NumRiesgos!: string;
  TipoDocumento!: string;
  EstadoDocumento!: string;
  InicioVigenciaPoliza!: string;
  InicioVigenciaUltRenovacion!: string;
  FinalVigenciaPoliza!: string;
  TipoSolicitante!: string;
  IdSolicitante!: string;
  NombreTomador!: string;
  FecNacimientoTomador!: string;
  IdAgente!: string;
  NombreAgente!: string;
  EjecutivoComercialMapfre!: string;
  TipCoaseguro!: string;
  Facultativo!: string;
  Marca!: string;
  Modelo!: string;
  Chasis!: string;
  Motor!: string;
  AnioVehiculo!: string;
  DispositivoRastreo!: string;
  NombreDispositivoRastreo!: string;
  SumaAsegurada!: string;
  PrimaNetaAcumVigencia!: string;
  PrimaNetaAcumHistorica!: string;
  PrimaAnualVigencia!: string;
  NoSiniestrosIndemVigencia!: string;
  IndemnizaTotalVigencia!: string;
  ReservaSiniestrosVigencia!: string;
  NoSiniestrosHistorico!: string;
  NoSiniestrosIndemHistorico!: string;
  IndemnizaTotalHistorico!: string;
  ReservaSiniestrosHistorico!: string;
  SinUltimaVigencia!: string;
  SinHistorica!: string;
  SinAnualAsegurado!: string;
  NumCuotavencida!: string;
  ValorCuotaVencida!: string;
  NumFactura!: string;
  Comision!: string;
  ComisionGenerada!: string;
  DesctoTecnico!: string;
  DesctoComercial!: string;
  DesctoFormaPago!: string;
  IndiceBonusMalusVigencia!: string;
  IndiceBonusMalusRenovacion!: string;
  CodModalidadPoliza!: string;
  NomModalidadPoliza!: string;
  NumPolizaGrupo!: string;
  NomPolizaGrupo!: string;
  FecInicioPolizaGrupo!: string;
  FecFinPolizaGrupo!: string;
  NumContratoPoliza!: string;
  NomContratoPoliza!: string;
  NumRenovacion!: string;
  CalculoPrimaRenovacion!: string;
  Tasa!: string;
  PropuestaRenovacion!: string;
  Decision: string | null | undefined;
  CodigoCanal!: string;
  NomCanalNivel1!: string;
  NomCanalNivel2!: string;
  EsProgramaSeguros!: string;
  
}

export class VencimientoGeneral {
  index: number | null | undefined;
  Agencia!: string;
  Ramo!: string;
  Producto!: string;
  Poliza!: string;
  NumSpto!: string;
  NumApli!: string;
  NumSptoApli!: string;
  NumRiesgos!: string;
  TipoDocumento!: string;
  EstadoDocumento!: string;
  InicioVigenciaPoliza!: string;
  InicioVigenciaUltRenovacion!: string;
  FinalVigenciaPoliza!: string;
  TipoSolicitante!: string;
  IdSolicitante!: string;
  NombreTomador!: string;
  FecNacimientoTomador!: string;
  IdAgente!: string;
  NombreAgente!: string;
  EjecutivoComercialMapfre!: string;
  TipCoaseguro!: string;
  Facultativo!: string;
  Marca!: string;
  Modelo!: string;
  Chasis!: string;
  Motor!: string;
  AnioVehiculo!: string;
  DispositivoRastreo!: string;
  NombreDispositivoRastreo!: string;
  SumaAsegurada!: string;
  PrimaNetaAcumVigencia!: string;
  PrimaNetaAcumHistorica!: string;
  PrimaAnualVigencia!: string;
  NoSiniestrosIndemVigencia!: string;
  IndemnizaTotalVigencia!: string;
  ReservaSiniestrosVigencia!: string;
  NoSiniestrosHistorico!: string;
  NoSiniestrosIndemHistorico!: string;
  IndemnizaTotalHistorico!: string;
  ReservaSiniestrosHistorico!: string;
  SinUltimaVigencia!: string;
  SinHistorica!: string;
  SinAnualAsegurado!: string;
  NumCuotavencida!: string;
  ValorCuotaVencida!: string;
  NumFactura!: string;
  Comision!: string;
  ComisionGenerada!: string;
  DesctoTecnico!: string;
  DesctoComercial!: string;
  DesctoFormaPago!: string
  IndiceBonusMalusVigencia!: string
  IndiceBonusMalusRenovacion!: string
  CodModalidadPoliza!: string
  NomModalidadPoliza!: string
  NumPolizaGrupo!: string
  NomPolizaGrupo!: string
  FecInicioPolizaGrupo!: string
  FecFinPolizaGrupo!: string
  NumContratoPoliza!: string
  NomContratoPoliza!: string
  NumRenovacion!: string
  CalculoPrimaRenovacion!: string
  Tasa!: string
  PropuestaRenovacion!: string
  CodigoCanal!: string
  NomCanalNivel1!: string
  NomCanalNivel2!: string
  EsProgramaSeguros!: string
  NoSiniestrosVigencia!: string
  Suscriptor!: string
}

export class Decision {
  p_num_poliza!: string;
  p_decision!: string;
  p_observaciones!: string;
  p_pdf_64!: string;
}
export interface VencimientoVida {
  index: number | null | undefined;
  Agencia: string;
  Ramo: string;
  Producto: string;
  Poliza: string;
  NumSpto: string;
  NumApli: string;
  NumSptoApli: string;
  TipoDocumento: string;
  EstadoDocumento: string;
  InicioVigenciaPoliza: string;
  InicioVigenciaUltRenovacion: string;
  FinalVigenciaPoliza: string;
  TipoSolicitante: string;
  IdSolicitante: string;
  NombreTomador: string;
  FecNacimientoTomador: string;
  GeneroTomador: string;
  NumRiesgos: string;
  IdAgente: string;
  NombreAgente: string;
  EjecutivoComercialMapfre: string;
  FACULTATIVO: string;
  SumaAsegurada: string;
  PRIMA_NETA_ANUAL_ASEGURADO: string;
  ExtraPrima: string;
  NoSiniestrosIndemVigencia: string;
  NoSiniestrosVigencia: string;
  IndemnizaTotalVigencia: string;
  ReservaSiniestrosVigencia: string;
  NoSiniestrosHistorico: string;
  NoSiniestrosIndemHistorico: string;
  IndemnizaTotalHistorico: string;
  ReservaSiniestrosHistorico: string;
  SinUltimaVigencia: string;
  SinHistorica: string;
  SinAnualAsegurado: string;
  NumCuotavencida: string;
  ValorCuotaVencida: string;
  NumFactura: string;
  Comision: string;
  ComisionGenerada: string;
  DesctoTecnico: string;
  DesctoComercial: string;
  DesctoFormaPago: string;
  CodModalidadPoliza: string;
  NomModalidadPoliza: string;
  NumPolizaGrupo: string;
  NomPolizaGrupo: string;
  FecInicioPolizaGrupo: string;
  FecFinPolizaGrupo: string;
  NumRenovacion    : string;
  PropuestaRenovacion: string;
  ObservacionRenovacion: string;
  CodigoCanal: string;
  NomCanalNivel1: string;
  NomCanalNivel2: string;
  Contrato: string;
  NomContrato: string;
  EsProgramaSeguros: string;
}

export interface Lista {
  ID: string,
  VALUES : string
}
export interface SelectedFiles {
  name: string;
  file: any;
  base64?: string;
}
export interface Control {
  items?: ControlItem[];
  changed?: () => void;
  map?: (() => void) | any;
}

export interface ControlEntities {
  [key: string]: Control;
}

export interface TomadorVida {
  id: number; 
  fechaNacimiento: string;
  generoTomador: string;
}

export interface PrimaNetaVida {
  id: number;
  extraPrima: number | null | undefined;
  desctTecnico: number | null | undefined;
  desctComercial: number | null | undefined;
  desctFormaPago: number | null | undefined;
}

export interface SinestralidadUltVigeVida {
  id: number;
  cantidadSiniestros: number | null | undefined;
  indemnizaTotalVigencia: string | null | undefined;
  reservaSiniestros: string | null | undefined;
  vigencia: string | null | undefined;
  numeroRiesgos: string | null | undefined;
}

export interface PolizaGeneral {
  id: number;
  producto: string  | null | undefined;
  sumaAsegurada: number  | null | undefined;
  primaNeta: number | null | undefined;
  numeroCuotasVencidas: number | null | undefined;
  porcentajeComision: number | null | undefined;
  numeroPolizaGrupo: number | null | undefined;
}

export interface NumSiniestrosVigenciaGeneral {
  id: number;
  numeroSiniestro: number | null | undefined;
  numeroRiesgo: number | null | undefined;
  nombreRiesgo: string | null | undefined;
  reserva: string | null | undefined;
  valorPagado: number | null | undefined;
  estadoSiniestro: string | null | undefined;
  causaSiniestro: string | null | undefined;
}