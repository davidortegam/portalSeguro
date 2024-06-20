import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ResponseModel } from '../models/response.model';
import { P2000020, P2000030, P2000031, P2000040, P2000060, PlyMpgS } from '../models/cargabuzones.models';
import { environment } from 'src/environments/environments';
import { Tercero } from '../models/tercero.models';

@Injectable({
  providedIn: 'root',
})
export class CotizarService {
  constructor(private http: HttpClient) {}

  obtenerRamo(sector: string, cia: string) {
    return this.http
      .get<ResponseModel>(
        `${environment.api}Cotizar/GetRamo?sector=${sector}&cia=${cia}`
      )
      .pipe(catchError(this.errorHandler));
  }
  obtenerModalidad(sector: string, cia: string, ramo: string) {
    return this.http
      .get<ResponseModel>(
        `${environment.api}Cotizar/GetModalidad?cia=${cia}&ramo=${ramo}&sector=${sector}`
      )
      .pipe(catchError(this.errorHandler));
  }
  svcListaGenerica(
    p_nom_tabla: string,
    p_cod_version: string,
    p_parametros: string
  ) {
    const body = {
      p_nom_tabla: p_nom_tabla,
      p_cod_version: p_cod_version,
      p_parametros: p_parametros,
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/GetListasGenerales`, body)
      .pipe(catchError(this.errorHandler));
  }
  obtenerTercero(p_tip_docum: string, p_cod_docum: string) {
    const body = {
      val1: p_cod_docum,
      val2: p_tip_docum,
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/ObtenerTercero`, body)
      .pipe(catchError(this.errorHandler));
  }
  validaCampoGenerico(
    p_tip_docum: string,
    p_cod_docum: string,
    p_cod_ramo: string
  ) {
    const body = {
      p_cod_cia: '1',
      p_cod_ramo: p_cod_ramo,
      p_txt_campos_validar: `COD_DOCUM=${p_cod_docum}|TIP_DOCUM=${p_tip_docum}`,
    };
    return this.http
      .post<ResponseModel>(
        `${environment.api}Cotizar/svcValidaCampoGenerico`,
        body
      )
      .pipe(catchError(this.errorHandler));
  }
  obtenerCampos(
    cia: string,
    sector: string,
    ramo: string,
    modalidad: string,
    grupoFuncional: string
  ) {
    return this.http
      .get<ResponseModel>(
        `${environment.api}Cotizar/ConsultarCampos?cia=${cia}&sector=${sector}&ramo=${ramo}&modalidad=${modalidad}&grupoFuncional=${grupoFuncional}`
      )
      .pipe(catchError(this.errorHandler));
  }
  obtenerBenef(
    ramo: number
  ) {
    return this.http
      .get<ResponseModel>(
        `${environment.api}Cotizar/ConsultarBeneficiario?p_cod_ramo=${ramo}`
      )
      .pipe(catchError(this.errorHandler));
  }
  obtenerOcupaciones() {
    return this.http
      .get<ResponseModel>(`${environment.api}Cotizar/ConsultarOcupacion`)
      .pipe(catchError(this.errorHandler));
  }
  obtenerOficinas(p_cod_agt: number) {
    return this.http
      .get<ResponseModel>(
        `${environment.api}Cotizar/ConsultarOficina?p_cod_agt=${p_cod_agt}`
      )
      .pipe(catchError(this.errorHandler));
  }

  guardarP2000030(p2000030: P2000030) {
    const body = {
      cod_cia: p2000030.cod_cia,
      cod_sector: p2000030.cod_sector,
      cod_ramo: p2000030.cod_ramo,
      num_poliza: p2000030.num_poliza,
      num_spto: p2000030.num_spto,
      num_apli: p2000030.num_apli,
      num_spto_apli: p2000030.num_spto_apli,
      fec_validez: p2000030.fec_validez,
      fec_emision: p2000030.fec_emision,
      fec_emision_spto: p2000030.fec_emision_spto,
      fec_efec_poliza: p2000030.fec_efec_poliza,
      fec_vcto_poliza: p2000030.fec_vcto_poliza,
      fec_efec_spto: p2000030.fec_efec_spto,
      fec_vcto_spto: p2000030.fec_vcto_spto,
      tip_duracion: p2000030.tip_duracion,
      num_riesgos: p2000030.num_riesgos,
      cod_mon: p2000030.cod_mon,
      cod_fracc_pago: p2000030.cod_fracc_pago,
      cant_renovaciones: p2000030.cant_renovaciones,
      num_renovaciones: p2000030.num_renovaciones,
      tip_coaseguro: p2000030.tip_coaseguro,
      num_presupuesto: p2000030.num_presupuesto,
      num_poliza_anterior: p2000030.num_poliza_anterior,
      num_poliza_cliente: p2000030.num_poliza_cliente,
      num_contrato: p2000030.num_contrato,
      num_poliza_grupo: p2000030.num_poliza_grupo,
      num_secu_grupo: p2000030.num_secu_grupo,
      cod_spto: p2000030.cod_spto,
      sub_cod_spto: p2000030.sub_cod_spto,
      cod_tip_spto: p2000030.cod_tip_spto,
      tip_spto: p2000030.tip_spto,
      txt_motivo_spto: p2000030.txt_motivo_spto,
      tip_docum: p2000030.tip_docum,
      cod_docum: p2000030.cod_docum,
      cod_cuadro_com: p2000030.cod_cuadro_com,
      cod_agt: p2000030.cod_agt,
      pct_agt: p2000030.pct_agt,
      cod_org: p2000030.cod_org,
      cod_asesor: p2000030.cod_asesor,
      cod_nivel1: p2000030.cod_nivel1,
      cod_nivel2: p2000030.cod_nivel2,
      cod_nivel3: p2000030.cod_nivel3,
      cod_compensacion: p2000030.cod_compensacion,
      tip_gestor: p2000030.tip_gestor,
      cod_gestor: p2000030.cod_gestor,
      mca_regulariza: p2000030.mca_regulariza,
      tip_regulariza: p2000030.tip_regulariza,
      pct_regulariza: p2000030.pct_regulariza,
      cod_indice: p2000030.cod_indice,
      anios_max_duracion: p2000030.anios_max_duracion,
      meses_max_duracion: p2000030.meses_max_duracion,
      dias_max_duracion: p2000030.dias_max_duracion,
      cod_agt2: p2000030.cod_agt2,
      pct_agt2: p2000030.pct_agt2,
      cod_agt3: p2000030.cod_agt3,
      pct_agt3: p2000030.pct_agt3,
      cod_agt4: p2000030.cod_agt4,
      pct_agt4: p2000030.pct_agt4,
      duracion_pago_prima: p2000030.duracion_pago_prima,
      cod_envio: p2000030.cod_envio,
      cod_ejecutivo: p2000030.cod_ejecutivo,
      mca_tomadores_alt: p2000030.mca_tomadores_alt,
      mca_reaseguro_manual: p2000030.mca_reaseguro_manual,
      mca_prorrata: p2000030.mca_prorrata,
      mca_prima_manual: p2000030.mca_prima_manual,
      mca_provisional: p2000030.mca_provisional,
      fec_autorizacion: p2000030.fec_autorizacion,
      mca_poliza_anulada: p2000030.mca_poliza_anulada,
      mca_spto_anulado: p2000030.mca_spto_anulado,
      num_spto_anulado: p2000030.num_spto_anulado,
      fec_spto_anulado: p2000030.fec_spto_anulado,
      mca_spto_tmp: p2000030.mca_spto_tmp,
      mca_datos_minimos: p2000030.mca_datos_minimos,
      mca_impresion: p2000030.mca_impresion,
      mca_exclusivo: p2000030.mca_exclusivo,
      cod_usr: p2000030.cod_usr,
      cod_nivel3_captura: p2000030.cod_nivel3_captura,
      fec_actu: p2000030.fec_actu,
      mca_reaseguro_marco: p2000030.mca_reaseguro_marco,
      tip_poliza_tr: p2000030.tip_poliza_tr,
      num_poliza_tr: p2000030.num_poliza_tr,
      imp_cuota_inicial: p2000030.imp_cuota_inicial,
      num_poliza_siguiente: p2000030.num_poliza_siguiente,
      cod_dst_agt: p2000030.cod_dst_agt,
      cod_cuadro_coa: p2000030.cod_cuadro_coa,
      tip_rea: p2000030.tip_rea,
      num_spto_publico: p2000030.num_spto_publico,
      val_mca_int: p2000030.val_mca_int,
      hora_desde: p2000030.hora_desde,
      num_subcontrato: p2000030.num_subcontrato,
      cod_negocio: p2000030.cod_negocio,
      num_secu_cta_tar: p2000030.num_secu_cta_tar,
      val_cambio: p2000030.val_cambio,
      fec_vcto_spto_publico: p2000030.fec_vcto_spto_publico,
      num_spto_grp: p2000030.num_spto_grp,
      cod_canal1: p2000030.cod_canal1,
      cod_canal2: p2000030.cod_canal2,
      cod_canal3: p2000030.cod_canal3,
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarP2000030`, body)
      .pipe(catchError(this.errorHandler));
  }

  guardarP2000031(p2000031: P2000031) {
    const body = {
      cod_cia: p2000031.cod_cia,
      num_poliza: p2000031.num_poliza,
      num_spto: p2000031.num_spto,
      num_apli: p2000031.num_apli,
      num_spto_apli: p2000031.num_spto_apli,
      num_riesgo: p2000031.num_riesgo,
      tip_spto: p2000031.tip_spto,
      cod_modalidad: p2000031.cod_modalidad,
      nom_riesgo: p2000031.nom_riesgo,
      fec_efec_riesgo: p2000031.fec_efec_riesgo,
      fec_vcto_riesgo: p2000031.fec_vcto_riesgo,
      mca_baja_riesgo: p2000031.mca_baja_riesgo,
      mca_vigente: p2000031.mca_vigente,
      mca_exclusivo: p2000031.mca_exclusivo,
      cod_usr_exclusivo: p2000031.cod_usr_exclusivo,
      num_certificado: p2000031.num_certificado,
      nom_certificado: p2000031.nom_certificado,
      txt_id_riesgo: p2000031.txt_id_riesgo,
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarP2000031`, body)
      .pipe(catchError(this.errorHandler));
  }

  guardarP2000020(p2000020: P2000020[]) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = p2000020;
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarP2000020`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }
  guardarP2000040(p2000040: P2000040[]) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = p2000040;
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarP2000040`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  guardarP2000060(p2000060: P2000060[]) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = p2000060;
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarP2000060`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  consultaPresupuesto() {
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/numPresupuesto`, null)
      .pipe(catchError(this.errorHandler));
  }

  cargarBatch(carga: PlyMpgS) {
    const body = {
      acc_enr_typ_val: carga.tip_spto_accion,
      apl_enr_sqn: carga.num_spto_apli,
      apl_val: carga.num_apli,
      bsn_val: carga.cod_negocio,
      btc_mvm_typ_val: carga.tip_mvto_batch,
      btc_prc_val: carga.num_orden,
      cac_enr_sqn: carga.num_spto_anulado,
      clp_val: carga.num_poliza_cliente,
      cmp_val: carga.cod_cia,
      cpt_usr_val: carga.cod_usr_captura,
      crn_val: carga.cod_mon,
      del_val: carga.num_contrato,
      dft_ply_val: carga.num_poliza,
      enr_cas_val: carga.cod_tip_spto,
      enr_efc_dat: carga.fec_efec_spto,
      enr_exp_dat: carga.fec_vcto_spto,
      enr_rsn_txt_val: carga.txt_motivo_spto,
      enr_sbd_val: carga.sub_cod_spto,
      enr_sqn: carga.num_spto,
      enr_val: carga.cod_spto,
      exc_nam: carga.nom_excepcion,
      exc_val: carga.cod_excepcion,
      exp_dat_rnw: carga.mca_renueva,
      exp_dat_tml_rnw: carga.mca_renueva_tmp,
      frs_lvl_val: carga.cod_nivel1,
      gpp_val: carga.num_poliza_grupo,
      lob_val: carga.cod_ramo,
      mdf_dat: carga.fec_actu,
      mnl_pre: carga.mca_prima_manual,
      mxm_opv_enr_val: carga.max_spto_vigente,
      mxm_rnw_qnt_val: carga.cant_renovaciones,
      ply_can_dbt: carga.mca_anulacion_por_deuda,
      ply_rnw: carga.mca_pre_renovacion,
      ply_val: carga.num_poliza,
      poc_dat: carga.fec_tratamiento,
      prc_idn_val: carga.idn_val,
      pry_ply: carga.mca_periodicidad,
      pta_ply: carga.mca_porrata,
      qtn_val: carga.num_poliza,
      rcp_val: carga.num_recibo,
      sbl_val: carga.num_subcontrato,
      scn_lvl_val: carga.cod_nivel2,
      sec_val: carga.cod_sector,
      stm: carga.hora_desde,
      sts_typ_val: carga.tip_situ,
      tcc_atz_typ_val: carga.tip_autoriza_ct,
      thp_val: carga.cod_agt,
      thr_lvl_val: carga.cod_nivel3,
      tnr_ply_typ_val: carga.tip_poliza_tr,
      tnr_ply_val: carga.num_poliza_tronador,
      tot_ecc_rtr: carga.mca_devuelve_todo,
      tot_rsk_val: carga.num_riesgos,
      usr_val: carga.cod_usr,
    };
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CargarBatch`, body)
      .pipe(catchError(this.errorHandler));
  }
  ejecutarBatch(fec_tratamiento: string, num_poliza: string) {
    return this.http
      .get<ResponseModel>(`${environment.api}Cotizar/EjecutaBatch?pm_poc_dat=${fec_tratamiento}&num_poliza=${num_poliza}`)
      .pipe(catchError(this.errorHandler));
  }
  svcCrearTercero(tercero: Tercero) {
    const headerOptions = new HttpHeaders();

    headerOptions.set('Content-Type', 'application/json');
    const body = tercero;
    return this.http
      .post<ResponseModel>(`${environment.api}Cotizar/CrearTercero`, body,{headers: headerOptions})
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
