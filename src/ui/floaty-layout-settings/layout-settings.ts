import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { clustersLaoutIcon, colaLayoutIcon, dagreLayoutIcon, fcoseLayoutIcon, gridLayoutIcon, keep, playCircle, tune } from '../assets/icons'
import { BaseMixin, TippyDropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { GscapeLayout } from '../../model/renderers/layout'
import { SelectOption } from '../common/gscape-select'

const layoutIcons = {
  cola: colaLayoutIcon,
  fcose: fcoseLayoutIcon,
  dagre: dagreLayoutIcon,
  grid: gridLayoutIcon,
  cise: clustersLaoutIcon,
}

export default class GscapeLayoutSettings extends TippyDropPanelMixin(BaseMixin(LitElement), 'left') {
  layoutRun = false
  dragAndPin = false
  originalPositions = false
  private edgeLength: number | undefined
  crowdness: boolean
  avoidOverlap: boolean
  handleDisconnected: boolean
  layouts: GscapeLayout[]
  selectedLayout: GscapeLayout

  onLayoutRunToggle: (isActive: boolean) => void = () => { }
  onDragAndPinToggle: () => void = () => { }
  onUseOriginalPositions: () => void = () => { }

  static properties: PropertyDeclarations = {
    layoutRun: { type: Boolean },
    dragAndPin: { type: Boolean },
    edgeLength: { type: Number, state: true },
    layouts: { type: Array },
    selectedLayout: { type: Object },
  }

  static styles: CSSResultGroup = [
    baseStyle,
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

      .area {
        margin-bottom: 0;
      }

      .preference {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        align-items: center;
      }
      
      .preference > label {
        cursor: pointer;
        flex-grow: 2;
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
            <gscape-select
              style="align-self: center; width: initial"
              .options=${this.layouts.map(layout => ({
                id: layout.id,
                text: layout.displayedName,
                leadingIcon: layoutIcons[layout.id],
              })) as SelectOption[]}
              default-option=${this.selectedLayout.id}
              @change=${this.handleLayoutChange}
            >
            </gscape-select>
          <div class="area">
            <div class="preference actionable">
              <label for="edgeLengthSlider">Edge Length</label>
              <input
                ?disabled=${this.selectedLayout.highLevelSettings.edgeLengthFactor.disabled}
                @change=${(e) => {
                  this.handleSettingChange(e, 'edgeLengthFactor', 'value')
                  this.edgeLength = e.target.value
                }}
                @input=${(e) => this.edgeLength = e.target.value} 
                type="range" min="0" max="100" .value=${this.selectedLayout.edgeLengthFactor} class="slider" id="edgeLengthSlider"
              />
              <span>${this.edgeLength !== undefined ? this.edgeLength : this.selectedLayout.edgeLengthFactor}</span>
            </div>

            <div class="preference actionable" title="Make edges longer if there are many edges on the same source or target node">
              <label for="crowdness">Consider Nearby Edges</label>
              <input
                ?disabled=${this.selectedLayout.highLevelSettings.considerCrowdness.disabled}
                @change=${e => this.handleSettingChange(e, 'considerCrowdness', 'checked')}
                type="checkbox" 
                .checked=${this.selectedLayout.considerCrowdness}
                id="crowdness" 
              />
            </div>
            
            <div class="preference actionable" title="Avoid node overlapping">
              <label for="avoidOverlap">Avoid Node Overlap</label>
              <input
                ?disabled=${this.selectedLayout.highLevelSettings.avoidOverlap.disabled}
                @change=${e => this.handleSettingChange(e, 'avoidOverlap', 'checked')}
                type="checkbox"
                .checked=${this.selectedLayout.avoidOverlap}
                id="avoidOverlap"
              />
            </div>

            <div class="preference actionable" title="Avoid overlapping between disconnected graphs">
              <label for="handleDisconnected">Handle Disconnected Components</label>
              <input
                ?disabled=${this.selectedLayout.highLevelSettings.handleDisconnected.disabled}
                @change=${e => this.handleSettingChange(e, 'handleDisconnected', 'checked')}
                type="checkbox"
                .checked=${this.selectedLayout.handleDisconnected}
                id="handleDisconnected"
              />
            </div>
          </div>
          <center>
            <gscape-button 
              label="Randomize"
              @click=${this.handleRandomize}
              ?disabled=${this.selectedLayout.highLevelSettings.randomize.disabled}
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

  private async handleLayoutChange(e) {
    e.preventDefault()
    const newSelectedLayout = this.layouts.find(l => l.id === e.target.selectedOptionsId[0])
    if (newSelectedLayout) {
      this.edgeLength = undefined
      await this.updateComplete
      this.dispatchEvent(new CustomEvent('layoutChange', {
        bubbles: true,
        composed: true,
        detail: newSelectedLayout
      }))
    }
  }

  private async handleSettingChange(e, settingId: string, settingKeyValue: 'value' | 'checked') {
    e.preventDefault()
    await this.updateComplete

    this.selectedLayout[settingId] = settingKeyValue === 'value'
      ? e.target.valueAsNumber
      : e.target.checked

    this.dispatchEvent(new CustomEvent('layoutSettingChange', {
      composed: true,
      bubbles: true,
      detail: {
        layout: this.selectedLayout,
        changedSetting: settingId,
      },
    }))
    this.requestUpdate()
  }

  private async handleRandomize() {
    await this.updateComplete
    this.dispatchEvent(new CustomEvent('randomize', { composed: true, bubbles: true }))
  }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings)