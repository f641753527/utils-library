export class HTMLElementRegister extends HTMLElement {
  static tagName: string
  public static regist() {
    const isDefined = customElements.get(this.tagName);
    if (!isDefined) {
      window.customElements.define(this.tagName, this)
    }
  }

  generateTemplate(style: string, tpl: string) {
    const template = document.createElement('template')
    
    template.innerHTML = `<style>${style}</style>${tpl}`

    return template.content.cloneNode(true)
  }

  render(style: string, tpl: string) {
    const content = this.generateTemplate(style, tpl)

    const shadow = this.attachShadow({
      mode: "open",
    });
    shadow.appendChild(content);
  }
}
