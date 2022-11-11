import { HTMLElementRegister } from '../../utils/Register'
import { tagName } from './interface'
export * from './interface'

class Icon extends HTMLElementRegister {
  static tagName = tagName
  constructor () {
    super()
  }

  connectedCallback() {
    console.log('hello');
    this.textContent = 'Hello World!';
  }
}

export default Icon
