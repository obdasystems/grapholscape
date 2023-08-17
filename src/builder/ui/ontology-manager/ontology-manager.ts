import { css, html, LitElement } from "lit";
import { BaseMixin, baseStyle, ModalMixin } from "../../../ui";

export default class OntologyManager extends ModalMixin(BaseMixin(LitElement)) {

  constructor() {
    super()
  }
  static styles: any[] = [
    baseStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 30%;
        min-width: 300px;
        max-height: calc(90% - 100px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">
      </div>
    `
  }
}

customElements.define('ontology-manger', OntologyManager)