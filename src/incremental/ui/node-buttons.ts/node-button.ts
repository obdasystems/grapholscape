import { Props } from "tippy.js";
import { GscapeButton } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";

export default class NodeButton extends ContextualWidgetMixin(GscapeButton) {

  cxtWidgetProps: Partial<Props> = {
    trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
    allowHTML: true,
    interactive: true,
    placement: "right",
    appendTo: document.querySelector('.gscape-ui') || undefined,
    // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
    content: this,
    offset: (info) => [0, -(info.popper.width / 2)],
  }
}

customElements.define('gscape-node-button', NodeButton)