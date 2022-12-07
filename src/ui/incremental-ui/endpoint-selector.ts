import { css, html, LitElement } from "lit";
import baseStyle from "../style";
import { mastroEndpointIcon, searchOff } from "../assets";
import { BaseMixin } from "../common/base-widget-mixin";
import { DropPanelMixin } from "../common/drop-panel-mixin";

export default class GscapeEndpointSelector extends DropPanelMixin(BaseMixin(LitElement)) {

  endpoints: { name: string }[] = []
  selectedEndpointName: string

  static properties = {
    endpoints: { type: Array, attribute: false },
    selectedEndpointName: { type: String, reflect: true },
  }

  static styles = [ baseStyle, 
    css`
      :host {
        order: 8;
      }
    `
  ]

  protected _onEndpointChangeCallback: (newEndpointName: string) => void = () => { }

  render() {
    return html`
      <gscape-button
        @click=${this.togglePanel}
        title="Select Mastro endpoint"
      >
        <span slot="icon">${mastroEndpointIcon}</span>
      </gscape-button>


      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">Endpoint Selector</div>
        <div class="content-wrapper">
          ${this.endpoints.map(endpoint => {
            return html`
              <gscape-action-list-item
                @click=${this.handleEndpointClick}
                label="${endpoint.name}"
                ?selected = "${this.selectedEndpointName === endpoint.name}"
              >
              </gscape-action-list-item>
            `
          })}

          ${this.endpoints.length === 0
            ? html`
              <div class="blank-slate">
                ${searchOff}
                <div class="header">No endpoint available</div>
              </div>
            `
            : null
          }
        </div>
      </div>
    `
  }

  protected handleEndpointClick(e: { currentTarget: { label: string | undefined } }) {
    if (e.currentTarget.label && e.currentTarget.label !== this.selectedEndpointName)
      this._onEndpointChangeCallback(e.currentTarget.label)
  }

  onEndpointChange(callback: (newEndpointName: string) => void) {
    this._onEndpointChangeCallback = callback
  }
}