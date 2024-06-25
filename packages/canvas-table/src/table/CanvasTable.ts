import type { ICanvasTableConstructorProps, IColumnProps, IAnyStructure } from './types'
import { ctxDrawLine } from './utils'

/**
 * @description canvas-table
*/
export default class CanvasTable {
    /** 容器宽度 */
    private clientWidth: number;
    private canvas: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    private columns: IColumnProps[];
    private sourceData: IAnyStructure[];
    /** 当前展示数据 */
    private tableData: IAnyStructure[];
    private height: number;
    private headerHight: number;
    private rowHeight: number;

    /** 数据渲染开始位置 */
    private startIndex: number;
    private endIndex: number;

    constructor(options: ICanvasTableConstructorProps) {
        const { clientWidth, canvas, table } = options;
        const { columns, data, height, headerHight, rowHeight } = table
        this.clientWidth = clientWidth
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.columns = columns;
        this.sourceData = data;
        this.tableData = [];
        this.height = height as number;
        this.headerHight = (headerHight as number)
        this.rowHeight = rowHeight as number;

        this.startIndex = 0;
        this.endIndex = 0;

        this.init()
    }

    init() {
        this.setColumnsWidth();
        // 初始化数据
        this.setDataByPage();
        // 纵向滚动条Y
        // this.setScrollY();
    }
    /** 设置单元格宽度 */
    setColumnsWidth() {
        const flexColumns = this.columns.filter(col => col.hasOwnProperty('minWidth') && typeof col.minWidth === 'number')
        const fixedColumns = this.columns.filter(col => col.hasOwnProperty('width') && typeof col.width === 'number')
        /** 固定的宽度 */
        const fixedWidth = fixedColumns.reduce((res, col) => res + (col.width as number), 0)
        if (flexColumns && flexColumns.length) {
            this.canvas.width = this.clientWidth
            flexColumns.forEach(col => {
                col.width = (col.minWidth as number) / (this.clientWidth - fixedWidth)
            })
        } else {
            this.canvas.width = fixedWidth
        }
    }
    /** 设置当前可视区展示的数据 */
    setDataByPage() {
        /** 可视区展示的条数 */
        const limit = Math.floor((this.height - this.headerHight) / this.rowHeight);
        this.endIndex = Math.min(this.startIndex + limit, this.sourceData.length);
        this.tableData = this.sourceData.slice(this.startIndex, this.endIndex);
        // 清除画布
        this.clearCanvans();
        // 绘制表头
        this.drawHeader();
        // 绘制body
        this.drawBody();
    }
    /** 清除画布 */
    clearCanvans() {
        // 当宽高重新设置时，就会重新绘制
        const { canvas } = this;
        canvas.width = canvas.width;
        canvas.height = canvas.height;
    }
    /** 绘制表头 */
    drawHeader() {
        const { canvasCtx, canvas, headerHight, columns } = this;

        canvasCtx.strokeStyle = '#ccc'
        canvasCtx.lineWidth = 1;

        // top
        ctxDrawLine(canvasCtx, 0, 0.5, canvas.width, 0.5)

        // bottom
        ctxDrawLine(canvasCtx, 0, headerHight - 0.5, canvas.width, headerHight - 0.5)
        
        // left
        ctxDrawLine(canvasCtx, 0, 0, 0, headerHight - 0.5)

        // right
        ctxDrawLine(canvasCtx, canvas.width, 0, canvas.width, headerHight - 0.5)

        let x = 0
        const fontSize = 12
        canvasCtx.font = `${'normal'} ${fontSize}px ${'Microsoft YaHei'}`
        columns.forEach(col => {
            canvasCtx.fillText(col.label, x + 8, fontSize + (headerHight - fontSize) / 2)
            x += col.width as number
            /** right line */
            ctxDrawLine(canvasCtx, x - 0.5, 0, x - 0.5, headerHight - 0.5)
        })
    }
    /** 绘制body */
    drawBody() {

    }
}
