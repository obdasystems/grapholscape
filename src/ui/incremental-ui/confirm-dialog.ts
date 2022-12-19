import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit"
import baseStyle from "../style"
import { BaseMixin } from "../common/base-widget-mixin"
import { ModalMixin } from "../common/modal-mixin"

export default class GscapeConfirmDialog extends ModalMixin(BaseMixin(LitElement)) {

  public onConfirm: () => void = () => { }
  public onCancel: () => void = () => { }

  constructor(public message?: string, public dialogTitle = 'Confirm') {
    super()
  }

  static properties: PropertyDeclarations = {
    message: { type: String }
  }

  static styles: CSSResultGroup = [ 
    baseStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 400px;
        min-width: 300px;
      }

      .header, .dialog-message {
        margin: 8px;
      }

      .dialog-message {
        padding: 8px;
        margin-bottom: 16px;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
      }
    `
  ]

  render() {
    return html`
      ${this.modalBackground}
      <div class="gscape-panel">
        <div class="header">
          ${this.dialogTitle}
        </div>
        <div class="dialog-message area">
          ${this.message}
        </div>

        <div class="buttons">
          <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
          <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `
  }

  private handleConfirm() {
    this.onConfirm()
    this.remove()
  }

  private handleCancel() {
    this.onCancel()
    this.remove()
  }
}

customElements.define('gscape-confirm-dialog', GscapeConfirmDialog)