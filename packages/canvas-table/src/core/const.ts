import type { ITableAttrs, IStyle } from "../types"

export const defaultTableAttrs: Partial<ITableAttrs> = {
  height: 300,
  headerHight: 32,
  rowHeight: 28,
}

export const style: IStyle = {
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    borderColor: '#d2d2d6',
    backgroundColor: '#ebecf0',
  },
  padding: [6, 6, 6, 6],
  borderColor: '#d2d2d6',
  borderWidth: 1,
  backgroundColor: '#FFF',
  color: '#333',
  fontSize: 12,
  primary: '#096dd9',
}
