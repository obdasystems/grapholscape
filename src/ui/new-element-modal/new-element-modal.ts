import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { BaseMixin, ModalMixin } from '../common/mixins'
import { OntologyViewModel } from '../ontology-info/ontology-info'
import baseStyle from '../style'
import { GscapeButton } from '../common/button'
import { FunctionalityEnum, GrapholEntity } from '../../model'

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
  public onRefactor: (iri: string[]) => void = () => { }
  public checkNamespace: (namespace: string) => void = () => {}

  static properties: PropertyDeclarations = {
    dialogTitle: { type: String },
    withoutNamespace: { type: String },
    enableMore: { type: String },
    functionalities: { type: Array },
    funcVisibility: {type: String} 
  }
  funcVisibility: 'inline-block' | 'none' = 'none'

  constructor(public message?: string, public dialogTitle?, public withoutNamespace?, public enableMore?, public functionalities?, public entity?: GrapholEntity) {
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

          .dropdown {
            position: relative;
            width: 78%; 
            margin: 8px 8px 8px 8px ;
            border: solid 1px var(--gscape-color-border-subtle);
            border-radius: var(--gscape-border-radius);
          }
          
          .dropdown select {
            width: 100%;
          }
          
          .dropdown > * {
            box-sizing: border-box;
            height: 100%;
            border: none;
          }
          
          .dropdown input {
            position: absolute;
            width: calc(100% - 18px);
          }

          .dropdown select:focus, .dropdown input:focus {
            border-color: inherit;
            -webkit-box-shadow: none;
            box-shadow: none;
          }
        `
  ]

  private handleConfirm = () => {
    let namespace = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
    let input = this.shadowRoot?.querySelector('#input') as HTMLInputElement
    if(namespace && namespace.value.length > 0)
      this.checkNamespace(namespace.value)
    let iri = this.withoutNamespace === 'none' ? input.value : namespace.value + input.value
    let iris = [iri]
    let myform = this.shadowRoot?.querySelector('#new-element-form') as HTMLFormElement
    if (this.enableMore) {
      let inputs = myform.getElementsByClassName('inp')
      Array.from(inputs).forEach(element => {
        let input = element as HTMLInputElement
        if(input.value.length > 0)
          iris.push(namespace.value + input.value)
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

  private handleRefactor = () => {
    let namespace = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
    let input = this.shadowRoot?.querySelector('#input') as HTMLInputElement
    if(namespace && namespace.value.length > 0)
      this.checkNamespace(namespace.value)
    let iri = this.withoutNamespace === 'none' ? input.value : namespace.value + input.value
    let iris = [iri]
    this.onRefactor(iris)
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
    this.entity = undefined
    if (myform) {
      let namespace = myform.querySelector('#namespace') as HTMLSelectElement
      if(namespace){
        namespace.selectedIndex = namespace.options.length
      }
      let labels = myform.getElementsByClassName('lab')
      Array.from(labels).forEach(element => {
        myform.removeChild(element)
      });
      let inputs = myform.getElementsByClassName('inp')
      Array.from(inputs).forEach(element => {
        myform.removeChild(element)
      });
      let properties = myform.querySelector('#addFunctionalities') as GscapeButton
      if(properties){
        properties.label = 'Add properties +'
      }
      myform.reset()
    }
    this.funcVisibility = 'none'
    this.shadowRoot?.querySelector('#ok')?.setAttribute('disabled', 'true')
    this.shadowRoot?.querySelector('#refactor')?.setAttribute('disabled', 'true')
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
                <label style = "width: 95%; margin: 8px 8px 8px 8px ; display: ${this.withoutNamespace};" id="namespace-label" for="namespace">Namespace:</label><br>
                <div class="dropdown" style = "display:${this.withoutNamespace==='inline'?'block':'none'};">
                <input id="newnamespace" value="${this.entity? this.entity.iri.namespace : ''}" type="text"/>
                <select style = "display: ${this.withoutNamespace};" id="namespace" onchange="this.offsetParent.querySelector('#newnamespace').value=this.value; this.offsetParent.querySelector('#newnamespace').focus(); if(this.offsetParent.offsetParent.querySelector('#input').value.length > 0){this.offsetParent.offsetParent.querySelector('#ok').disabled = false; this.offsetParent.offsetParent.querySelector('#refactor').disabled = false;} " name="namespace" value="${this.entity? this.entity.iri.namespace :''}" required>
                    ${this.ontology.namespaces.map((n, i) => {
                      if(this.entity && n.toString()===this.entity.iri.namespace?.toString()){
                        return html`<option value="${n.toString()}"; selected>${n.toString()}</option>`
                      }else{
                        return html`<option value="${n.toString()}">${n.toString()}</option>`
                      }
      
    })}
                <option value=""></option>
                </select>
                </div>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ;" for="input">Input:</label><br>
                <input style = "width: 78%; margin: 8px 8px 8px 8px ;" type="text" id="input" oninput="if(this.value.length > 0) {this.offsetParent.querySelector('#ok').disabled = false; this.offsetParent.querySelector('#refactor').disabled = false;} else {this.offsetParent.querySelector('#ok').disabled = true; this.offsetParent.querySelector('#refactor').disabled = true;}" name="input" value="${this.entity? this.entity.iri.remainder:''}" required>
                <gscape-button style = "border-radius: 50%; display: ${this.enableMore};" id ="more" label="+" @click=${this.addInputField}></gscape-button>
                <label style = "width: 95%; margin: 8px 8px 8px 8px ; display: ${this.showFunctionalCheckbox()};" id="datatype-label" for="datatype">Datatype:</label>
                <select style = "width: 78%; margin: 8px 8px 8px 8px ; display: ${this.showFunctionalCheckbox()};" id="datatype" name="datatype" required>
                    ${datatypes.sort().map((n, i) => {
                      if(this.entity && n.toString()===this.entity.datatype){
                        return html`<option value="${n.toString()}"; selected>${n.toString()}</option>`
                      } else{
                        return html`<option value="${n.toString()}"; >${n.toString()}</option>`
                      }
      
    })}
                </select>
                <label class="container" style = "display: ${this.showFunctionalCheckbox()}; margin: 8px 8px 8px 8px ;"><input type="checkbox" id="functional" ?checked=${this.entity?.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL)}> functional</label>
                <label class="container" style = "display: ${this.enableMore}; margin: 8px 8px 8px 8px ;" id="completeL"><input type="checkbox" id="complete"> Complete</label>
                <gscape-button style = "margin: 8px 8px 8px 8px ; border-radius: 50%; display: ${this.showFunctionalitiesDropdown()};" id ="addFunctionalities" label="Add properties +" @click=${this.toggleFunctionalities}></gscape-button>
                <ul class="dropdown-menu" style = "width: 68%; margin: 8px 18px 18px 8px ; border-radius: 5%; display: ${this.funcVisibility}; list-style-type: none; background-color: var(--gscape-color-neutral); " name="functionalities" >
                      ${this.functionalities.map((n, i) => {
                        if(this.entity && this.entity.functionProperties.includes(n.toString())){
                          return html`<li style="width: 78%; margin: 2px 2px 2px 2px ; display: ${this.funcVisibility};" value="${n.toString()}" id = "functionalities"><input type="checkbox" value="${n.toString()}" id= "fCheckbox" checked/> ${n.toString()}</a></li><br>`
                        }
                        else {
                          return html`<li style="width: 78%; margin: 2px 2px 2px 2px ; display: ${this.funcVisibility};" value="${n.toString()}" id = "functionalities"><input type="checkbox" value="${n.toString()}" id= "fCheckbox" /> ${n.toString()}</a></li><br>`
                        }
      })}</ul>
            </form>
            <div class="buttons" id="buttons">
                <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
                <gscape-button id="ok" label="${this.entity? 'Rename' : 'Ok'}" @click=${this.handleConfirm} disabled></gscape-button>
                <gscape-button id="refactor" style = "display: ${this.entity? 'inline-block' : 'none'};" label="Refactor" @click=${this.handleRefactor} disabled></gscape-button>
            </div>
          </div>
        </div>
        `
  }
}

customElements.define('gscape-new-element', GscapeNewElementModal)