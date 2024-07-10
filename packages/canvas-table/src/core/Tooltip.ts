const tooltipClassName = 'canvas-table--tooltip';

/** 气泡 */
export default class TooltipComponent {

    static singleIns: TooltipComponent | null;

    static parent: HTMLElement;
    static tooltipDomEl: HTMLElement | null = null;
    static content: string;
    static left: number;
    static top: number;
    static postion: 'top' | 'bottom' = 'bottom';

    private constructor(parent: HTMLElement) {
        TooltipComponent.parent = parent;
    }

    public static getInstance(parent: HTMLElement, content: string, left: number, top: number, postion?: 'top' | 'bottom') {
        if (!TooltipComponent.singleIns) {
            TooltipComponent.singleIns = new TooltipComponent(parent);
            TooltipComponent.singleIns.init();
        }
        TooltipComponent.singleIns.setState(content, left, top, postion);
        TooltipComponent.singleIns.show();
        return TooltipComponent.singleIns;
    }

    private init() {
        const tooltipDomEl = document.createElement('div');
        tooltipDomEl.setAttribute('x-placement', TooltipComponent.postion);
        tooltipDomEl.style.display = 'none';
        tooltipDomEl.className = tooltipClassName;
        const tooltipArrowEl = document.createElement('div');
        tooltipArrowEl.className = tooltipClassName + '__arrow';
        
        const tooltipContentEl = document.createElement('div');
        tooltipContentEl.className = tooltipClassName + '__content';

        tooltipDomEl.appendChild(tooltipContentEl);
        tooltipDomEl.appendChild(tooltipArrowEl);

        TooltipComponent.tooltipDomEl = tooltipDomEl;
        // TooltipComponent.parent.appendChild(tooltipDomEl);
        document.body.appendChild(tooltipDomEl);
    }

    public remove() {
        TooltipComponent.tooltipDomEl?.parentNode?.removeChild(TooltipComponent.tooltipDomEl);
        TooltipComponent.tooltipDomEl = null;
        TooltipComponent.singleIns = null;
    }

    public hide() {
        if (TooltipComponent.tooltipDomEl === null) return;
        TooltipComponent.tooltipDomEl.style.display = 'none';
    }

    private setState(content: string, left: number, top: number, postion?: 'top' | 'bottom') {
        TooltipComponent.content = content;
        TooltipComponent.left = left;
        TooltipComponent.top = top;
        postion && (TooltipComponent.postion = postion);
    }

    public show() {
        setTimeout(() => {
            if (!TooltipComponent.tooltipDomEl) return;
            const contentEl = TooltipComponent.tooltipDomEl.querySelector('.' + tooltipClassName + '__content');
            if (!contentEl) return;
            contentEl.innerHTML = TooltipComponent.content;
            console.log(contentEl.clientWidth, contentEl.clientHeight, 99)
            TooltipComponent.tooltipDomEl.style.top = TooltipComponent.top + 'px';
            TooltipComponent.tooltipDomEl.style.left = TooltipComponent.left + 'px';
            TooltipComponent.tooltipDomEl.style.display = 'block';
        }, 500)
    }

}
