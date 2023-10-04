import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit"
import baseStyle from "../style"
import { BaseMixin, ModalMixin } from "./mixins"
import { error, info_outline, warning } from "../assets"

export default class GscapeConfirmDialog extends ModalMixin(BaseMixin(LitElement)) {

  protected _onConfirm?: () => void
  protected _onCancel?: () => void

  constructor(public message?: string, public dialogTitle = 'Confirm', public type: 'neutral' | 'warning' | 'error' = 'neutral') {
    super()
  }

  static properties: PropertyDeclarations = {
    message: { type: String },
    dialogTitle: { type: String },
    type: { type: String, reflect: true }
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

      .header {
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dialog-message {
        margin: 8px;
        padding: 8px;
        margin-bottom: 16px;
      }

      .dialog-message[type = "warning"] {
        background: var(--gscape-color-attention-muted);
        border-color: var(--gscape-color-attention);
      }

      .dialog-message[type = "error"] {
        background: var(--gscape-color-danger-muted);
        border-color: var(--gscape-color-danger);
      }

      .header > span[type = "error"] {
        color: var(--gscape-color-danger);
      }

      .header > span[type = "warning"] {
        color: var(--gscape-color-attention);
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
          <span type=${this.type} class="slotted-icon">${this.headerIcon}</span>
          ${this.dialogTitle}
        </div>
        <div class="dialog-message area" type=${this.type}>
          ${this.message}
        </div>

        <div class="buttons">
          ${this._onConfirm || this._onCancel
            ? html`
              <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
            `
            : null
          }
          <gscape-button type="primary" label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `
  }

  protected get headerIcon() {
    switch(this.type) {
      default:
        return info_outline

      case 'error':
        return  error
      
      case 'warning':
        return warning
    }
  }

  protected handleConfirm() {
    if (this._onConfirm)
      this._onConfirm()
    this.remove()
  }

  protected handleCancel() {
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

export function showMessage(message: string, title: string, container: any, type?: "neutral" | 'warning' | 'error') {
  const dialog = new GscapeConfirmDialog(message, title, type)
  container.appendChild(dialog)

  dialog.show()
  return dialog
}