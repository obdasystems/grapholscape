import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { addEntityIcon, addDataPropertyIcon, addObjectPropertyIcon } from '../assets/icons'
import baseStyle from '../style'
import { BaseMixin, ModalMixin } from '../common/mixins'
import { OntologyViewModel } from '../ontology-info/ontology-info'
import GscapeConfirmDialog from '../common/confirm-dialog'

export default class GscapeNewElementModal extends ModalMixin(BaseMixin(LitElement)){

    ontology: OntologyViewModel
    public get modal(): HTMLElement | undefined | null { return this.shadowRoot?.querySelector('.gscape-panel') }

    public onConfirm: (iri: string) => void = () => {}
    public onCancel: () => void = () => {}

    static properties: PropertyDeclarations = {
      dialogTitle: {type: String}
    }

    constructor(public message?: string, public dialogTitle?) {
        super()
    }

    static styles?: CSSResultGroup = [
        baseStyle,
        css`
        :host {
            position: absolute;
          }
        .drawing-btn {
            position: absolute;
            top: 50px;
            left: 10px;
            border-radius: var(--gscape-border-radius-btn);
            border: 1px solid var(--gscape-color-border-subtle);
            background-color: var(--gscape-color-bg-default);
        }

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
            font-size: 15px;
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

    private handleConfirm = () => {
      let prefix = this.shadowRoot?.querySelector('#prefix') as HTMLSelectElement
      let input = this.shadowRoot?.querySelector('#input') as HTMLInputElement
      let iri = prefix.options[prefix.selectedIndex].text + input.value
      this.onConfirm(iri)
      this.resetForm()
    }

    private handleCancel = () => {
      this.onCancel()
      this.resetForm()
    }

    private resetForm = () => {
      let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
      if (myform){
        myform.reset()
      }
    }

    render() {
        return html`
        <div>          
          <div class="gscape-panel">
            <div class="header">
            ${this.dialogTitle}
            </div>
            <form id= "new-element-form">
                <label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="prefix">Prefix:</label><br>
                <select style = "width: 95%; margin: 8px 8px 8px 8px ;" id="prefix" name="prefix" required>
                    ${this.ontology.namespaces.map((n, i) => {
                      return html`<option value="${i}">${n.toString()}</option>`
                    })}
                </select>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>
                <input style = "width: 95%; margin: 8px 8px 8px 8px ;" type="text" id="input" name="input" value="" required><br><br>
            </form>
            <div class="buttons">
                <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
                <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
            </div>
          </div>
        </div>
        `
    }
}

customElements.define('gscape-new-element', GscapeNewElementModal)