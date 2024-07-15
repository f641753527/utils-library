import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';
import Tooltip from './Tooltip'
import { EnumScrollBarDirection } from '../types'
import type {
  TableWrapperConstructor,
  ITableAttrs,
  IAnyStructure,
  tableCellMouseEventFunc,
  ITableCellMouseEvent,
  IColumnProps,
} from '../types';
import { LodashUtils } from '../utils';

export default class CanvasTableWrapper {
  private querySelector: string;
  private el: HTMLElement | null;
  private tableWrapper: HTMLElement | null = null;
  private table: Table;
  private scrollBarY: ScrollBar;
  private scrollBarX: ScrollBar;

  /** 气泡 */
  private tooltipIns: Tooltip | null = null;

  /** 鼠标事件 */
  private onCellClick?: tableCellMouseEventFunc;
  private onCellMove?: tableCellMouseEventFunc;

  constructor(options: TableWrapperConstructor) {
    let { el, ...tableAttrs } = options;

    this.querySelector = el;

    /** canvas table 挂载的el节点 */
    this.el = document.querySelector(el);

    /** 纵向滚动条 */
    this.scrollBarY = new ScrollBar({
      direction: EnumScrollBarDirection.VERTICAL,
      onDrag: this.onScrollBarYDrag,
    });
    /** 横向滚动条 */
    this.scrollBarX = new ScrollBar({
      direction: EnumScrollBarDirection.HORIZONTAL,
      onDrag: this.onScrollBarXDrag,
    });

    const combinedTableAttrs: ITableAttrs = {
      ...defaultTableAttrs,
      ...tableAttrs,
    }

    const { onCellClick, onCellMove } = tableAttrs;
    if (onCellClick) {
      this.onCellClick = onCellClick;
    }
    if (onCellMove) {
      this.onCellMove = onCellMove;
    }

    this.initSetting(combinedTableAttrs);

    /** 表格实例 */
    this.table = new Table({
      ...combinedTableAttrs,
      columns: this.cleanColumns(combinedTableAttrs.columns),
      onWheel: this.onCanvasWheel,
      onCellClick: this.onCanvasCellClick,
      onCellMove: this.onCanvasCellMove,
    });

    this.onMount();

    setTimeout(() => this.createReactive(options), 0);
  }

  /** el 节点挂载 */
  onMount = () => {
    if (!this.el) {
      document.addEventListener('DOMContentLoaded', () => {
        this.el = document.querySelector(this.querySelector);
        if (!this.el) {
          throw new Error('找不到挂在节点')
        }
        this.createTableEl();
      })
    } else {
      this.createTableEl();
    }
  }

  private createTableEl() {
    const { scrollBarX, scrollBarY, table } = this;
    const el = this.el as HTMLElement;

    console.log('el节点已挂载, 宽度: ', el.clientWidth);
    const tableWrapperEl = document.createElement('div');
    this.tableWrapper = tableWrapperEl;
    tableWrapperEl.style.position = 'relative';
    tableWrapperEl.style.fontSize = '0';
    table.clientWidth = el.clientWidth;
    tableWrapperEl.appendChild(table.canvas);
    tableWrapperEl.appendChild(scrollBarY.scrollBarBox);
    tableWrapperEl.appendChild(scrollBarX.scrollBarBox);
    el.appendChild(tableWrapperEl);
    /** 初始化表格配置 */
    this.init();
    el.style.padding = '0';
    this.setWrapperSize();
  }

  /** 初始化表格配置 */
  private initSetting(settings: ITableAttrs) {
    const { columns, index } = settings;
    if (index === true) {
      columns.unshift({
        show: true,
        key: '_index',
        label: '序号',
        width: 40,
        align: 'center',
        fixed: 'left',
      })
    }
  }

  private cleanColumns(columns: IColumnProps[]) {
    LodashUtils.BFS<IColumnProps>(columns, { callback: (node, parent) => {
      if (node.show !== true) {
        const parentList = parent ? parent.children : columns;
        if (!parentList || !parentList.length) return;
        const index = parentList.findIndex(v => v.key === node.key);
        if (index === -1) return;
        parentList.splice(index, 1);
      }
    }})
    return columns;
  }

  private init() {
    this.table.init();
    this.table.draw();
    this.initScrollBarY();
    this.initScrollBarX();
    this.initEvents();
  }

  private setWrapperSize() {
    (this.el as HTMLElement).style.width = this.table.canvas.width + 'px';
    (this.tableWrapper as HTMLElement).style.width = this.table.canvas.width + 'px';
  }

  private initScrollBarY() {
    const { maxScrollY, height } = this.table;
    this.scrollBarY.scrollBarBox.style.display = maxScrollY <= 0 ? 'none' : 'block';
    if (maxScrollY <= 0) {
      return
    }
    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = height / ((height + maxScrollY) || Infinity);
    /** 滚动条 内部块高度 */
    const scrollBarHeight = scrollBarRate * height;

    this.scrollBarY.outerLength = height;
    this.scrollBarY.innerLength = scrollBarHeight;
  }

  private initScrollBarX() {
    const { maxScrollX, canvas, fixedLeftWidth, fixedRightWidth } = this.table;
    this.scrollBarX.scrollBarBox.style.display = maxScrollX <= 0 ? 'none' : 'block';
    if (maxScrollX <= 0) {
      return
    }
    /** 中间滚动宽度 */
    const centerWidth = canvas.width - fixedLeftWidth - fixedRightWidth;

    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = centerWidth / ((centerWidth + maxScrollX) || Infinity);
    /** 滚动条 内部块高度 */
    const scrollBarWidth = scrollBarRate * canvas.width;

    this.scrollBarX.outerLength = canvas.width;
    this.scrollBarX.innerLength = scrollBarWidth;
  }

  private onScrollBarYDrag = (offset: number, maxOffset: number) => {
    const { maxScrollY } = this.table;
    this.table.scrollY = maxScrollY * (offset / (maxOffset || Infinity));
    this.table.draw();
  }

  private onScrollBarXDrag = (offset: number, maxOffset: number) => {
    const { maxScrollX } = this.table;
    this.table.scrollX = maxScrollX * (offset / (maxOffset || Infinity));
    this.table.draw();
  }

  private onCanvasWheel = (scrollDistance: number, maxScrollDistance: number) => {
    const { outerLength, innerLength } = this.scrollBarY;
    this.scrollBarY.offset = (scrollDistance / (maxScrollDistance || Infinity)) * (outerLength - innerLength);
  }

  private onCanvasCellClick = (cell: ITableCellMouseEvent | null) => {
    const { onCellClick } = this;
    if (cell && !cell.isHeader && onCellClick && typeof onCellClick === 'function') {
      onCellClick(cell);
    }
  }

  private onCanvasCellMove = (cell: ITableCellMouseEvent | null) => {
    this.handleTooltip(cell);
    if (!cell) return
    const { isHeader, ...config } = cell;
    const { onCellMove } = this;
    /** 表格body触发才抛出事件 */
    if (!isHeader && onCellMove && typeof onCellMove === 'function') {
      onCellMove(config);
    }
  }

  /** 处理显示气泡 */
  private handleTooltip(cell: ITableCellMouseEvent | null) {
    if (cell === null) {
      if (this.tooltipIns) {
        this.tooltipIns.hide();
      }
      return;
    }
    const { isHeader, row, rowIndex, col, left, top } = cell;
    const tooltipGenerator = isHeader === true ? col.headerTooltip : col.tooltip;
    const content = typeof tooltipGenerator === 'function' ? tooltipGenerator(cell) : tooltipGenerator;
    if (content) {
      const { tableWrapper, table } = this;
      const { headerHight, rowHeights } = table;

      if (!tableWrapper) return;
      this.tooltipIns = Tooltip.getInstance();
      this.tooltipIns.init();
      const height = isHeader === true ? col.children && col.children.length ? headerHight : col._height
        : rowHeights[rowIndex as number].height;
      this.tooltipIns.setState({
        content,
        top: tableWrapper.offsetTop + top,
        left: tableWrapper.offsetLeft + left,
        parentWidth: col._realWidth as number,
        parentHeight: height,
        position: 'top',
      });
      this.tooltipIns.show();
    } else if (this.tooltipIns) {
      this.tooltipIns.hide();
    }
  }

  private initEvents() {
    const { tableWrapper } = this;
    if (!tableWrapper) return;
    window.addEventListener('resize', this.onResize);
    tableWrapper.addEventListener('mouseleave', this.onMouseLeave),

    window.onbeforeunload = () => {
      window.removeEventListener('resize', this.onResize);
      tableWrapper.removeEventListener('mouseleave', this.onMouseLeave);
    }
  }

  private onResize = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    this.table.clientWidth = el.clientWidth;
    this.table.init();
    this.table.drawBase();

    el.parentElement?.removeChild(el);
    this.setWrapperSize();
    this.initScrollBarX();
  }

  private onMouseLeave = () => {
    if (this.tooltipIns) {
      this.tooltipIns.remove();
      this.tooltipIns = null;
    }
  }

  public setData(data: IAnyStructure[]) {
    this.table.setData(data);
    this.table.draw();
    this.scrollBarY.offset = 0;
    this.initScrollBarY();
  }

  public setColumns(columns: IColumnProps[]) {
    this.table.columns = this.cleanColumns(columns);
    this.table.initColumnsWidth();
    this.initScrollBarX();
    if (this.table.scrollX > this.table.maxScrollX) {
      this.table.scrollX = this.table.maxScrollX;
    }
    const maxScrollXOffset = this.scrollBarX.outerLength - this.scrollBarX.innerLength;
    if (this.scrollBarX.offset > maxScrollXOffset) {
      this.scrollBarX.offset = maxScrollXOffset;
    }
    this.table.draw();
  }

  private createReactive(options: TableWrapperConstructor) {
    const _this = this;
    let { columns, data } = options;
    Object.defineProperty(options, 'data', {
      set(value: IAnyStructure[]) {
        data = value;
        _this.setData(value);
      },
      get() {
        return data;
      }
    });
    Object.defineProperty(options, 'columns', {
      set(cols: IColumnProps[]) {
        columns = cols;
        _this.setColumns(cols);
      },
      get() {
        return columns;
      }
    });
  }
}
