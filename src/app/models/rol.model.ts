export interface Rol {
  cod_cia:     number;
  cod_rol:     number;
  rol_nombre:  string;
  estado:      string;
  sectores: Sectores[];
}

export interface LstFeature {
  cod_rol:         number;
  cod_opcion:      number;
  opc_value:       string;
  opc_nombre:      string;
  opc_descripcion: string;
  opc_ruta:        string;
  estado:          string;
}

export interface Sectores {
  COD_SECTOR:     string,
  NOM_SECTOR:     string,
  OPCIONES:       LstFeature[]
}
