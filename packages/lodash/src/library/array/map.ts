export interface IMapIteratorCallBackType<T=any, P=any> {
  (item: T, index: number, list: T[]): P
}
export interface IMapType<T=any, P=any> {
  (arr: T[], cb: IMapIteratorCallBackType<T, P>): P[]
}

const map= <T, P>(sourceArray: T[], callback: IMapIteratorCallBackType<T,P>) => {
  const filteredArray: P[] = []
  for(let i = 0; i < sourceArray.length; i++) {
    const item = sourceArray[i]
    const newItem = callback(item, i, sourceArray)
    filteredArray.push(newItem)
  }
  return filteredArray
}

export default map
