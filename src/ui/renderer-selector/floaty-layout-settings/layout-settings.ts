import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { tune } from '../../assets/icons'
import { BaseMixin } from '../../common/base-widget-mixin'
import '../../common/button'
import { DropPanelMixin } from '../../common/drop-panel-mixin'
import baseStyle from '../../style'

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
        box-shadow: initial;
        position: initial;
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
  }

  render() {
    return html`
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${tune}</span>
      </gscape-button>

      <div id="drop-panel" class="hide gscape-panel gscape-panel-in-tray hanging">
        <div class="header">Layout Settings</div>
        <div class="toggles-wrapper">

          <gscape-toggle
            class="actionable"
            @click = ${this.layoutRunToggleHandler}
            key = "layout-run"
            label = "Layout run"
            ?checked = ${this.layoutRun}
          ></gscape-toggle>

          <gscape-toggle
            class="actionable"
            @click = ${this.dragAndPinToggleHandler}
            key = "drag-and-pin"
            label = "Drag and pin"
            ?checked = ${this.dragAndPin}
          ></gscape-toggle>

        </div>
      </div>
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

  // set onLayoutRunToggle(callback) {
  //   this._onLayoutRunToggle = callback
  //   this.layoutRunToggle.onToggle = callback
  // }

  // set onDragAndPinToggle(callback) {
  //   this._onDragAndPinToggle = callback
  //   this.dragAndDropToggle.onToggle = callback
  // }

  // set onUseOriginalPositions(callback) {
  //   this._onUseOriginalPositions = callback
  //   this.useOriginalPositionsToggle.onToggle = callback
  // }

  // get onLayoutRunToggle() {
  //   return this._onLayoutRunToggle
  // }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings)