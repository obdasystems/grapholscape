import { LitElement, css, html } from "lit"
import { DropPanelMixin, BaseMixin, baseStyle, SizeEnum, GscapeToggle } from "../../../ui"
import { tune, searchOff, stopCircle } from "../../../ui/assets"
import settingsStyle from "../../../ui/settings/settings-style"
import { BOTTOM_RIGHT_WIDGET } from "../../../ui/style"
import getIconSlot from "../../../ui/util/get-icon-slot"


export default class GscapeVKGPreferences extends DropPanelMixin(BaseMixin(LitElement)) {

  endpoints: { name: string }[] = []
  selectedEndpointName: string
  limit: number
  showCounters: boolean

  static properties = {
    endpoints: { type: Array, attribute: false },
    selectedEndpointName: { type: String, reflect: true },
    limit: { type: Number, reflect: true },
    showCounters: { type: Boolean, reflect: true }
  }

  static styles = [ baseStyle, settingsStyle, 
    css`
      :host {
        order: 8;
      }

      .gscape-panel {
        min-width: 150px
      }

      .area:last-child {
        background: unset;
        border: unset;
        text-align: center;
        padding-top: unset;
      }

      .setting-obj {
        max-width: 200px;
        min-width: 150px;
      }

      .endpoint-list {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
      }

      input {
        width: 100%;
      }
    `
  ]

  protected _onEndpointChangeCallback: (newEndpointName: string) => void = () => { }
  protected _onLimitChangeCallback: (newLimit: number) => void = () => { }
  protected _onStopRequestsCallback: () => void = () => { }
  protected _onShowCountersChangeCallback: (state: boolean) => void = () => { }

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button
        type="subtle"
        @click=${this.togglePanel}
        title="Virtual knowledge graph explorer preferences"
      >
        <span slot="icon">${tune}</span>
      </gscape-button>


      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">VKG Preferences</div>
        <div class="content-wrapper">
          <div class="area">
            <span class="bold-text">Endpoint Settings</span>
            <div class="setting">
              <div class="title-wrap">
                <div class="setting-title">Endpoint list</div>
                <div class="setting-label muted-text">
                  select one of the currently running endpoints
                </div>
              </div>
              <div class="setting-obj endpoint-list">
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
            <div class="setting">
              <div class="title-wrap">
                <div class="setting-title">Limit Instances</div>
                <div class="setting-label muted-text">
                  Choose how many instances to retrieve for each search
                </div>
              </div>
              <div class="setting-obj">
                <input id="instances-limit" type="number" min="1" max="1000" value="${this.limit}" @change=${this.handleLimitChange}>
              </div>
            </div>
          </div>

          <div class="area">
            <span class="bold-text">Graph Settings</span>
            <div class="setting">
              <div class="setting-obj" style="width: 100%; max-width: unset;">
                <gscape-toggle
                  @click=${this.handleShowCountersChange}
                  label="Show Counters on Classes"
                  label-position="left"
                  class="actionable"
                  key = 'show-counts'
                  ?checked = ${this.showCounters}
                ></gscape-toggle>
              </div>
            </div>
          </div>

          <div class="area">
            <gscape-button
              size=${SizeEnum.S}
              label='Stop Pending Requests'
              type='secondary'
              @click=${this._onStopRequestsCallback}
            >
              ${getIconSlot('icon', stopCircle)}
            </gscape-button>
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

  protected handleShowCountersChange(e) {
    e.preventDefault()
    const toggle = e.currentTarget as GscapeToggle
    toggle.checked = !toggle.checked
    this._onShowCountersChangeCallback(toggle.checked)
  }

  onEndpointChange(callback: (newEndpointName: string) => void) {
    this._onEndpointChangeCallback = callback
  }

  onLimitChange(callback: (limit: number) => void) {
    this._onLimitChangeCallback = callback
  }

  onShowCountersChange(callback: (state: boolean) => void) {
    this._onShowCountersChangeCallback = callback
  }

  onStopRequests(callback: () => void) {
    this._onStopRequestsCallback = callback
  }
}

customElements.define('gscape-vkg-preferences', GscapeVKGPreferences)