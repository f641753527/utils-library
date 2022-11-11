import { RequestMethod, RequestOptions } from './types'
import { Json2QueryString } from './utils'

class HttpRequest {

  constructor () {
  }

  request(url: string, options: RequestOptions) {
    return new Promise((resolve, reject) => {
      fetch(url, options).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  get(uri: string, options: RequestOptions) {
    const { params } = options
    const queryString = Json2QueryString(params)
    const url = queryString ? `${uri}?${queryString}` : uri
    return this.request(url, {
      options,
      method: RequestMethod.GET
    })
  }

  post(url: string, options: RequestOptions) {
    const { data = {} } = options
    return this.request(url, {
      options,
      method: RequestMethod.POST,
      body: JSON.stringify(data)
    })
  }

}

export default HttpRequest
