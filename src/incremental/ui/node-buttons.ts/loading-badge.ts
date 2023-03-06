import { css, html, LitElement } from "lit"
import { baseStyle, ContextualWidgetMixin, textSpinner, textSpinnerStyle } from "../../../ui"

export default class LoadingBadge extends ContextualWidgetMixin(LitElement) {

  static styles = [
    baseStyle,
    textSpinnerStyle,
    css`
      .gscape-panel {
        min-width: unset;
        min-height: unset;
        width: fit-content;
        height: 20px;
        border-radius: 50%;
        padding: 4px;
        display: flex;
        align-items: center;
      }
    `
  ]

  constructor() {
    super()

    this.cxtWidgetProps.hideOnClick = false
    this.cxtWidgetProps.sticky = true
  }

  render() {
    return html`
      <div class="gscape-panel">
        ${textSpinner()}
      </div>
    `
  }

}

customElements.define('gscape-loading-badge', LoadingBadge)