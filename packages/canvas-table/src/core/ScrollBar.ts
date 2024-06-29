
import { EnumScrollBarDirection } from '../types'

const scrollBarClassName = 'canvas-table-scroll-bar';

/** 滚动条 */
export default class ScrollBar {
  /** 方向 */
  private dirction: EnumScrollBarDirection = EnumScrollBarDirection.VERTICAL;
  /** 总长度 */
  private _outerLength: number = 0;
  /** 滚动条内块长度 */
  private _innerLength: number = 0;
  /** 最大滚动距离 */
  private _maxScrollDistance: number = 0;
  /** 当前滚动距离 */
  private _scrollDistance: number = 0;


  /** 滚动条容器 */
  private _scrollBarBox: HTMLElement;
  /** 内部滑块 */
  private _scrollBarSlider: HTMLElement;

  constructor(config: { direction: EnumScrollBarDirection; className?: string; }) {
    const { direction, className } = config;
    this.dirction = direction;

    const scrollBarBox = document.createElement('div');
    const posFlag = direction === EnumScrollBarDirection.VERTICAL ? '-y' : '-x';
    scrollBarBox.className = `${scrollBarClassName} ${scrollBarClassName + posFlag}`;
    if (className) {
      scrollBarBox.classList.add(className);
    }
    const scrollBarSlider = document.createElement('div');
    scrollBarSlider.className = scrollBarClassName + '--slider';
    scrollBarBox.appendChild(scrollBarSlider);
    this._scrollBarSlider = scrollBarSlider;
    this._scrollBarBox = scrollBarBox;
  }

  get scrollBarBox () {
    return this._scrollBarBox;
  }

  get scrollBarSlider() {
    return this._scrollBarSlider;
  }

  set outerLength (length: number) {
    this._outerLength = length;
    this.setStyleLength(this._scrollBarBox, length);
  }

  set innerLength (length: number) {
    this._innerLength = length;
    this.setStyleLength(this._scrollBarSlider, length);
  }

  get scrollDistance() {
    return this._scrollDistance;
  }
  set scrollDistance(distance: number) {
    this._scrollDistance = distance;
    this.setSliderPosition(distance);
  }

  get maxScrollDistance() {
    return this._maxScrollDistance;
  }
  set maxScrollDistance(distance: number) {
    this._maxScrollDistance = distance;
  }

  private setStyleLength(el: HTMLElement, length: number) {
    const dirction = this.dirction === EnumScrollBarDirection.VERTICAL ? 'height' : 'width';
    el.style[dirction] = length + 'px';
  }

  private setSliderPosition(distance: number) {
    const dirction = this.dirction === EnumScrollBarDirection.VERTICAL ? 'top' : 'left';
    const realDistance = this._outerLength * distance / (this._outerLength + this._maxScrollDistance);
    this.scrollBarSlider.style[dirction] = realDistance + 'px';
  }

}
