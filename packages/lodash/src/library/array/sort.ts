/** 排序规则函数 */
interface ISortRuleFn<T> {
  (a: T, b: T): number
}

interface ISortConfig<T> {
  /** 需要排序的字段名 */
  field: keyof T
  /** 按field排序后，需要进一步排序的函数 */
  next?: ISortRuleFn<T>
  /** 自定义field字段排序规则 */
  sortRule?: ISortRuleFn<T>
}

/** 按字段排序, 如需多次排序，递归调用此函数即可 */
export const sortByField = <T>(config: ISortConfig<T>): ISortRuleFn<T> => {
  const { field, next, sortRule } = config

  return (a, b) => {
    let result = 0
    /** 如果传递自定义排序规则，则按照业务册规则， 否则默认升序 */
    if (sortRule) result = sortRule(a, b)
    else result = (a[field] as unknown as number) - (b[field] as unknown as number)

    if (result === 0 && next) return next(a, b)

    return result
  }
}
