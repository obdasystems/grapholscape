import { css, html, LitElement } from "lit";
import baseStyle from "../style";
import { searchOff, tune } from "../assets";
import { BaseMixin } from "../common/base-widget-mixin";
import { DropPanelMixin } from "../common/drop-panel-mixin";

export default class GscapeVKGPreferences extends DropPanelMixin(BaseMixin(LitElement)) {

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

      .gscape-panel {
        min-width: 150px
      }

      .area > .preference {
        padding: 8px;
      }
    `
  ]

  protected _onEndpointChangeCallback: (newEndpointName: string) => void = () => { }
  protected _onLimitChangeCallback: (newLimit: number) => void = () => { }

  render() {
    return html`
      <gscape-button
        @click=${this.togglePanel}
        title="Virtual knowledge graph explorer preferences"
      >
        <span slot="icon">${tune}</span>
      </gscape-button>


      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">VKG Preferences</div>
        <div class="content-wrapper">
          <div class="area">
            <span class="bold-text">Endpoint Selection</span>
            <div class="preference">
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
          <div class="area" style="margin-bottom: 0">
            <span class="bold-text">Limit Instances</span>
            <div class="preference">
              <div class="limit-box">
                <label for="instances-limit" class="bold-text">Limit</label>
                <input id="instances-limit" type="number" min="1" max="100" value="10" @change=${this.handleLimitChange}>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `
  }

  protected handleEndpointClick(e: { currentTarget: { label: string | undefined } }) {
    if (e.currentTarget.label && e.currentTarget.label !== this.selectedEndpointName)
      this._onEndpointChangeCallback(e.currentTarget.label)
  }

  protected handleLimitChange(e) {
    const input = e.currentTarget as HTMLInputElement

    if (input.reportValidity()) {
      this._onLimitChangeCallback(input.valueAsNumber)
    }
  }

  onEndpointChange(callback: (newEndpointName: string) => void) {
    this._onEndpointChangeCallback = callback
  }

  onLimitChange(callback: (limit: number) => void) {
    this._onLimitChangeCallback = callback
  }
}