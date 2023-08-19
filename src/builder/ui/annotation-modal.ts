import { CSSResultGroup, LitElement, PropertyDeclarations, css, html } from "lit";
import { Annotation, AnnotationProperty } from "../../model";
import { datatypes } from "./new-element-modal";
import * as UI from '../../ui'
import { OntologyViewModel } from "../../ui/ontology-info/ontology-info";
import { Language } from "../../config";

const {
    ModalMixin, BaseMixin,
    icons,
    baseStyle,
} = UI

export default class GscapeAnnotationModal extends ModalMixin(BaseMixin(LitElement)) {
    
    ontology: OntologyViewModel

    public onConfirm: (annotation: Annotation | undefined, property: string, lexicalForm: string, datatype: string, language: string) => void = () => { }
    public onCancel: () => void = () => { }

    static properties: PropertyDeclarations = {
        annotation: {type: Annotation}
      }

    constructor(public annotation?: Annotation) {
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
        let myform = this.shadowRoot?.querySelector('#new-annotation-form') as HTMLFormElement
        if(myform){
            const propertyInput = this.shadowRoot?.querySelector('#newproperty') as HTMLInputElement
            const lexicalFormInput = this.shadowRoot?.querySelector('#lexicalform') as HTMLTextAreaElement
            const datatypeInput = this.shadowRoot?.querySelector('#datatype') as HTMLSelectElement
            const languageInput = this.shadowRoot?.querySelector('#newlan') as HTMLInputElement
            this.onConfirm(this.annotation, propertyInput.value, lexicalFormInput.value, datatypeInput.value, languageInput.value)
            this.resetForm()
        }

    }

    private handleCancel = () => {
        this.onCancel()
        this.resetForm()
        this.remove()
    }

    private resetForm = ()=> {
        let myform = this.shadowRoot?.querySelector('#new-annotation-form') as HTMLFormElement
        this.annotation = undefined
        if(myform){
            myform.reset()
        }
        this.shadowRoot?.querySelector('#ok')?.setAttribute('disabled', 'true')
    }

    render() {
        return html`
            <div>          
                <div class="gscape-panel">
                    <div class="header">
                    Edit Annotation
                    </div>
                    <form id= "new-annotation-form" action= "javascript:void(0);" onkeyup="if (event.keyCode === 13 && !this.offsetParent.querySelector('#ok').disabled) this.offsetParent.querySelector('#ok').click();">
                        <label style = "width: 95%; margin: 8px 8px 8px 8px ;" id="property-label" for="property"><b>Property:</b></label><br>
                        <div class="dropdown">
                            <input id="newproperty" value="${this.annotation?.property}" type="text" oninput="if(this.value.length > 0 && this.offsetParent.offsetParent.querySelector('#lexicalform').value.length > 0) {this.offsetParent.offsetParent.querySelector('#ok').disabled = false;} else {this.offsetParent.offsetParent.querySelector('#ok').disabled = true;}"/>
                            <select 
                              id="property" onchange="this.offsetParent.querySelector('#newproperty').value=this.value; this.offsetParent.querySelector('#newproperty').focus(); if(this.offsetParent.offsetParent.querySelector('#lexicalform').value.length > 0){this.offsetParent.offsetParent.querySelector('#ok').disabled = false;} " name="property" value="${this.annotation?.property}" required>
                                ${Object.values(AnnotationProperty).sort().map((property, i) => {
                                  return html`
                                    <option 
                                      value="${property.fullIri}"; 
                                      ?selected=${this.annotation && property.equals(this.annotation.property)}
                                    >
                                      ${property.prefixed}
                                    </option>
                                  `
                                })}
                                <option value=""></option>
                            </select>
                        </div>
                        <label style = "width: 95%; margin: 8px 8px 8px 8px ;" id="lexicalform-label" for="lexicalform"><b>Lexical Form:</b></label><br>
                        <textarea class="area" style="width: 78%; margin: 8px 8px 8px 8px ;resize: none;" id = "lexicalform" rows="4" cols="40" oninput="if(this.value.length > 0 && this.offsetParent.querySelector('#newproperty').value.length > 0) {this.offsetParent.querySelector('#ok').disabled = false;} else {this.offsetParent.querySelector('#ok').disabled = true;}"> ${this.annotation?.lexicalForm} </textarea>
                        <label style = "width: 95%; margin: 8px 8px 8px 8px ;" id="datatype-label" for="datatype"><b>Datatype:</b></label><br>
                        <select style = "width: 78%; margin: 8px 8px 8px 8px ;" id="datatype" name="datatype" onchange="if(this.offsetParent.querySelector('#lexicalform').value.length > 0){this.offsetParent.querySelector('#ok').disabled = false;}" required>
                            ${datatypes.sort().map((n, i) => {
                            if(this.annotation && n.toString()===this.annotation.datatype){
                                return html`<option value="${n.toString()}"; selected>${n.toString()}</option>`
                            } else{
                                return html`<option value="${n.toString()}"; >${n.toString()}</option>`
                            }
                            })}
                            <option value=""></option>
                        </select>
                        <label style = "width: 95%; margin: 8px 8px 8px 8px ;" id="language-label" for="language"><b>Language:</b></label>
                        <div class="dropdown" style = "width: 30%; margin: 8px 8px 8px 8px ;">
                            <input id="newlan" value="${this.annotation?.language}" type="text"/>
                            <select id="language" onchange="this.offsetParent.querySelector('#newlan').value=this.value; this.offsetParent.querySelector('#newlan').focus(); if(this.offsetParent.offsetParent.querySelector('#lexicalform').value.length > 0){this.offsetParent.offsetParent.querySelector('#ok').disabled = false;} "name="language" required>
                                ${Object.values(Language).sort().map((n, i) => {
                                if(this.annotation && n.toString()===this.annotation.language){
                                    return html`<option value="${n.toString()}"; selected>${n.toString()}</option>`
                                } else{
                                    return html`<option value="${n.toString()}"; >${n.toString()}</option>`
                                }
                
                                })}
                                <option value=""></option>
                            </select>
                        </div>
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
    
    customElements.define('gscape-annotation', GscapeAnnotationModal)