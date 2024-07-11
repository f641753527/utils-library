import { Singleton, LodashUtils } from '../utils'

const tooltipClassName = 'canvas-table--tooltip';

interface ITooltipState {
    left?: number;
    top?: number;
    content?: string;
    parentWidth?: number;
    parentHeight?: number;
    position?: 'top' | 'bottom';
}

/** 气泡 */
export default class Tooltip extends Singleton {

    private tooltipDomEl: HTMLElement | null = null;

    private left: number = 0;
    private top: number = 0;
    private content: string = '';
    /** 依附定位元素的宽 */
    private parentWidth: number = 0;
    private parentHeight: number = 0;
    private position: 'top' | 'bottom' = 'top';

    private visible: boolean = false;

    private currentRanderKey: string = '';

    constructor() {
        super();
        this.init();
    }

    public init() {
        if (this.tooltipDomEl) return;
        const tooltipDomEl = document.createElement('div');
        tooltipDomEl.style.display = 'none';
        tooltipDomEl.className = tooltipClassName;
        const tooltipArrowEl = document.createElement('div');
        tooltipArrowEl.className = tooltipClassName + '__arrow';
        
        const tooltipContentEl = document.createElement('div');
        tooltipContentEl.className = tooltipClassName + '__content';

        tooltipDomEl.appendChild(tooltipContentEl);
        tooltipDomEl.appendChild(tooltipArrowEl);

        this.tooltipDomEl = tooltipDomEl;
        document.body.appendChild(tooltipDomEl);
    }



    public remove() {
        this.tooltipDomEl?.parentNode?.removeChild(this.tooltipDomEl);
        this.visible = false;
        setTimeout(() => {
            this.tooltipDomEl = null;
        }, 50);
    }

    public hide() {
        if (this.tooltipDomEl === null) return;
        this.tooltipDomEl.style.display = 'none';
        this.visible = false;
    }

    public setState(state: ITooltipState) {
        Object.keys(state).forEach((key) => {
            ((this as any)[key]) = state[key as keyof ITooltipState];
        })
    }

    private generateUniqueKey() {
        const { left, top, content, parentWidth, parentHeight, position } = this;
        const originString = left + top + content + parentWidth + parentHeight + position;
        return btoa(encodeURIComponent(originString));
    }

    public async show() {
        if (this.visible === true && this.generateUniqueKey() === this.currentRanderKey) return;
        if (!this.tooltipDomEl) return;
        const contentEl = this.tooltipDomEl.querySelector('.' + tooltipClassName + '__content');
        if (!contentEl) return;
        const { left, top, content, parentWidth, parentHeight, position } = this;

        contentEl.innerHTML = content;
        this.tooltipDomEl.setAttribute('x-placement', position);
        this.tooltipDomEl.style.display = 'block';
        this.tooltipDomEl.style.opacity = '0';

        await LodashUtils.sleep(50);
        if (!this.tooltipDomEl) return;

        const width = contentEl.clientWidth + 16;
        const height = contentEl.clientHeight + 16;

        const _left = left + (parentWidth - width) / 2;
        const _top = position === 'top' ? top - height - 6 : top + parentHeight + 6;

        /** 顶部遮挡遮挡 */
        if (_top < 0) {
            this.setState({
                position: 'bottom',
            });
            this.show();
            return;
        }
        
        this.tooltipDomEl.style.top = _top + 'px';
        this.tooltipDomEl.style.left = _left + 'px';
        this.tooltipDomEl.style.opacity = '1';
        this.visible = true;
        this.currentRanderKey = this.generateUniqueKey();
    }

}
