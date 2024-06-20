export interface CargaBuzones {
  p2000030: P2000030[];
  p2000020: P2000020[];
  p2000040: P2000040[];
  p2000060: P2000060[];
  p2000031: P2000031[];
  p2100170: P2100170[];
}
export interface P2000030 {
  cod_cia: any;
  cod_sector: any;
  cod_ramo: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  fec_validez: any;
  fec_emision: any;
  fec_emision_spto: any;
  fec_efec_poliza: any;
  fec_vcto_poliza: any;
  fec_efec_spto: any;
  fec_vcto_spto: any;
  tip_duracion: any;
  num_riesgos: any;
  cod_mon: any;
  cod_fracc_pago: any;
  cant_renovaciones: any;
  num_renovaciones: any;
  tip_coaseguro: any;
  num_presupuesto: any;
  num_poliza_anterior: any;
  num_poliza_cliente: any;
  num_contrato: any;
  num_poliza_grupo: any;
  num_secu_grupo: any;
  cod_spto: any;
  sub_cod_spto: any;
  cod_tip_spto: any;
  tip_spto: any;
  txt_motivo_spto: any;
  tip_docum: any;
  cod_docum: any;
  cod_cuadro_com: any;
  cod_agt: any;
  pct_agt: any;
  cod_org: any;
  cod_asesor: any;
  cod_nivel1: any;
  cod_nivel2: any;
  cod_nivel3: any;
  cod_compensacion: any;
  tip_gestor: any;
  cod_gestor: any;
  mca_regulariza: any;
  tip_regulariza: any;
  pct_regulariza: any;
  cod_indice: any;
  anios_max_duracion: any;
  meses_max_duracion: any;
  dias_max_duracion: any;
  cod_agt2: any;
  pct_agt2: any;
  cod_agt3: any;
  pct_agt3: any;
  cod_agt4: any;
  pct_agt4: any;
  duracion_pago_prima: any;
  cod_envio: any;
  cod_ejecutivo: any;
  mca_tomadores_alt: any;
  mca_reaseguro_manual: any;
  mca_prorrata: any;
  mca_prima_manual: any;
  mca_provisional: any;
  fec_autorizacion: any;
  mca_poliza_anulada: any;
  mca_spto_anulado: any;
  num_spto_anulado: any;
  fec_spto_anulado: any;
  mca_spto_tmp: any;
  mca_datos_minimos: any;
  mca_impresion: any;
  mca_exclusivo: any;
  cod_usr: any;
  cod_nivel3_captura: any;
  fec_actu: any;
  mca_reaseguro_marco: any;
  tip_poliza_tr: any;
  num_poliza_tr: any;
  imp_cuota_inicial: any;
  num_poliza_siguiente: any;
  cod_dst_agt: any;
  cod_cuadro_coa: any;
  tip_rea: any;
  num_spto_publico: any;
  val_mca_int: any;
  hora_desde: any;
  num_subcontrato: any;
  cod_negocio: any;
  num_secu_cta_tar: any;
  val_cambio: any;
  fec_vcto_spto_publico: any;
  num_spto_grp: any;
  cod_canal1: any;
  cod_canal2: any;
  cod_canal3: any;
}
export interface P2000020 {
  cod_cia: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  num_riesgo: any;
  num_periodo: any;
  tip_nivel: any;
  cod_campo: any;
  val_campo: any;
  val_cor_campo: any;
  num_secu: any;
  txt_campo: any;
  mca_baja_riesgo: any;
  mca_vigente: any;
  mca_vigente_apli: any;
  cod_ramo: any;
  tip_subnivel: any;
}
export interface P2000031 {
  cod_cia: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  num_riesgo: any;
  tip_spto: any;
  cod_modalidad: any;
  nom_riesgo: any;
  fec_efec_riesgo: any;
  fec_vcto_riesgo: any;
  mca_baja_riesgo: any;
  mca_vigente: any;
  mca_exclusivo: any;
  cod_usr_exclusivo: any;
  num_certificado: any;
  nom_certificado: any;
  txt_id_riesgo: any;
}
export interface P2000040 {
  cod_cia: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  num_riesgo: any;
  num_periodo: any;
  num_secu: any;
  cod_cob: any;
  suma_aseg: any;
  imp_unidad: any;
  pct_participacion: any;
  cod_mon_capital: any;
  suma_aseg_baja_stro: any;
  suma_aseg_spto: any;
  tasa_cob: any;
  cod_franquicia: any;
  cod_limite: any;
  suma_aseg_sup: any;
  mca_baja_riesgo: any;
  mca_vigente: any;
  mca_vigente_apli: any;
  mca_baja_cob: any;
  cod_secc_reas: any;
  imp_agr: any;
  imp_agr_rel: any;
  imp_agr_spto: any;
  imp_agr_rel_spto: any;
  mes_base_regulariza: any;
  anio_base_regulariza: any;
  pct_enfermedad: any;
  duracion_profesion: any;
  pct_profesion: any;
  duracion_enfermedad: any;
  val_franquicia_min: any;
  val_franquicia_max: any;
  cod_ramo: any;
  suma_aseg_baja_stro_acc: any;
  cod_mon_franquicia:any;
}
export interface P2000060 {
  cod_cia: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  num_riesgo: any;
  tip_benef: any;
  num_secu: any;
  tip_docum: any;
  cod_docum: any;
  mca_principal: any;
  mca_calculo: any;
  mca_baja: any;
  mca_vigente: any;
  pct_participacion: any;
  fec_vcto_cesion: any;
  imp_cesion: any;
  num_prestamo: any;
  tip_relac: any;
  cod_subscripcion: any;
  mca_vip:any
}
export interface P2100170 {
  cod_cia: any;
  num_poliza: any;
  num_spto: any;
  num_apli: any;
  num_spto_apli: any;
  num_riesgo: any;
  num_periodo: any;
  cod_cob: any;
  cod_desglose: any;
  cod_eco: any;
  num_bloque_estudio: any;
  imp_acumulado_anual: any;
  imp_spto: any;
  imp_no_consumido: any;
  imp_anual: any;
  cod_ramo: any;
}

export interface CargaBatch {
  ply_mpg_s: PlyMpgS;
}

export interface PlyMpgS {
  fec_tratamiento: string; //fec_tratamiento
  num_orden: number; //num_orden
  tip_mvto_batch: string; //tip_mvto_batch
  cod_cia: number; //cod_cia
  cod_sector: number; //cod_sector
  cod_ramo: number; //cod_ramo
  cod_nivel1: number; //cod_nivel1
  cod_nivel2: number; //cod_nivel2
  cod_nivel3: number; //cod_nivel3
  cod_agt: number; //cod_agt
  cod_mon: number; //cod_mon
  num_poliza_grupo?: string; //num_poliza_grupo
  num_contrato?: any; //num_contrato
  num_poliza_cliente?: string; //num_poliza_cliente
  num_poliza: string; //num_poliza
  num_poliza2?: string; //mismo valor num_poliza
  num_poliza_tronador: any; //num_poliza_tronador
  num_poliza_definitivo: string; //num_poliza_definitivo
  num_spto?: number; //num_spto
  num_apli?: number; //num_apli
  num_spto_apli: number; //num_spto_apli
  tip_poliza_tr: string; //tip_poliza_tr
  fec_efec_spto: string; //fec_efec_spto
  fec_vcto_spto: string; //fec_vcto_spto
  num_recibo?: any; //num_recibo
  num_riesgos?: any; //num_riesgos
  mca_prima_manual: string; //mca_prima_manual
  cod_spto: any; //cod_spto
  sub_cod_spto: any; //sub_cod_spto
  cod_tip_spto: string; //cod_tip_spto
  txt_motivo_spto: string; //txt_motivo_spto
  mca_renueva?: any; //mca_renueva
  mca_renueva_tmp?: any; //mca_renueva_tmp
  mca_periodicidad?: any; //mca_periodicidad
  cant_renovaciones?: any; //cant_renovaciones
  mca_porrata?: any; //mca_porrata
  mca_devuelve_todo?: any; //mca_devuelve_todo
  tip_spto_accion?: any; //tip_spto_accion
  tip_autoriza_ct: string; //tip_autoriza_ct
  tip_situ: string; //tip_situ
  cod_excepcion?: any; //cod_excepcion
  nom_excepcion?: any; //nom_excepcion
  mca_pre_renovacion: string; //mca_pre_renovacion
  mca_anulacion_por_deuda: string; //mca_anulacion_por_deuda
  max_spto_vigente?: any; //max_spto_vigente
  cod_usr: string; //cod_usr
  cod_usr_captura: string; //cod_usr_captura
  fec_actu: string; //fec_actu
  num_subcontrato?: any; //num_subcontrato
  hora_desde?: any; //hora_desde
  cod_negocio: string; //cod_negocio
  num_spto_anulado?: any; //num_spto_anulado
  idn_val: string; //idn_val
}
