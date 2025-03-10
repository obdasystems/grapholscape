import { css, CSSResultGroup, html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit";
import { GscapeLayout } from "../../model";
import { clustersLaoutIcon, colaLayoutIcon, dagreLayoutIcon, fcoseLayoutIcon, gridLayoutIcon } from "../assets";
import { SelectOption } from "../common/gscape-select";
import baseStyle from "../style";

export default class GscapeLayoutSettings extends LitElement {
  private _layoutIcons: { [x: string]: SVGTemplateResult | any } = {
    cola: colaLayoutIcon,
    fcose: fcoseLayoutIcon,
    dagre: dagreLayoutIcon,
    grid: gridLayoutIcon,
    cise: clustersLaoutIcon,
  }
  get layoutIcons() { return this._layoutIcons }
  set layoutIcons(icons) {
    this._layoutIcons = {
      ...this._layoutIcons,
      icons,
    }
    this.requestUpdate()
  }

  layouts: GscapeLayout[] = []
  selectedLayout: GscapeLayout
  loading: boolean = false

  private edgeLength?: number

  static properties: PropertyDeclarations = {
    edgeLength: { type: Number, state: true },
    layouts: { type: Array },
    selectedLayout: { type: Object },
    loading: { type: Boolean },
  }

  static styles?: CSSResultGroup | undefined = [
    baseStyle,
    css`
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
    `
  ]

  protected render() {
    return html`
      <div class="content-wrapper">
        <slot id="header-slot"></slot>
        <gscape-select
          style="align-self: center; width: initial"
          .options=${this.layouts.map(layout => ({
            id: layout.id,
            text: layout.displayedName,
            leadingIcon: this.layoutIcons[layout.id],
          })) as SelectOption[]}
          default-option=${this.selectedLayout.id}
          @change=${this.handleLayoutChange}
        >
        </gscape-select>
        <slot id="middle-slot"></slot>
        <div class="area">
          <div class="preference actionable">
            <label for="edgeLengthSlider">Edge Length</label>
            <input
              ?disabled=${this.selectedLayout.highLevelSettings.edgeLengthFactor.disabled}
              @change=${(e) => {
                this.handleSettingChange(e, 'edgeLengthFactor', 'value')
              }}
              @input=${(e) => { this.edgeLength = e.target.value }} 
              type="range"
              min="0"
              max="100"
              .value=${this.edgeLength !== undefined ? this.edgeLength : this.selectedLayout.edgeLengthFactor}
              class="slider"
              id="edgeLengthSlider"
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
        <slot id="footer-slot"></slot>
      </div>
    `
  }

  private async handleLayoutChange(e) {
    e.preventDefault()
    const newSelectedLayout = this.layouts.find(l => l.id === e.target.selectedOptionsId[0])
    if (newSelectedLayout) {
      this.selectedLayout = newSelectedLayout
      this.edgeLength = newSelectedLayout.edgeLengthFactor
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
    
    this.selectedLayout[settingId] = settingKeyValue === 'value'
    ? e.target.valueAsNumber
    : e.target.checked
    
    await this.updateComplete
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
}

customElements.define('gscape-layout-settings', GscapeLayoutSettings)