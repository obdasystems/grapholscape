import { CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../../style";
import { GscapeButtonStyle } from "../button";

export default class GscapeTextSearch extends LitElement {

  private _onSearchCallback: (e: KeyboardEvent) => void = () => { }

  static properties: PropertyDeclarations = {
    value: { type: String, reflect: true },
    placeholder: { type: String, reflect: true}
  }

  static styles?: CSSResultGroup = [ baseStyle, GscapeButtonStyle ]

  public render() {
    return html`
      
    `
  }

  public onSearch(callback: (e: KeyboardEvent) => void) {
    this._onSearchCallback = callback
  }

}

customElements.define('gscape-text-search', GscapeTextSearch)