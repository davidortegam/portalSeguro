export interface ResponseModel {
  succeeded: boolean,
  message: string,
  statusCode: string,
  errors: [any],
  data: any
}
