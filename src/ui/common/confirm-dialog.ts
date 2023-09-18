import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit"
import baseStyle from "../style"
import { BaseMixin, ModalMixin } from "./mixins"

export default class GscapeConfirmDialog extends ModalMixin(BaseMixin(LitElement)) {

  private _onConfirm?: () => void
  private _onCancel?: () => void

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
        font-size: 14px;
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
      <div class="gscape-panel">
        <div class="header">
          ${this.dialogTitle}
        </div>
        <div class="dialog-message">
          ${this.message}
        </div>

        <div class="buttons">
          ${this._onConfirm || this._onCancel
            ? html`
              <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
            `
            : null
          }
          <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `
  }

  private handleConfirm() {
    if (this._onConfirm)
      this._onConfirm()
    this.remove()
  }

  private handleCancel() {
    if(this._onCancel)
      this._onCancel()
    this.remove()
  }

  public onConfirm(callback: () => void): GscapeConfirmDialog {
    this._onConfirm = callback
    this.requestUpdate()
    return this
  }

  public onCancel(callback: () => void): GscapeConfirmDialog {
    this._onCancel = callback
    this.requestUpdate()
    return this
  }
}

customElements.define('gscape-confirm-dialog', GscapeConfirmDialog)

export function showMessage(message: string, title: string, container: any) {
  const dialog = new GscapeConfirmDialog(message, title)
  container.appendChild(dialog)

  dialog.show()
  return dialog
}