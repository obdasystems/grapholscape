import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { BaseMixin, ModalMixin } from '../common/mixins'
import { OntologyViewModel } from '../ontology-info/ontology-info'
import baseStyle from '../style'
import { GscapeButton } from '../common/button'

export const datatypes = ['owl:real', 'owl:rational', 'xsd:decimal', 'xsd:integer',
'xsd:nonNegativeInteger', 'xsd:nonPositiveInteger',
'xsd:positiveInteger', 'xsd:negativeInteger', 'xsd:long',
'xsd:int', 'xsd:short', 'xsd:byte', 'xsd:unsignedLong',
'xsd:unsignedInt', 'xsd:unsignedShort', 'xsd:unsignedByte',
'xsd:double', 'xsd:float', 'xsd:string',
'xsd:normalizedString', 'xsd:token', 'xsd:language', 'xsd:Name',
'xsd:NCName', 'xsd:NMTOKEN', 'xsd:boolean', 'xsd:hexBinary',
'xsd:base64Binary',
'xsd:dateTime', 'xsd:dateTimeStamp', 'rdf:XMLLiteral',
'rdf:PlainLiteral', 'rdfs:Literal', 'xsd:anyURI']

export default class GscapeNewElementModal extends ModalMixin(BaseMixin(LitElement)) {

  ontology: OntologyViewModel
  public get modal(): HTMLElement | undefined | null { return this.shadowRoot?.querySelector('.gscape-panel') }

  public onConfirm: (iri: string[], functionalities: string[], complete: boolean, datatype: string) => void = () => { }
  public onCancel: () => void = () => { }

  static properties: PropertyDeclarations = {
    dialogTitle: { type: String },
    withoutPrefix: { type: String },
    enableMore: { type: String },
    functionalities: { type: Array },
    funcVisibility: {type: String} 
  }
  funcVisibility: 'inline-block' | 'none' = 'none'

  constructor(public message?: string, public dialogTitle?, public withoutPrefix?, public enableMore?, public functionalities?) {
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
    let iri = this.withoutPrefix === 'none' ? input.value : prefix.options[prefix.selectedIndex].text + input.value
    let iris = [iri]
    let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
    if (this.enableMore) {
      let inputs = myform.getElementsByClassName('inp')
      Array.from(inputs).forEach(element => {
        let input = element as HTMLInputElement
        if(input.value.length > 0)
          iris.push(prefix.options[prefix.selectedIndex].text + input.value)
      });
    }
    let datatype = this.shadowRoot?.querySelector('#datatype') as HTMLSelectElement
    let datatypeValue = datatype.options[datatype.selectedIndex].text
    let settedFunctionalities : string[] = []
    let functional = myform.querySelector('#functional') as HTMLInputElement
    if(functional.checked)
      settedFunctionalities.push('functional')
    let funcCheckboxes = myform.querySelectorAll('#fCheckbox')
    funcCheckboxes.forEach(i =>{
      let checkbox = i as HTMLInputElement
      if(checkbox.checked){
        settedFunctionalities.push(checkbox.value)
      }
    })
    let complete = myform.querySelector('#complete') as HTMLInputElement
    this.onConfirm(iris, settedFunctionalities, complete.checked, datatypeValue)
    this.resetForm()
  }

  private handleCancel = () => {
    this.onCancel()
    this.resetForm()
  }

  private addInputField = () => {
    let myform = this.shadowRoot?.querySelector('#new-element-form')
    let btn = myform?.querySelector('#more') as Node
    let checkbox = myform?.querySelector('#completeL') as Node
    let label = document.createElement("label")
    label.innerHTML = '<br><label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>'
    label.className = "lab"
    let input = document.createElement("input")
    input.className = "inp"
    input.id = 'input' + myform?.getElementsByTagName('input').length
    input.style.width = '78%'
    input.style.margin = '8px 8px 8px 8px'
    myform?.removeChild(btn)
    myform?.removeChild(checkbox)
    myform?.appendChild(label)
    myform?.appendChild(input)
    myform?.appendChild(btn)
    myform?.appendChild(checkbox)
  }

  private resetForm = () => {
    let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
    if (myform) {
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
    this.funcVisibility = 'none'
  }

  private showFunctionalCheckbox = () => {
    if (this.functionalities.length === 1) {
      return 'inline-block'
    } else {
      return 'none'
    }
  }

  private showFunctionalitiesDropdown = () => {
    if (this.functionalities.length > 1) {
      return 'inline-block'
    } else {
      return 'none'
    }
  }

  private toggleFunctionalities = () => {

    this.funcVisibility = this.funcVisibility === 'inline-block' ? 'none' : 'inline-block'
    let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
    if (myform) {
      let funcButton = myform.querySelector('#addFunctionalities') as GscapeButton
      if(funcButton.label)
        funcButton.label = funcButton.label === 'Add properties +' ? 'Hide properties -' : 'Add properties +'
    }
   
  }

  render() {
    return html`
        <div>          
          <div class="gscape-panel">
            <div class="header">
            ${this.dialogTitle}
            </div>
            <form id= "new-element-form" action= "javascript:void(0);" onkeyup="if (event.keyCode === 13 && !this.offsetParent.querySelector('#ok').disabled) this.offsetParent.querySelector('#ok').click();">
                <label style = "width: 95%; margin: 8px 8px 8px 8px ; display: ${this.withoutPrefix};" id="prefix-label" for="prefix">Prefix:</label><br>
                <select style = "width: 78%; margin: 8px 8px 8px 8px ; display: ${this.withoutPrefix};" id="prefix" name="prefix" required>
                    ${this.ontology.namespaces.map((n, i) => {
      return html`<option value="${i}">${n.toString()}</option>`
    })}
                </select><br>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>
                <input style = "width: 78%; margin: 8px 8px 8px 8px ;" type="text" id="input" oninput="if(this.value.length > 0) this.offsetParent.querySelector('#ok').disabled = false; else this.offsetParent.querySelector('#ok').disabled = true;" name="input" value="" required>
                <gscape-button style = "border-radius: 50%; display: ${this.enableMore};" id ="more" label="+" @click=${this.addInputField}></gscape-button>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ; display: ${this.showFunctionalCheckbox()};" id="datatype-label" for="datatype">Datatype:</label>
                <select style = "width: 78%; margin: 8px 8px 8px 8px ; display: ${this.showFunctionalCheckbox()};" id="datatype" name="datatype" required>
                    ${datatypes.sort().map((n, i) => {
      return html`<option value="${n.toString()}">${n.toString()}</option>`
    })}
                </select>
                <label class="container" style = "display: ${this.showFunctionalCheckbox()}; margin: 8px 8px 8px 8px ;"><input type="checkbox" id="functional"> functional</label>
                <label class="container" style = "display: ${this.enableMore}; margin: 8px 8px 8px 8px ;" id="completeL"><input type="checkbox" id="complete"> Complete</label>
                <gscape-button style = "margin: 8px 8px 8px 8px ; border-radius: 50%; display: ${this.showFunctionalitiesDropdown()};" id ="addFunctionalities" label="Add properties +" @click=${this.toggleFunctionalities}></gscape-button>
                <ul class="dropdown-menu" style = "width: 68%; margin: 8px 18px 18px 8px ; border-radius: 5%; display: ${this.funcVisibility}; list-style-type: none; background-color: var(--gscape-color-neutral); " name="functionalities" >
                      ${this.functionalities.map((n, i) => {
        return html`<li style="width: 78%; margin: 2px 2px 2px 2px ; display: ${this.funcVisibility};" value="${n.toString()}" id = "functionalities"><input type="checkbox" value="${n.toString()}" id= "fCheckbox" /> ${n.toString()}</a></li><br>`
      })}</ul>
            </form>
            <div class="buttons" id="buttons">
                <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
                <gscape-button id="ok" label="Ok" @click=${this.handleConfirm} disabled></gscape-button>
            </div>
          </div>
        </div>
        `
  }
}

customElements.define('gscape-new-element', GscapeNewElementModal)