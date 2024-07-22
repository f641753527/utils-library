import type { ITableAttrs, IStyle } from "../types"

export const defaultTableAttrs: Partial<ITableAttrs> = {
  height: 300,
  headerHight: 32,
  rowHeight: 28,
  index: true,
}

export const style: IStyle = {
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    borderColor: '#d2d2d6',
    backgroundColor: '#ebecf0',
    iconFamily: 'iconfont',
    iconSize: 16,
    iconColor: '#333'
  },
  fontWeight: 500,
  padding: [6, 6, 6, 6],
  borderColor: '#d2d2d6',
  borderWidth: 1,
  backgroundColor: '#FFF',
  color: '#333',
  fontSize: 12,
  primary: '#096dd9',
  shadowColor: 'rgba(0, 0, 0, 0.4)',
  iconFamily: 'iconfont',
  iconSize: 12,
  iconColor: '#333',
}
