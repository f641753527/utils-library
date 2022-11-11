export interface IFilterIteratorCallBackType<T=any> {
  (item: T, index: number, list: T[]): boolean
}
export interface IFilterType<T=any> {
  (arr: T[], cb: IFilterIteratorCallBackType<T>): T[]
}

const filter = <T>(sourceArray: T[], callback: IFilterIteratorCallBackType<T>) => {
  const filteredArray = []
  for(let i = 0; i < sourceArray.length; i++) {
    const item = sourceArray[i]
    const isOK = callback(item, i, sourceArray)
    isOK && filteredArray.push(item)
  }
  return filteredArray
}

export default filter
