import type { IAnyStructure } from './global'

/** table column 属性 */
export interface IColumnProps {
  label: string;
  key: string;
  width?: number;
  minWidth?: number;
  /** 实际渲染宽度 */
  _realWidth?: number;
  _height?: number;
  /** 距离canvas左侧开始位置的偏移 */
  _left?: number;
  /** 距离canvas 顶部开始位置的偏移 */
  _top?: number;
  /** 左侧或右侧固定 */
  fixed?: 'left' | 'right';
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  children?: IColumnProps[];
  /** 文本过滤 */
  filter?: (row: IAnyStructure, col: IColumnProps, index: number) => string | number;
  /** 表头气泡 */
  headerTooltip?: string;
  tooltip?: string | ((ev: ITableCellMouseEvent) => string);
}

export type TRowHeight = number | ((row: IAnyStructure, i: number) => number)

/** table 表哥组件 props */
export interface ITableAttrs {
  columns: IColumnProps[];
  data: IAnyStructure[];
  /** 表格高度 */
  height?: number;
  rowHeight?: TRowHeight;
  headerHight?: number;
  /** 是否显示索引列 */
  index?: boolean;
  /** 单元格点击事件 */
  onCellClick?: tableCellMouseEventFunc;
  /** 单元格鼠标移动事件 */
  onCellMove?: tableCellMouseEventFunc;
}

/** canvas-table wrapper 构造器 */
export interface TableWrapperConstructor extends ITableAttrs {
  el: string;
}

export interface ITableCellMouseEvent {
  rowIndex?: number;
  /** 是否触发在表头 */
  isHeader?: boolean;
  row?: IAnyStructure;
  col: IColumnProps;
  /** 距离canvas左侧距离 */
  left: number;
  width: number;
  /** 距离canvas顶部距离 */
  top: number;
  height: number;
}

/** 单元格点击事件 */
export type tableCellMouseEventFunc =  (ev: ITableCellMouseEvent | null) => void;
/** 表格滚动事件 */
export type tableWheelEvent =  (scrollDistance: number, maxScrollDistance: number) => void;
/** canvas-table 构造器 */
export interface TableConstructor extends ITableAttrs {
  onWheel?: tableWheelEvent;
}
