import * as Button from './button'
import * as Icon from './icon'

export { default as Button } from './button'
export { default as Icon } from './icon'


declare global {
  namespace JSX {
   interface IntrinsicElements {
     [Button.tagName]: Button.ButtonProps
     [Icon.tagName]: Icon.IconProps
   }
 }
}
