import { css, CSSResultGroup, html, LitElement } from "lit";
import { colors, minus, plus } from "../assets";
import { BaseMixin, DropPanelMixin } from "../common/mixins";
import baseStyle from "../style";
import GscapeEntityColorLegend from "./entity-color-legend";


export type ClassWithColor = {
  id: string,
  displayedName: string,
  iri: string,
  color?: string,
  filtered: boolean
}

export default class GscapeIncrementalFilters extends DropPanelMixin(BaseMixin(LitElement)) {
  title: string = 'Color Legend'
  protected isDefaultClosed: boolean = false

  static styles?: CSSResultGroup | undefined = [
    baseStyle,
    css`
      :host {
        position: absolute;
        bottom: 10px;
        left: 10px;
        max-height: 60%;
        max-width: 20%;
        display: flex;
      }
    `
  ]

  constructor(public entityColorLegend: GscapeEntityColorLegend) {
    super()
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  render() {
    return html`
      <div class="top-bar ${this.isPanelClosed() ? null : 'traslated-down' }">
        <gscape-button style="z-index: 1;"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? html`
                <span slot="icon">${colors}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : html`<span slot="icon">${minus}</span>`
          }
        </gscape-button>
      </div>


      <div id="drop-panel" class="gscape-panel">
        ${this.entityColorLegend}
      </div>
    `
  }
}

customElements.define('gscape-incremental-filters', GscapeIncrementalFilters)
