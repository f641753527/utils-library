import { TableConstructor, IColumnProps, IAnyStructure, POSITION, onTableWheelFn, TRowHeight } from '../types';
import { style } from './const';
import { LodashUtils, TableUtils } from '../utils';
import type { IRowPosInfo } from '../utils';




import Drawer from './Drawer'

export default class CanvasTable extends Drawer {
  private _canvas: HTMLCanvasElement;
  private _clientWidth: number = 0;

  private columns: IColumnProps[] = [];
  private data: IAnyStructure[] = [];
  /** 初始传入高度 */
  private initialHeight: number;
  /** canvas body 实际高度 */
  private _height: number = 0;
  /** canvas 总宽度 */
  private width: number = 0;
  private _headerHight: number = 0;
  private rowHeight: TRowHeight;
  /** 记录每一行的高度信息 */
  private rowHeights: IRowPosInfo[] = [];
  /** 表头最大深度 */
  private maxHeaderDepth: number = 1;

  /** 左侧fixed列总宽度 */
  private _fixedLeftWidth: number = 0;
  /** 右侧fixed列总宽度 */
  private _fixedRightWidth: number = 0;
  private _scrollX: number = 0;
  private _maxScrollX: number = 0;
  private _scrollY: number = 0;
  private _maxScrollY: number = 0;

  private onCanvasWheel?: onTableWheelFn;

  constructor(config: TableConstructor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    super(context);

    const { data, columns, height, rowHeight, headerHight, onWheel } = config;
    this._canvas = canvas;
    this.columns = columns;
    this.data = data;
    this.initialHeight = height as number;
    this._headerHight = (headerHight as number);
    this.rowHeight = rowHeight as TRowHeight;

    this.setState(data);

    if (onWheel) {
      this.onCanvasWheel = onWheel;
    }

    this.initEvents();
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
  set scrollX (scrollX: number) {
    this._scrollX = scrollX;
  }
  get scrollX() {
    return this._scrollX;
  }
  get headerHight() {
    return this._headerHight;
  }
  get maxScrollY() {
    return this._maxScrollY;
  }
  set maxScrollX(maxScrollX: number) {
    this._maxScrollX = maxScrollX;
  }
  get maxScrollX() {
    return this._maxScrollX;
  }
  set fixedLeftWidth(width: number) {
    this._fixedLeftWidth = width;
  }
  get fixedLeftWidth() {
    return this._fixedLeftWidth;
  }
  set fixedRightWidth(width: number) {
    this._fixedRightWidth = width;
  }
  get fixedRightWidth() {
    return this._fixedRightWidth;
  }
  get height() {
    return this._height;
  }

  init() {
    this.initColumnsWidth();
    this.setCanvasSize();
  }

  /** 设置初始状态  */
  public setState(data: IAnyStructure[]) {
    let { initialHeight: height, rowHeight } = this;
    this.data = data;
    this.rowHeights = TableUtils.getRowsPosInfo(data, rowHeight);

    /** 所有数据渲染真实高度 */
    const domTotalHeight = this.rowHeights.reduce((res, row) => res + row.height, 0);
    height = Math.min(height as number, domTotalHeight);
    this._height = (height as number);
    this._maxScrollY = Math.max(domTotalHeight - height, 0);
    this.scrollY = 0;
    this.setCanvasSize();
  }

  /** 设置单元格宽度 */
  initColumnsWidth() {
    this.fixedLeftWidth = 0;
    this.fixedRightWidth = 0;
    /** 固定宽度的列宽汇总 */
    let staticWidth = 0;
    /** 伸缩列宽度汇总 */
    let flexWidth = 0;
    let canvasWidth = 0;
    this.maxHeaderDepth = 1;
    LodashUtils.BFS(this.columns, { callback: (col, depth) => {
      /** 顶层的width由children计算而来 */
      this.maxHeaderDepth = Math.max(this.maxHeaderDepth, depth + 1);
      if (!col.children || !col.children.length) {
        staticWidth += col.width || 0;
        flexWidth += col.minWidth && !col.width ? col.minWidth : 0;
      }
    }});
    /** 屏幕剩余宽度(可供伸缩列分配的区域 即减去了固定宽度的列之后的剩余空间) */
    const screenLeftWidth = this._clientWidth - staticWidth;
    const columnEach = (cols: IColumnProps[], depth = 0) => {
      for (const col of cols) {
        col._left = x;
        col._top = depth * this.headerHight;
        col._height = (this.maxHeaderDepth - depth) * this.headerHight;
        if (col.children && col.children.length) {
          columnEach(col.children, depth + 1);
        }
        /** 里层col才需要计算width 有children的col width由children计算 */
        if (!col.children || !col.children.length) {
          col._realWidth = col.width || Math.max(
            col.minWidth || 0,
            ~~((col.minWidth as number) / (flexWidth || Infinity) * screenLeftWidth)
          );
          x += col._realWidth;
          canvasWidth += col._realWidth;
        } else {
          col._realWidth = x - col._left;
        }
        if (depth === 0) {
          if (col.fixed === 'left') {
            this.fixedLeftWidth += col._realWidth;
          }
          if (col.fixed === 'right') {
            this.fixedRightWidth += col._realWidth;
          }
        }
      }
    }
    let x = 0;
    columnEach(this.columns);
    /** 设置列宽度 优先取width 否则取minWidth */
    this.width = Math.min(this.clientWidth, canvasWidth);
    /** canvas width 不能小于固定列宽度 */
    const fixedWidth = this.fixedLeftWidth + this.fixedRightWidth;
    if (fixedWidth > 0 && this.width - fixedWidth < 200) {
      this.width = fixedWidth + 200;
    }
    /** 最大滚动宽度=总宽度-canvas宽度 */
    this._maxScrollX = canvasWidth - this.width;
  }
  setCanvasSize() {
    this._canvas.height = this.headerHight * this.maxHeaderDepth + this.height;
    this._canvas.width = this.width;
  }
  /** 设置当前可视区展示的数据 */
  draw = () => {
    // 清除画布
    this.clearCanvans();

    /** 绘制中间位置 */
    this.drawBody();
    this.drawHeader();

    /** 清除左侧 */
    this.clearCell({
      /** draw中间部分时 擦除整个画布 所以x直接取0 */
      x: 0,
      y: 0,
      /** draw中间部分时 擦除整个画布 所以width直接取canvas.widths */
      width: this.fixedLeftWidth,
      height: this.canvas.height,
    });

    if (this.maxScrollX > 0 && this.scrollX > 0 && this.fixedLeftWidth > 0) {
      this.drawShadow({
        x: 0,
        y: 0,
        width: this.fixedLeftWidth,
        height: this._canvas.height,
        style
      });
    }
    /** 绘制左侧 */
    this.drawBody('left');
    this.drawHeader('left');

    /** 清除右侧 */
    this.clearCell({
      x: this.canvas.width - this.fixedRightWidth,
      y: 0,
      width: this.fixedRightWidth,
      height: this.canvas.height,
    });
    if (this.maxScrollX > 0 && this.scrollX < this.maxScrollX && this.fixedRightWidth) {
      this.drawShadow({
        x: this.canvas.width - this.fixedRightWidth,
        y: 0,
        width: this.fixedLeftWidth,
        height: this._canvas.height,
        style
      });
    }
    /** 绘制右侧 */
    this.drawBody('right');
    this.drawHeader('right');

    [POSITION.LEFT, POSITION.TOP, POSITION.RIGHT, POSITION.BOTTOM].forEach(position => {
      this.drawCellBorder({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height,
        position,
        style: style,
      });
    });
  }
  
  throttleDraw = LodashUtils.throttle(this.draw, 60);

  /** 清除画布 */
  clearCanvans() {
    // 当宽高重新设置时，就会重新绘制
    const { canvas } = this;
    canvas.width = canvas.width;
    canvas.height = canvas.height;
  }
  /** 绘制表头 */
  drawHeader(type?: 'left' | 'right') {
    const { headerHight, columns: _columns } = this;

    const headerStyle = { ...style, ...style.header };

    const columns = _columns.filter(col => {
      return type ? col.fixed === type : (col.fixed !== 'left' && col.fixed !== 'right')
    });
    const eachColumns = (cols: IColumnProps[]) => {
      for (const col of cols) {
        const x = TableUtils.getColumnActualLeft(col, this, type);
        const width = col._realWidth as number;
        const y = (col._top as number);
        const height = (col._height as number);
        const hasChildren = col.children && col.children.length;
        /** 背景色 */
        this.fillRect({
          x,
          y,
          width,
          height,
          style: headerStyle,
        });
        this.drawCellText({
          label: col.label,
          x,
          y,
          width,
          height: hasChildren ? headerHight : height,
          style: headerStyle,
          align: hasChildren ? 'center' : col.align,
        });
        const positions = [POSITION.RIGHT, POSITION.BOTTOM];
        positions.forEach(position => {
          this.drawCellBorder({
            x,
            y,
            width,
            height: hasChildren ? headerHight : height,
            position,
            style: headerStyle,
          })
        });
        if (col.children && col.children.length) {
          eachColumns(col.children);
        }
      }
    }
    eachColumns(columns);
  }
  /** 绘制body */
  drawBody(type?: 'left' | 'right') {
    const { columns: _columns, scrollY, height, rowHeights, data } = this;

    const tableData = TableUtils.getScreenRows(scrollY, height, rowHeights, data);

    /** 区域columns */
    const blockColumns = _columns.filter(col => {
      return type ? col.fixed === type : (col.fixed !== 'left' && col.fixed !== 'right')
    });
    /** body渲染只需要叶子节点 即没有children的列 */
    const columns: IColumnProps[] = []
    LodashUtils.BFS(blockColumns, { callback: (col, depth) => {
      if (!col.children || !col.children.length) {
        columns.push(col as IColumnProps);
      }
    }});

    tableData.forEach((row, rowIndex) => {
      columns.forEach((col, i) => {
        const x = TableUtils.getColumnActualLeft(col, this, type);
        const width = col._realWidth as number;
        const { height, top } = rowHeights[row.index];
        const y = (col._top as number) + (col._height as number) + (top - scrollY);
        this.drawCellText({
          label: col.key === '_index' ? (rowIndex + 1) : row[col.key],
          x,
          y,
          width,
          height,
          style,
          align: col.align,
        });
        const positions = [POSITION.RIGHT, POSITION.BOTTOM];
        positions.forEach(position => {
          this.drawCellBorder({
            x,
            y,
            width,
            height,
            position,
            style: style,
          })
        })
      })
    });
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
      this.throttleDraw();
      const onCanvasWheel = this.onCanvasWheel;
      if (onCanvasWheel && typeof onCanvasWheel === 'function') {
        onCanvasWheel(currentScrollY, this.maxScrollY);
      }
    }
  }

}
