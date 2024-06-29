import type { IAnyStructure } from './global'

/** table column 属性 */
export interface IColumnProps {
  label: string;
  key: string;
  width?: number;
  minWidth?: number;
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

/** canvas-table 构造器 */
export interface TableWrapperConstructor extends ITableAttrs {
  el?: HTMLElement;
}
