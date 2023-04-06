import { NodeSingular } from "cytoscape";
import { LitElement, PropertyDeclarations, SVGTemplateResult, TemplateResult, css, html } from "lit";
import { Props } from "tippy.js";
import { BaseMixin, GscapeButtonStyle, baseStyle, contentSpinnerStyle, textSpinnerStyle } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";
import getIconSlot from "../../../ui/util/get-icon-slot";

export default class NodeButton extends ContextualWidgetMixin(BaseMixin(LitElement)) {

  node?: NodeSingular
  highlighted?: boolean

  cxtWidgetProps: Partial<Props> = {
    trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
    allowHTML: true,
    interactive: true,
    placement: "right",
    appendTo: document.querySelector('.gscape-ui') || undefined,
    // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
    content: this,
    offset: [0, 0],
    hideOnClick: false,
    sticky: true,
  }

  static properties: PropertyDeclarations = {
    content: { type: Object },
    contentType: { type: String, reflect: true },
    highlighted: { type: Boolean, reflect: true },
  }

  static styles = [
    baseStyle,
    textSpinnerStyle,
    contentSpinnerStyle,
    GscapeButtonStyle,
    css`
      .gscape-panel {
        padding: 4px;
        min-width: 20px;
        justify-content: center;
      }

      .highlighted {
        border-color: var(--gscape-color-accent);
      }
    `
  ]

  constructor(
    public content: TemplateResult | SVGTemplateResult | string | number,
    public contentType: 'icon' | 'template' = 'icon') {
    super()
  }

  render() {
    return html`
      <div
        class="gscape-panel btn ${this.highlighted ? 'primary' : ''}"
        style="${this.contentType === 'icon' ? 'border-radius: 50%;' : ''}"
      >
      ${this.contentType === 'icon'
        ? getIconSlot('icon', this.content as SVGTemplateResult)
        : this.content
      }
      </div>
    `
  }
}

customElements.define('gscape-node-button', NodeButton)