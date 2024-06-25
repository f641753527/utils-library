/** column 属性 */
export interface IColumnProps {
    label: string;
    key: string;
    width?: number;
    minWidth?: number;
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
