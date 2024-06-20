export interface Documento {
  CODIGO: number | null | undefined;
  CODIGO_REF: string | null | undefined;
  CODIGO_DOCUMENTO: number | null | undefined;
  PROCESO: string | null | undefined;
  NOM_PROCESO: string | null | undefined;
  MACROPROCESO: string | null | undefined;
  NOM_MACROPROCESO: string | null | undefined;
  TIPO_DOCUMENTO: number | null | undefined;
  NOM_TIPO_DOCUMENTO: string | null | undefined;
  NOMBRE_DOCUMENTO: string | null | undefined;
  VERSION_DOCUMENTO: string | null | undefined;
  FECHA_CREACION: Date | null | undefined;
  FECHA_ACTUALIZACION?: Date | null | undefined;
  AREA: string | null | undefined;
  DEPARTAMENTO?: string | null | undefined;
  SOLICITANTE_ACT?: string | null | undefined;
  RESPONSABLE_AUT?: string | null | undefined;
  PALABRAS_CLAVES?: string | null | undefined;
  BASE64?: string | null | undefined;
  TIPO_ARCHIVO?: string | null | undefined;

  Fecha_creacion_desde?: Date | null | undefined;
  Fecha_creacion_hasta?: Date | null | undefined;
  Fecha_actualizacion_desde?: Date | null | undefined;
  Fecha_actualizacion_hasta?: Date | null | undefined;
}