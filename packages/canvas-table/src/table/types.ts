/** column 属性 */
export interface IColumnProps {
    label: string;
    key: string;
    width?: number;
    minWidth?: number;
    /** 左侧或右侧固定 */
    fixed?: 'left' | 'right';
}

/** 任意JSON */
export interface IAnyStructure {
    [key: string]: any
}

/** table 组件 props */
export interface ITableCompProps {
    columns: IColumnProps[];
    data: IAnyStructure[];
    /** 表格高度 */
    height?: number;
    rowHeight?: number;
    headerHight?: number;
}

/** CanvasTable  构造器 属性 */
export interface ICanvasTableConstructorProps {
    clientWidth: number;
    canvas: HTMLCanvasElement;
    table: ITableCompProps;
}

interface baseStyle {
    padding?: number | number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    color?: string;
    fontSize?: number;
    fontWeight?: string | number;
}

/** CanvasTable 样式 */
export interface IStyle extends baseStyle {
    header?: baseStyle;
    summary?: baseStyle;
}
