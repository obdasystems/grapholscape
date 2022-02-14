import { html, css } from 'lit'
import GscapeWidget from '../../common/gscape-widget'
import GscapeHeader from '../../common/gscape-header'
import GscapeToggle from '../../common/gscape-toggle'
import GscapeButton from '../../common/gscape-button'
import { tune } from '../../assets/icons'

export default class GscapeLayoutSettings extends GscapeWidget {

  static get properties() {
    return {
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          box-shadow: initial;
          position: initial;
        }

        .gscape-panel {
          bottom:initial;
          top:10px;
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
  }

  constructor() {
    super()
    this.collapsible = true

    this.layoutRunToggle = new GscapeToggle('layout-run', true, false, 'Layout Running')
    this.layoutRunToggle.label_pos = 'right'
    this.dragAndDropToggle = new GscapeToggle('layout-pin', false, false, 'Drag and Pin')
    this.dragAndDropToggle.label_pos = 'right'
    this.useOriginalPositionsToggle = new GscapeToggle('layout-orginal-pos', false, false, 'Original Positions')
    this.useOriginalPositionsToggle.label_pos = 'right'

    this.onLayoutRunToggle = {}
    this.onDragAndPinToggle = {}
    this.onUseOriginalPositions = {}

    this.btn = new GscapeButton(tune, 'Floaty Layout Settings')
    this.btn.onClick = () => this.toggleBody()
    this.btn.classList.add('flat')
    this.btn.style.position = 'inherit'
    this.classList.add('flat')
  }

  render() {
    return html`
      ${this.btn}
      <span class="gscape-panel-arrow hide"></span>
      <div class="widget-body hide gscape-panel border-right">
        <div class="gscape-panel-title">Layout Settings</div>
        <div class="toggles-wrapper">
          ${this.layoutRunToggle}
          ${this.dragAndDropToggle}
          ${this.useOriginalPositionsToggle}
        </div>
      </div>

    `
  }

  set onLayoutRunToggle(callback) {
    this._onLayoutRunToggle = callback
    this.layoutRunToggle.onToggle = callback
  }

  set onDragAndPinToggle(callback) {
    this._onDragAndPinToggle = callback
    this.dragAndDropToggle.onToggle = callback
  }

  set onUseOriginalPositions(callback) {
    this._onUseOriginalPositions = callback
    this.useOriginalPositionsToggle.onToggle = callback
  }

  get onLayoutRunToggle() {
    return this._onLayoutRunToggle
  }
}



customElements.define('gscape-layout-settings', GscapeLayoutSettings)