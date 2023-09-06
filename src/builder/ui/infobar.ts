import { LitElement, PropertyDeclarations, css, html } from "lit"
import * as UI from '../../ui'

const {
    BaseMixin,
    baseStyle,
    icons,
  } = UI
  
  export default class GscapeDesignerInfobar extends BaseMixin(LitElement) {
    title = "Designer Tools"

    static properties: PropertyDeclarations = {
      content: {type: String}
    }
  
    static styles = [
      baseStyle,
      css`
        :host {
          left: 50%;
          transform: translate(-50%);
          position: absolute;
          bottom: 70px;
        }
  
        .gscape-panel {
          background-color: transparent;
          padding: 0px;
          max-width: unset;
          width: unset;
          border: none;
          box-shadow: none;
        }
  
        .widget-body {
          background-color: transparent;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          overflow: auto;
          width: fit-content;
        }

      `,
    ]
  
    constructor(public content?: string) {
      super()
    }
  
  
    render() {
      return html`
        <div class="gscape-panel">
          <div class="widget-body">
            <div class="muted-text bold-text"> ${this.content} </div>
          </div>
        </div>
      `
    }
  }
  
  customElements.define('gscape-designer-infobox', GscapeDesignerInfobar)