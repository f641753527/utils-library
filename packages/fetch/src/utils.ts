export function Json2QueryString(params?: object): string {
  let quertString = ''
  if (!params) return quertString
  for (let key in params) {
    quertString += `${key}=${params[key]}&`
  }
  return quertString.substr(0, quertString.length - 1)
}
