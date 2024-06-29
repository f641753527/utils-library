import { TableWrapperConstructor, ITableAttrs, EnumScrollBarDirection } from '../types';
import Table from './Table';
import ScrollBar from './ScrollBar';
import { defaultTableAttrs } from './const';

export default class CanvasTableWrapper {
  private querySelector: string;
  private el: HTMLElement | null;
  private table: Table;
  private scrollBarY: ScrollBar;

  constructor(options: TableWrapperConstructor) {
    let { el, ...tableAttrs } = options;

    this.querySelector = el;

    /** canvas table 挂载的el节点 */
    this.el = document.querySelector(el);

    /** 纵向滚动条 */
    this.scrollBarY = new ScrollBar({ direction: EnumScrollBarDirection.VERTICAL })

    /** table  属性 */
    const combinedTableAttrs = { ...defaultTableAttrs, ...tableAttrs, };
    /** 表格实例 */
    this.table = new Table(combinedTableAttrs);

    this.onMount();
  }

  /** el 节点挂载 */
  onMount = () => {
    if (!this.el) {
      document.addEventListener('DOMContentLoaded', () => {
        this.el = document.querySelector(this.querySelector);
        this.el = this.el || document.body;
        this.createTableEl();
      })
    } else {
      this.createTableEl();
    }
  }

  private createTableEl() {
    const { scrollBarY, table } = this;
    const el = this.el as HTMLElement;

    console.log('el节点已挂载, 宽度: ', el.clientWidth);
    const tableWrapperEl = document.createElement('div');
    tableWrapperEl.style.position = 'relative';
    tableWrapperEl.style.fontSize = '0';
    table.clientWidth = el.clientWidth;
    tableWrapperEl.appendChild(table.canvas);
    tableWrapperEl.appendChild(scrollBarY.scrollBarBox);
    el.appendChild(tableWrapperEl);
    /** 初始化表格配置 */
    this.init();
  }

  private init() {
    this.table.init();
    this.table.draw();
    this.initScrollBarY();
    this.initEvents();
  }

  private initScrollBarY() {
    const { sourceData, rowHeight, headerHight } = this.table;
    /** tBody总高 */
    const height = this.table.canvas.height - headerHight;

    /** 滚动条内部块占总高度占比 */
    const scrollBarRate = height / ((sourceData.length  * rowHeight) || height);
    /** 滚动条 内部块高度 */
    const scrollBarHeight = scrollBarRate * height;

    const maxScrollDistance = (1 - scrollBarRate) * (sourceData.length  * rowHeight);

    this.scrollBarY.outerLength = height;
    this.scrollBarY.innerLength = scrollBarHeight;
    this.scrollBarY.maxScrollDistance = maxScrollDistance;
  }


  private initEvents() {
    this.table.canvas.addEventListener('wheel', this.onWheel, { passive: false })
  }

  /** 鼠标滚轮 */
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { deltaX, deltaY } = e;
    // 判断是横向滚动还是纵向滚动
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
    const { maxScrollDistance, scrollDistance } = this.scrollBarY;

    if (isVertical) {
      /** 滚到底了 */
      if (deltaY > 0 && scrollDistance >= maxScrollDistance) {
        return
      }
      /** 到顶了 */
      if (deltaY < 0 && scrollDistance <= 0) {
        return
      }
      let scrollY = scrollDistance + deltaY;
      scrollY = scrollY < 0 ? 0 : (scrollY > maxScrollDistance ? maxScrollDistance : scrollY);
      this.scrollBarY.scrollDistance = scrollY;
      this.table.scrollY = scrollY;
      this.table.draw();
    }
  }
}
