import type { IAnyStructure } from './global'

/** table column 属性 */
export interface IColumnProps {
  label: string;
  key: string;
  width?: number;
  minWidth?: number;
  /** 实际渲染宽度 */
  _realWidth?: number;
  /** 左侧或右侧固定 */
  fixed?: 'left' | 'right';
}

/** table 表哥组件 props */
export interface ITableAttrs {
  columns: IColumnProps[];
  data: IAnyStructure[];
  /** 表格高度 */
  height?: number;
  rowHeight?: number;
  headerHight?: number;
}

/** canvas-table wrapper 构造器 */
export interface TableWrapperConstructor extends ITableAttrs {
  el: string;
}

export type onTableWheelFn =  (scrollDistance: number, maxScrollDistance: number) => void;
/** canvas-table 构造器 */
export interface TableConstructor extends ITableAttrs {
  onWheel?: onTableWheelFn;
}
