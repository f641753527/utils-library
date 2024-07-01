import { TableConstructor, IColumnProps, IAnyStructure, POSITION, onTableWheelFn } from '../types'
import { style } from './const'

import Drawer from './Drawer'

export default class CanvasTable extends Drawer {
  private _canvas: HTMLCanvasElement;
  private _clientWidth: number = 0;

  private columns: IColumnProps[] = [];
  private _sourceData: IAnyStructure[] = [];
  /** 当前展示数据 */
  private tableData: IAnyStructure[] = [];
  /** 初始传入高度 */
  private initialHeight: number;
  /** canvas body 实际高度 */
  private height: number = 0;
  /** canvas 总宽度 */
  private width: number = 0;
  private _headerHight: number = 0;
  private _rowHeight: number = 0;

  private _scrollY: number = 0;
  private _maxScrollY: number = 0;
  private startIndex: number = 0;
  private endIndex: number = 0;

  private onCanvasWheel?: onTableWheelFn;

  constructor(config: TableConstructor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    super(context);

    const { data, columns, height, rowHeight, headerHight, onWheel } = config;
    this._canvas = canvas;
    this.columns = columns;
    this._sourceData = data;
    this.initialHeight = height as number;
    this._headerHight = (headerHight as number)
    this._rowHeight = rowHeight as number;

    this.setState(data);

    if (onWheel) {
      this.onCanvasWheel = onWheel;
    }
  }

  get canvas() {
    return this._canvas;
  }

  set clientWidth(width: number) {
    this._clientWidth = width;
  }
  get clientWidth () {
    return this._clientWidth;
  }

  set scrollY (scrollY: number) {
    this._scrollY = scrollY;
  }
  get scrollY() {
    return this._scrollY;
  }
  get sourceData() {
    return this._sourceData;
  }
  set sourceData(data: IAnyStructure[]) {
    this._sourceData = data;
  }
  get rowHeight () {
    return this._rowHeight;
  }
  get headerHight() {
    return this._headerHight;
  }
  get maxScrollY() {
    return this._maxScrollY;
  }

  init() {
    this.initColumnsWidth();
    this.setCanvasSize();
    this.initEvents()
  }

  /** 设置初始状态  */
  public setState(data: IAnyStructure[]) {
    let { initialHeight: height, rowHeight } = this;
    /** 所有数据渲染真实高度 */
    const domTotalHeight = data.length * (rowHeight as number);
    height = Math.min(height as number, domTotalHeight);
    this._sourceData = data;
    this.height = (height as number);
    this._maxScrollY = Math.max(domTotalHeight - height, 0);
    this.scrollY = 0;
    this.setCanvasSize();
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
    const screenLeftWidth = this._clientWidth - staticWidth;

    /** 设置列宽度 优先取width 否则取minWidth */
    this.columns.forEach((col, i) => {
      col.width = col.width || Math.max(
        col.minWidth || 0,
        (col.minWidth as number) / (flexWidth || Infinity) * screenLeftWidth
      );
      if (i === this.columns.length - 1 && screenLeftWidth && flexWidth) {
        col.width = this._clientWidth - canvasWidth;
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
    this._canvas.height = this.headerHight + this.height;
    this._canvas.width = this.width;
  }
  /** 设置当前可视区展示的数据 */
  draw() {
    /** 可视区展示的条数 */
    const limit = Math.ceil(this.height / this.rowHeight);
    this.startIndex = ~~(this._scrollY / this.rowHeight);
    this.endIndex = Math.min(this.startIndex + limit, this.sourceData.length);
    this.tableData = this.sourceData.slice(this.startIndex, this.endIndex + 1);
    // 清除画布
    this.clearCanvans();
    // 绘制body
    this.drawBody();
    // 绘制表头
    this.drawHeader();
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
    const { canvas, headerHight, columns } = this;

    const headerStyle = { ...style, ...style.header };

    this.clearCell({
      x: 0,y: 0,
      width: canvas.width,
      height: headerHight
    });

    /** 背景色 */
    this.fillRect({
      x: 0,
      y: 0, 
      width: this.width,
      height: this.headerHight,
      style: headerStyle,
    });

    [POSITION.LEFT, POSITION.TOP].forEach(position => {
      this.drawCellBorder({
        x: 0,
        y: 0,
        width: canvas.width,
        height: headerHight,
        position,
        style: headerStyle,
      })
    });

    let x = 0
    columns.forEach((col, i) => {
      this.drawCellText({
        label: col.label,
        x,
        y: 0,
        width: col.width as number,
        height: headerHight,
        style: headerStyle,
      });
      [POSITION.RIGHT, POSITION.BOTTOM].forEach(position => {
        this.drawCellBorder({
          x,
          y: 0,
          width: col.width as number,
          height: headerHight,
          position,
          style: headerStyle,
        })
      });
      x += col.width as number;
    })
  }
  /** 绘制body */
  drawBody() {
    const { canvas, height, headerHight, rowHeight, columns, tableData } = this;

    this.drawCellBorder({
      x: 0,
      y: headerHight,
      width: canvas.width,
      height: height,
      position: POSITION.BOTTOM,
      style: style,
    })
    this.drawCellBorder({
      x: 0,
      y: headerHight,
      width: canvas.width,
      height: height,
      position: POSITION.LEFT,
      style: style,
    })

    tableData.forEach((row, rowIndex) => {
      let x = 0;
      let y = headerHight + rowHeight * rowIndex - (this.scrollY % rowHeight);
      columns.forEach(col => {
        this.drawCellText({
          label: row[col.key],
          x,
          y,
          width: col.width as number,
          height: rowHeight,
          style,
        });
        this.drawCellBorder({
          x,
          y,
          width: col.width as number,
          height: rowHeight,
          position: POSITION.RIGHT,
          style: style,
        })
        this.drawCellBorder({
          x,
          y,
          width: col.width as number,
          height: rowHeight,
          position: POSITION.BOTTOM,
          style: style,
        })
        x += col.width as number;
      })
    })
  }

  private initEvents = () => {
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });

    window.onbeforeunload = () => {
      this.canvas.removeEventListener('wheel', this.onWheel);
    }
  }

  /** 鼠标滚轮 */
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { deltaX, deltaY } = e;
    // 判断是横向滚动还是纵向滚动
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
    
    const { scrollY, maxScrollY } = this;

    if (isVertical) {
      /** 滚到底了 */
      if (deltaY > 0 && scrollY >= maxScrollY) {
        return
      }
      /** 到顶了 */
      if (deltaY < 0 && scrollY <= 0) {
        return
      }
      let currentScrollY = scrollY + deltaY;
      currentScrollY = currentScrollY < 0 ? 0 : (currentScrollY > maxScrollY ? maxScrollY : currentScrollY);
      this.scrollY = currentScrollY;
      this.draw();
      const onCanvasWheel = this.onCanvasWheel;
      if (onCanvasWheel && typeof onCanvasWheel === 'function') {
        onCanvasWheel(currentScrollY, this.maxScrollY);
      }
    }
  }

}
