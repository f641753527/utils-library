export enum RequestMethod {
  get       = 'get',
  GET       = 'GET',
  POST      = 'POST',
  post      = 'post',
  delete    = 'delete',
  DELETE    = 'DELETE',
  PUT       = 'PUT',
  put       = 'put',
  patch     = 'patch',
  PATCH     = 'PATCH',
  OPTIONS   = 'OPTIONS',
  options   = 'options'
}

export interface RequestOptions {
  method: RequestMethod
  headers?: Headers
  body?: object,
  params?: object
}
