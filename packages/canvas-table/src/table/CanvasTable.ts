import type { ICanvasTableConstructorProps, IColumnProps, IAnyStructure } from './types'
import { POSITION } from './types'
import { drawCellBorder, drawCellText } from './draw'
import { style } from './const'

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
    private tableData: IAnyStructure[] = [];
    /** canvas 总高度 (header + body) */
    private height: number;
    /** canvas 总宽度 */
    private width: number = 0;
    private headerHight: number;
    private rowHeight: number;

    /** 数据渲染开始位置 */
    private startIndex: number = 0;
    private endIndex: number = 0;

    constructor(options: ICanvasTableConstructorProps) {
        const { clientWidth, canvas, table } = options;
        const { columns, data, height, headerHight, rowHeight } = table
        this.clientWidth = clientWidth
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.columns = columns;
        this.sourceData = data;
        this.height = (height as number) + (headerHight as number);
        this.headerHight = (headerHight as number)
        this.rowHeight = rowHeight as number;

        this.init()
    }

    init() {
        this.initColumnsWidth();
        this.setCanvasSize();
        // 初始化数据
        this.setDataByPage();
        // 纵向滚动条Y
        // this.setScrollY();
    }
    /** 设置单元格宽度 */
    initColumnsWidth() {
        /** 固定宽度的列宽汇总 */
        let staticWidth = 0;
        /** 伸缩列宽度汇总 */
        let flexWidth = 0;
        /** 固定列列宽列宽(设置了fixed的列宽求和) */
        let fixedWidth = 0;
        let canvasWidth = 0;
        this.columns.forEach(col => {
            staticWidth += col.width || 0;
            flexWidth += col.minWidth && !col.width ? col.minWidth : 0;
        })
        /** 屏幕剩余宽度(可供伸缩列分配的区域 即减去了固定宽度的列之后的剩余空间) */
        const screenLeftWidth = this.clientWidth - staticWidth
        /** 设置列宽度 优先取width 否则取minWidth */
        this.columns.forEach((col, i) => {
            col.width = col.width || Math.max(
                col.minWidth || 0,
                (col.minWidth as number) / (flexWidth || Infinity) * screenLeftWidth
            );
            if (i === this.columns.length - 1 && screenLeftWidth && flexWidth) {
                col.width = this.clientWidth - canvasWidth;
            }
            canvasWidth += col.width;
            if (col.fixed === 'left' || col.fixed === 'right') {
                fixedWidth += col.width;
            }
        })
        this.width = Math.max(
            Math.min(this.clientWidth, canvasWidth),
            /** canvas width 不能小于固定列宽度 */
            fixedWidth + 200
        );
    }
    setCanvasSize() {
        this.canvas.height = this.height;
        this.canvas.width = this.width;
    }
    /** 设置当前可视区展示的数据 */
    setDataByPage() {
        /** 可视区展示的条数 */
        const limit = Math.floor(this.height / this.rowHeight);
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

        const headerStyle = { ...style, ...style.header };

        /** 背景色 */
        canvasCtx.fillStyle = headerStyle.backgroundColor as string;
        canvasCtx.fillRect(0, 0, this.width, this.headerHight);

        Object.keys(POSITION).forEach((key) => {
            drawCellBorder({
                ctx: canvasCtx,
                x: 0,
                y: 0,
                width: canvas.width,
                height: headerHight,
                position: POSITION[key as keyof typeof POSITION],
                style: headerStyle,
            })
        });

        let x = 0
        columns.forEach((col, i) => {
            drawCellText({
                ctx: canvasCtx,
                label: col.label,
                x,
                y: 0,
                width: col.width as number,
                height: headerHight,
                style: headerStyle,
            });
            /** right line */
            if (i === columns.length - 1) return;
            drawCellBorder({
                ctx: canvasCtx,
                x,
                y: 0,
                width: col.width as number,
                height: headerHight,
                position: POSITION.RIGHT,
                style: headerStyle,
            })
            x += col.width as number;
        })
    }
    /** 绘制body */
    drawBody() {

    }
}
