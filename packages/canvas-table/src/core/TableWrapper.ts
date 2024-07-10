import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';
import TooltipComponent from './Tooltip'
import { EnumScrollBarDirection } from '../types'
import type {
  TableWrapperConstructor,
  ITableAttrs,
  IAnyStructure,
  tableCellMouseEventFunc,
  ITableCellMouseEvent,
} from '../types';

export default class CanvasTableWrapper {
  private querySelector: string;
  private el: HTMLElement | null;
  private tableWrapper: HTMLElement | null = null;
  private table: Table;
  private scrollBarY: ScrollBar;
  private scrollBarX: ScrollBar;

  /** 气泡 */
  private tooltipInstance: TooltipComponent | null = null;

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
      onWheel: this.onCanvasWheel,
      onCellClick: this.onCanvasCellClick,
      onCellMove: this.onCanvasCellMove,
    });

    this.onMount();
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
        key: '_index',
        label: '序号',
        width: 40,
        align: 'center',
        fixed: 'left',
      })
    }
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
    this.table.throttleDraw();
  }

  private onScrollBarXDrag = (offset: number, maxOffset: number) => {
    const { maxScrollX } = this.table;
    this.table.scrollX = maxScrollX * (offset / (maxOffset || Infinity));
    this.table.throttleDraw();
  }

  private onCanvasWheel = (scrollDistance: number, maxScrollDistance: number) => {
    const { outerLength, innerLength } = this.scrollBarY;
    this.scrollBarY.offset = (scrollDistance / (maxScrollDistance || Infinity)) * (outerLength - innerLength);
  }

  private onCanvasCellClick = (cell: ITableCellMouseEvent | null) => {
    const { onCellClick } = this;
    if (cell && onCellClick && typeof onCellClick === 'function') {
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
      if (this.tooltipInstance) {
        this.tooltipInstance.hide();
      }
      return;
    }
    const { isHeader, row, col, left, top } = cell;
    const content = isHeader === true ? col.headerTooltip : '';
    if (content) {
      const _left = left + (col._realWidth as number) / 2;
      const _top = top + (col._height as number);
      this.tooltipInstance = TooltipComponent.getInstance(this.tableWrapper as HTMLElement, content, _left, _top);
    } else if (this.tooltipInstance) {
      // this.tooltipInstance.hide();
    }
  }

  private initEvents() {
    window.addEventListener('resize', this.onResize);

    window.onbeforeunload = () => {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private onResize = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    this.table.clientWidth = el.clientWidth;
    this.table.init();
    this.table.draw();

    el.parentElement?.removeChild(el);
    this.setWrapperSize();
    this.initScrollBarX();
  }

  public setData(data: IAnyStructure[]) {
    this.table.setState(data);
    this.table.draw();
    this.scrollBarY.offset = 0;
    this.initScrollBarY();
  }
}
