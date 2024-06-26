import { TableWrapperConstructor, EnumScrollBarDirection, IAnyStructure } from '../types';
import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';

export default class CanvasTableWrapper {
  private querySelector: string;
  private el: HTMLElement | null;
  private tableWrapper: HTMLElement | null = null;
  private table: Table;
  private scrollBarY: ScrollBar;
  private scrollBarX: ScrollBar;

  constructor(options: TableWrapperConstructor) {
    let { el, ...tableAttrs } = options;

    this.querySelector = el;

    /** canvas table 挂载的el节点 */
    this.el = document.querySelector(el);

    /** 纵向滚动条 */
    this.scrollBarY = new ScrollBar({
      direction: EnumScrollBarDirection.VERTICAL,
      onDrag: this.onScrollBarYDrag,
    })
    /***/
    this.scrollBarX = new ScrollBar({
      direction: EnumScrollBarDirection.HORIZONTAL,
      onDrag: this.onScrollBarXDrag,
    })

    /** 表格实例 */
    this.table = new Table({
      ...defaultTableAttrs,
      ...tableAttrs,
      onWheel: this.onCanvasWheel,
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
    const { headerHight, maxScrollY, canvas } = this.table;
    this.scrollBarY.scrollBarBox.style.display = maxScrollY <= 0 ? 'none' : 'block';
    if (maxScrollY <= 0) {
      return
    }
    /** tBody总高 */
    const height = canvas.height - headerHight;

    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = height / ((height + maxScrollY) || Infinity);
    /** 滚动条 内部块高度 */
    const scrollBarHeight = scrollBarRate * height;

    this.scrollBarY.outerLength = height;
    this.scrollBarY.innerLength = scrollBarHeight;
  }

  private initScrollBarX() {
    const { maxScrollX, canvas, fixedLeftWidth, fixedRightWidth } = this.table;
    this.scrollBarY.scrollBarBox.style.display = maxScrollX <= 0 ? 'none' : 'block';
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

  private initEvents() {
    window.addEventListener('resize', this.onResize);

    window.onbeforeunload = () => {
      window.removeEventListener('wheel', this.onResize);
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
