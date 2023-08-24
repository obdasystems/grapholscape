import { CSSResultGroup, LitElement, PropertyDeclarations, css, html } from "lit";
import { Annotation, DefaultAnnotationProperties, Iri } from "../../../model";
import { datatypes } from "../new-element-modal";
import * as UI from '../../../ui'
import { OntologyViewModel } from "../../../ui/ontology-info/ontology-info";
import { Language } from "../../../config";
import modalSharedStyles from "../modal-shared-styles";

const {
    ModalMixin, BaseMixin,
    icons,
    baseStyle,
} = UI

export default class GscapeAnnotationModal extends ModalMixin(BaseMixin(LitElement)) {
    
    ontology: OntologyViewModel
    private isValid: boolean = false


    public onConfirm: (annotation: Annotation | undefined, property: Iri | string, lexicalForm: string, datatype: string, language: string) => void = () => { }
    public onCancel: () => void = () => { }

    static properties: PropertyDeclarations = {
        annotation: {type: Annotation},
        isValid: { type: Boolean, state: true },
      }

    constructor(public annotation?: Annotation) {
        super()
    }

    static styles?: CSSResultGroup = [
        baseStyle,
        modalSharedStyles,
        css`
            textarea {
                width: 78%;
                margin: 8px;
                resize: none;
                color: inherit;
            }
        `
        ]

        private handlePropertySelection(e: Event) {
            const selectTarget = e.currentTarget as HTMLSelectElement
            if (selectTarget) {
                const propertyInput = this.shadowRoot?.querySelector('#newproperty') as HTMLInputElement
                const value = selectTarget.value
                propertyInput.value = value
                ? value
                : ''
                propertyInput.focus()
            }
    
            this.validate()
    
        }

        private handleLanguageSelection(e: Event) {
            const selectTarget = e.currentTarget as HTMLSelectElement
            if (selectTarget) {
                const languageInput = this.shadowRoot?.querySelector('#newlan') as HTMLInputElement
                const value = selectTarget.value
                languageInput.value = value
                ? value
                : ''
                languageInput.focus()
            }    

            this.validate()

        }

    private validate() {
        const propertyInput = this.shadowRoot?.querySelector('#newproperty') as HTMLInputElement
        const lexicalFormInput = this.shadowRoot?.querySelector('#lexicalform') as HTMLTextAreaElement
        if (propertyInput && lexicalFormInput) {
            this.isValid = propertyInput.value.length > 0 && lexicalFormInput.value.length > 0
        }
    }
    
    private handleConfirm = () => {
        let myform = this.shadowRoot?.querySelector('#new-annotation-form') as HTMLFormElement
        if(myform){
            const propertyInput = this.shadowRoot?.querySelector('#newproperty') as HTMLInputElement
            const lexicalFormInput = this.shadowRoot?.querySelector('#lexicalform') as HTMLTextAreaElement
            const datatypeInput = this.shadowRoot?.querySelector('#datatype') as HTMLSelectElement
            const languageInput = this.shadowRoot?.querySelector('#newlan') as HTMLInputElement

            const propertyIri = Object.values(DefaultAnnotationProperties).find(ap => ap.equals(propertyInput.value)) || propertyInput.value
            this.onConfirm(this.annotation, propertyIri, lexicalFormInput.value, datatypeInput.value, languageInput.value)
            this.resetForm()
        }
        this.remove()
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
                            <input 
                                id="newproperty" 
                                value="${this.annotation?.property}" 
                                type="text"
                                @input=${this.validate}/>
                            <select 
                              id="property" 
                              @change=${this.handlePropertySelection}                              
                              name="property" 
                              value="${this.annotation?.property}" required>
                                ${Object.values(DefaultAnnotationProperties).sort().map((property, i) => {
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
                        <textarea 
                            class="area"
                            id = "lexicalform" 
                            rows="4" 
                            cols="40" 
                            @input=${this.validate}
                            >${this.annotation?.lexicalForm}</textarea>
                        <label style = "width: 95%; margin: 8px 8px 8px 8px ;" id="datatype-label" for="datatype"><b>Datatype:</b></label><br>
                        <select style = "width: 78%; margin: 8px 8px 8px 8px ;" id="datatype" name="datatype" @change=${this.validate} required>
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
                            <select 
                                id="language" 
                                @change=${this.handleLanguageSelection}  
                                name="language" required>
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
                        <gscape-button id="ok" label="Ok" @click=${this.handleConfirm} ?disabled=${!this.isValid}></gscape-button>
                    </div>
                </div>
            </div>
            `
    }
}
    
    customElements.define('gscape-annotation', GscapeAnnotationModal)