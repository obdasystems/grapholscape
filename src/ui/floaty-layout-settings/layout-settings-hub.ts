import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { GscapeLayout } from '../../model/renderers/layout'
import { keep, playCircle, tune } from '../assets/icons'
import { BaseMixin, TippyDropPanelMixin } from '../common/mixins'
import { contentSpinnerStyle, getContentSpinner } from '../common/spinners'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'

export default class GscapeLayoutSettingsHub extends TippyDropPanelMixin(BaseMixin(LitElement), 'left') {
  layoutRun = false
  dragAndPin = false
  layouts: GscapeLayout[] = []
  selectedLayout?: GscapeLayout
  loading: boolean

  onLayoutRunToggle: (isActive: boolean) => void = () => { }
  onDragAndPinToggle: () => void = () => { }
  onUseOriginalPositions: () => void = () => { }

  static properties: PropertyDeclarations = {
    layoutRun: { type: Boolean },
    dragAndPin: { type: Boolean },
    loading: { type: Boolean },
    layouts: { type: Array },
    selectedLayout: { type: Object },
  }

  static styles: CSSResultGroup = [
    baseStyle,
    contentSpinnerStyle,
    css`
      :host {
        order: 9;
        margin-top:10px;
      }

      .gscape-panel-in-tray {
        min-width: 300px;
        white-space: unset;
      }

      gscape-toggle {
        padding: 8px;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
        margin-top: 8px;
        gap: 8px;
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button 
        style="display: block"
        type="subtle"
        @click="${this.togglePanel}"
        title="Layout Settings"
      >
        <span slot="icon">${tune}</span>
      </gscape-button>

      <div class="hr"></div>
      ${this.loading ? html`<center style="margin: 6px">${getContentSpinner()}</center>` : null}
      <gscape-button 
        style="display: block"
        type="subtle" 
        as-switch 
        @click="${this.layoutRunToggleHandler}"
        ?active=${this.layoutRun}
        title="${this.layoutRun ? 'Stop' : 'Run'} Layout"
      >
        <span slot="icon">${playCircle}</span>
      </gscape-button>

      <div class="hr"></div>

      <gscape-button
        style="display: block"
        type="subtle"
        as-switch
        @click="${this.dragAndPinToggleHandler}"
        ?active=${this.dragAndPin}
        title="${this.dragAndPin ? 'Disable' : 'Enable'} Node Pinning"
      >
        <span slot="icon">${keep}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">Layout Settings</div>
        <div class="content-wrapper">
          <gscape-layout-settings
            ?loading=${this.loading}
            .layouts=${this.layouts}
            .selectedLayout=${this.selectedLayout}
          >
          </gscape-layout-settings>
          <center>
            <gscape-button 
              label="Randomize"
              @click=${this.handleRandomize}
              ?disabled=${this.selectedLayout?.highLevelSettings.randomize.disabled}
            ></gscape-button>
          </center>
      </div>
    `
  }

  private layoutRunToggleHandler(e) {
    this.layoutRun = !this.layoutRun
    this.onLayoutRunToggle(this.layoutRun)
  }

  private dragAndPinToggleHandler(e) {
    this.onDragAndPinToggle()
  }

  private async handleRandomize() {
    await this.updateComplete
    this.dispatchEvent(new CustomEvent('randomize', { composed: true, bubbles: true }))
  }
}



customElements.define('gscape-layout-settings-hub', GscapeLayoutSettingsHub)