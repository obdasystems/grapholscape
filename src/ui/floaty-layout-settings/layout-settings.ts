import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { keep, keepOff, playCircle, refresh, stopCircle } from '../assets/icons'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'

export default class GscapeLayoutSettings extends DropPanelMixin(BaseMixin(LitElement)) {
  layoutRun = false
  dragAndPin = false
  originalPositions = false

  onLayoutRunToggle: () => void = () => { }
  onDragAndPinToggle: () => void = () => { }
  onUseOriginalPositions: () => void = () => { }

  static properties: PropertyDeclarations = {
    layoutRun: { type: Boolean, attribute: false },
    dragAndPin: { type: Boolean, attribute: false },
    originalPositions: { type: Boolean, attribute: false },
  }

  static styles: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        order: 9;
        margin-top:10px;
      }

      gscape-toggle {
        padding: 8px;
      }

      .toggles-wrapper {
        display: flex;
        flex-direction: column;
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
    `
  }

  private layoutRunToggleHandler(e) {
    e.preventDefault()
    this.onLayoutRunToggle()
  }

  private dragAndPinToggleHandler(e) {
    e.preventDefault()
    this.onDragAndPinToggle()
  }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings)