import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { BaseMixin, ModalMixin } from '../common/mixins'
import { OntologyViewModel } from '../ontology-info/ontology-info'
import baseStyle from '../style'

export default class GscapeNewElementModal extends ModalMixin(BaseMixin(LitElement)){

    ontology: OntologyViewModel
    public get modal(): HTMLElement | undefined | null { return this.shadowRoot?.querySelector('.gscape-panel') }

    public onConfirm: (iri: string | string[]) => void = () => {}
    public onCancel: () => void = () => {}

    static properties: PropertyDeclarations = {
      dialogTitle: {type: String},
      withoutPrefix: {type: String},
      enableMore: {type: String}
    }

    constructor(public message?: string, public dialogTitle?, public withoutPrefix?, public enableMore?) {
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
      let iri = this.withoutPrefix === 'none'? input.value : prefix.options[prefix.selectedIndex].text + input.value
      let iris = [iri]
      if(this.enableMore){
        let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
        let inputs = myform.getElementsByClassName('inp') 
        Array.from(inputs).forEach(element => {
          let input = element as HTMLInputElement
          iris.push(prefix.options[prefix.selectedIndex].text + input.value)
        });  
      }
      this.onConfirm(iris)     
      this.resetForm()
    }

    private handleCancel = () => {
      this.onCancel()
      this.resetForm()
    }

    private addInputField = () => {
      let myform = this.shadowRoot?.querySelector('#new-element-form')
      let btn = myform?.querySelector('#more') as Node
      let label = document.createElement("label")
      label.innerHTML = '<br><label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>'
      label.className = "lab"
      let input = document.createElement("input")
      input.className = "inp"
      input.id = 'input'+myform?.getElementsByTagName('input').length
      input.style.width = '78%'
      input.style.margin = '8px 8px 8px 8px'
      myform?.removeChild(btn)
      myform?.appendChild(label)
      myform?.appendChild(input)
      myform?.appendChild(btn)
    }

    private resetForm = () => {
      let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
      if (myform){
        let labels = myform.getElementsByClassName('lab')
        Array.from(labels).forEach(element => {
          myform.removeChild(element)
        });
        let inputs = myform.getElementsByClassName('inp')
        Array.from(inputs).forEach(element => {
          myform.removeChild(element)
        });  
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
                <label style = "width: 95%; margin: 8px 8px 8px 8px ; display: ${this.withoutPrefix};" id="prefix-label" for="prefix">Prefix:</label><br>
                <select style = "width: 78%; margin: 8px 8px 8px 8px ; display: ${this.withoutPrefix};" id="prefix" name="prefix" required>
                    ${this.ontology.namespaces.map((n, i) => {
                      return html`<option value="${i}">${n.toString()}</option>`
                    })}
                </select><br>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>
                <input style = "width: 78%; margin: 8px 8px 8px 8px ;" type="text" id="input" name="input" value="" required>
                <gscape-button style = "border-radius: 50%; display: ${this.enableMore};" id ="more" label="+" @click=${this.addInputField}></gscape-button>
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