import type {
  TableConstructor,
  IColumnProps,
  IAnyStructure,
  tableWheelEvent,
  TRowHeight,
  tableCellMouseEventFunc,
  IStyle
} from '../types';
import { POSITION } from '../types'
import { style } from './const';
import { LodashUtils, TableUtils, CanvasUtils } from '../utils';
import type { IRowPosInfo } from '../utils';




import Drawer from './Drawer'

export default class CanvasTable extends Drawer {
  private _canvas: HTMLCanvasElement;
  private _clientWidth: number = 0;

  private _columns: IColumnProps[] = [];
  private _data: IAnyStructure[] = [];
  /** 初始传入高度 */
  private initialHeight: number;
  /** canvas body 实际高度 */
  private _height: number = 0;
  /** canvas 总宽度 */
  private width: number = 0;
  private _headerHight: number = 0;
  private rowHeight: TRowHeight;
  /** 记录每一行的高度信息 */
  private _rowHeights: IRowPosInfo[] = [];
  /** 表头最大深度 */
  private _maxHeaderDepth: number = 1;

  /** 左侧fixed列总宽度 */
  private _fixedLeftWidth: number = 0;
  /** 右侧fixed列总宽度 */
  private _fixedRightWidth: number = 0;
  private _scrollX: number = 0;
  private _maxScrollX: number = 0;
  private _scrollY: number = 0;
  private _maxScrollY: number = 0;

  private onCanvasWheel?: tableWheelEvent;
  private onCanvasCellClick?: tableCellMouseEventFunc;
  private onCanvasCellMove?: tableCellMouseEventFunc;

  constructor(config: TableConstructor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    super(context);

    const { data, columns, height, rowHeight, headerHight, onWheel, onCellClick, onCellMove } = config;
    this._canvas = canvas;
    this._columns = columns;
    this._data = data;
    this.initialHeight = height as number;
    this._headerHight = (headerHight as number);
    this.rowHeight = rowHeight as TRowHeight;

    this.setData(data);

    if (onWheel) {
      this.onCanvasWheel = onWheel;
    }
    if (onCellClick) {
      this.onCanvasCellClick = onCellClick;
    }
    if (onCellMove) {
      this.onCanvasCellMove = onCellMove;
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
  get data() {
    return this._data;
  }
  set data(data: IAnyStructure[]) {
    this._data = data;
  }
  get columns() {
    return this._columns;
  }
  set columns(columns: IColumnProps[]) {
    this._columns = columns;
  }
  get maxHeaderDepth() {
    return this._maxHeaderDepth;
  }
  set maxHeaderDepth(maxHeaderDepth: number) {
    this._maxHeaderDepth = maxHeaderDepth;
  }
  get rowHeights() {
    return this._rowHeights;
  }
  set rowHeights(rowHeights: IRowPosInfo[]) {
    this._rowHeights = rowHeights;
  }

  init() {
    this.initColumnsWidth();
    this.setCanvasSize();
  }

  /** 设置初始状态  */
  public setData(data: IAnyStructure[]) {
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
    LodashUtils.BFS<IColumnProps>(this.columns, { callback: (col, _, depth) => {
      /** 顶层的width由children计算而来 */
      this.maxHeaderDepth = Math.max(this.maxHeaderDepth, depth + 1);
      if ((!col.children || !col.children.length)) {
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
  drawBase = () => {
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
        width: this.fixedRightWidth,
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
  
  draw = LodashUtils.throttle(this.drawBase, 60);

  /** 清除画布 */
  clearCanvans() {
    // 当宽高重新设置时，就会重新绘制
    const { canvas } = this;
    canvas.width = canvas.width;
    canvas.height = canvas.height;
  }
  /** 绘制表头 */
  drawHeader(type?: 'left' | 'right') {
    const { headerHight, columns: _columns, scrollX, maxScrollX } = this;

    const headerStyle = { ...style, ...style.header } as Required<IStyle>;
    const { padding } = headerStyle;

    const columns = _columns.filter(col => {
      return type ? col.fixed === type : (col.fixed !== 'left' && col.fixed !== 'right')
    });
    const eachColumns = (cols: IColumnProps[]) => {
      for (const col of cols) {
        const x = TableUtils.getColumnActualLeft(col, scrollX, maxScrollX, type);
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
          x: x + padding[3],
          y,
          width: width - padding[1] - padding[3],
          height: hasChildren ? headerHight : height,
          style: headerStyle,
          align: hasChildren ? 'center' : col.align,
          icon: col.headerTooltip ? {
            text: '&#xe7dd;',
            direction: 'right',
            style: { ...headerStyle, padding: [0, 4, 0, 4], fontWeight: 500 },
          } : null,
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
    const { columns: _columns, scrollY, height, rowHeights, data, scrollX, maxScrollX } = this;

    const tableData = TableUtils.getScreenRows(scrollY, height, rowHeights, data);

    const { padding } = style as Required<IStyle>;

    /** 区域columns */
    const blockColumns = _columns.filter(col => {
      return type ? col.fixed === type : (col.fixed !== 'left' && col.fixed !== 'right')
    });
    /** body渲染只需要叶子节点 即没有children的列 */
    const columns: IColumnProps[] = []
    LodashUtils.BFS(blockColumns, { callback: (col) => {
      if (!col.children || !col.children.length) {
        columns.push(col as IColumnProps);
      }
    }});

    tableData.forEach((row, rowIndex) => {
      columns.forEach((col, i) => {
        const { key, filter, align, _realWidth, _top, _height, formatter, } = col;
        const x = TableUtils.getColumnActualLeft(col, scrollX, maxScrollX, type);
        const width = _realWidth as number;
        const { height, top } = rowHeights[row.index];
        const y = (_top as number) + (_height as number) + (top - scrollY);
        /** 自定义渲染 */
        if (formatter && typeof formatter === 'function') {
          this.formatterRender(row, col, width, formatter, x, y, height);
        } else {
          const label = key === '_index' ? (row.index + 1)
            : filter ? filter(row, col, rowIndex) : row[key];
          this.drawCellText({
            label,
            x: x + padding[3],
            y,
            width: width - padding[1] - padding[3],
            height,
            style,
            align: align,
          });
        }
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

  private formatterRender(row: IAnyStructure, col: IColumnProps, width: number, formatter: IColumnProps['formatter'],
    x: number, y: number, height: number) {

    if (!formatter) return;
    const result = formatter({ row, col, width });
    /** 当前渲染位置x */
    let _renderLeft = x;
    result.forEach((item, itemIndex) => {
      /** 单元格已满 */
      if (x + width - _renderLeft <= 0) return;
      const { width: itemWidth, style: itemStyle, icon, align, label  } = item;
      if (icon) {
        icon.style = icon.style || {};
        icon.style.padding = icon.style.padding || [0, 0, 0, 0];
      }
      const combinedStyle = { ...style, ...(itemStyle || {}) } as Required<IStyle>;
      const formatterItemPadding = TableUtils.getFormatterItemPadding(style, itemStyle, itemIndex, result.length);
      /** 单元格剩余宽度 */
      const cellLeftWidth = x + width - _renderLeft;
      /** 当前项宽度 */
      const formatterItemWidth = Math.min(itemWidth || cellLeftWidth, cellLeftWidth);
      const iconWidth = TableUtils.getFormatterItemIconWidth(icon, style);
      const formatterItemMaxWidth = formatterItemWidth - formatterItemPadding[1] - formatterItemPadding[3] - iconWidth;
      let { text, width: textWidth, isOver } = CanvasUtils.textOverflow(
        this.canvasCtx, 
        label,
        formatterItemMaxWidth,
        combinedStyle.fontSize,
        combinedStyle.fontWeight
      );
      textWidth = isOver ? formatterItemMaxWidth : textWidth;
      this.drawCellText({
        label: text,
        x: _renderLeft + formatterItemPadding[3],
        y,
        width: textWidth + iconWidth,
        height,
        style,
        align: align,
        icon,
      });
      _renderLeft += textWidth + iconWidth + formatterItemPadding[1] + formatterItemPadding[3];
    })
  }

  private initEvents = () => {
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('click', this.onClick);
    this.canvas.addEventListener('mousemove', this.onMouseMove);

    window.onbeforeunload = () => {
      this.canvas.removeEventListener('wheel', this.onWheel);
      this.canvas.removeEventListener('click', this.onClick);
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
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

  /** 点击事件 */
  private onClick = (e: MouseEvent) => {
    const cell = TableUtils.getMouseEventCell(e, this);
    const { onCanvasCellClick } = this;
    if (onCanvasCellClick && typeof onCanvasCellClick === 'function' && cell) {
      onCanvasCellClick(cell);
    }
  }

  /** 鼠标移动事件 */
  private onMouseMove = LodashUtils.throttle((e: MouseEvent) => {
    const targetCell = TableUtils.getMouseEventCell(e, this);
    const onCanvasCellMove = this.onCanvasCellMove;
      if (onCanvasCellMove && typeof onCanvasCellMove === 'function') {
        onCanvasCellMove(targetCell);
      }
  }, 60)

}
