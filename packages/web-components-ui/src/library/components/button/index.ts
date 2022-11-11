import { HTMLElementRegister } from '../../utils/Register'
import { tagName } from './interface'
import tpl from './index.tpl'
import style from './index.less'
export * from './interface'

class Button extends HTMLElementRegister {
  static tagName = tagName
  constructor () {
    super()
    this.render(style[0][1], tpl)
  }

  static get observedAttributes () {
    return ['type', 'size']
  }

  connectedCallback() {
    console.log('Custom square element added to page.');
    const btn = this.shadowRoot?.querySelector('.web-button')

    btn!.addEventListener('click', () => {
      const ev = new CustomEvent<number>('tab-click', {
        composed: true,
        bubbles: true,
        detail: 123
      })
      
      this.dispatchEvent(ev)
    })
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) return
    this.updateStyle(name, oldValue, newValue)
  }

  updateStyle(name: string, oldValue: any, newValue: any) {
    const btn = this.shadowRoot?.querySelector('.web-button')

    switch(name) {
      case 'type':
        btn?.classList.remove(`web-button--${oldValue}`)
        btn?.classList.add(`web-button--${newValue}`)
        break;
      case 'size':
        btn?.classList.remove(`web-button--${oldValue}`)
        btn?.classList.add(`web-button--${newValue}`)
        break;
      default: break;
    }
  }
}

export default Button
