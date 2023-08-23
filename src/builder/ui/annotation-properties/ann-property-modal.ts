import { CSSResultGroup, LitElement, PropertyDeclarations, css, html } from "lit"
import * as UI from '../../../ui'
import { OntologyViewModel } from "../../../ui/ontology-info/ontology-info"
import { Iri, Namespace } from "../../../model"
import modalSharedStyles from "../modal-shared-styles"
import AnnotationProperty from "../../../model/annotation-property"


const {
    ModalMixin, BaseMixin,
    icons,
    baseStyle,
} = UI

export default class GscapeAnnotationPropertyModal extends ModalMixin(BaseMixin(LitElement)) {
    
    ontology: OntologyViewModel

    public onConfirm: (annProperty: AnnotationProperty | undefined, newProperty: string) => void = () => { }
    public onCancel: () => void = () => { }

    static properties: PropertyDeclarations = {
        annProperty: {type: AnnotationProperty},
      }

    constructor(public annProperty?: AnnotationProperty) {
        super()
    }

    static styles?: CSSResultGroup = [
        baseStyle,
        modalSharedStyles,
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
                margin: 0px 8px 0px 8px ;
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

    private handleNamespaceSelection(e: Event) {
        const selectTarget = e.currentTarget as HTMLSelectElement
        if (selectTarget) {
            const namespaceInput = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
            const value = selectTarget.value
            namespaceInput.value = value
            ? value
            : ''
            namespaceInput.focus()
        }
    }

    private validate(e: Event) {
        const selectTarget = e.currentTarget as HTMLInputElement
        if (selectTarget) {
            const namespaceInput = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
            const value = this.shadowRoot?.querySelector('#input') as HTMLInputElement
            console.log(namespaceInput.value.length > 0 && value.value.length > 0)
            if( namespaceInput.value.length > 0 && value.value.length > 0){
                console.log(this.shadowRoot?.querySelector('#ok'))
                this.shadowRoot?.querySelector('#ok')?.setAttribute('disabled', 'false')
                this.requestUpdate()
            }

        }
    }
    
    private handleConfirm = () => {
        let myform = this.shadowRoot?.querySelector('#new-property-form') as HTMLFormElement
        if(myform){
            const namespaceInput = this.shadowRoot?.querySelector('#newnamespace') as HTMLInputElement
            const input = this.shadowRoot?.querySelector('#input') as HTMLInputElement

            this.onConfirm(this.annProperty, namespaceInput.value + input.value)
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
        let myform = this.shadowRoot?.querySelector('#new-property-form') as HTMLFormElement
        this.annProperty = undefined
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
                    Edit Annotation Property
                    </div>
                    <form id= "new-property-form" action= "javascript:void(0);" onkeyup="if (event.keyCode === 13 && !this.offsetParent.querySelector('#ok').disabled) this.offsetParent.querySelector('#ok').click();">
                        <label style= "width: 78%; margin: 0px 8px 0px 8px ;" id="namespace-label" for="newnamespace"><b>Namespace:</b></label>
                        <div class="dropdown">
                            <input
                                id="newnamespace"
                                value=${this.annProperty !== undefined ? this.annProperty.iri.namespace : ''}
                                type="text"
                            />
                            <select id="namespace" name="namespace" value=${this.annProperty?.iri.namespace?.toString()} @change=${this.handleNamespaceSelection} required>
                                ${this.ontology.namespaces?.map((n, i) => {
                                return html`<option value=${n.toString()} ?selected=${n.toString() === this.annProperty?.iri.namespace?.toString()}>${n.toString()}</option>`
                                })}
                                <option value="" ?selected=${this.annProperty === undefined}></option>
                            </select>
                        </div>
                        <label style= "width: 78%; margin: 0px 8px 0px 8px ;" for="input"><b>Input:</b></label>
                        <input
                            style= "width: 78%; margin: 0px 8px 0px 8px ;"
                            id="input"
                            type="text"
                            value= ${this.annProperty !== undefined ? this.annProperty.iri.remainder : ''}
                            oninput="if(this.value.length > 0 ) {this.offsetParent.querySelector('#ok').disabled = false;} else {this.offsetParent.querySelector('#ok').disabled = true;}"                            
                            required
                        />
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
    
    customElements.define('gscape-ann-property', GscapeAnnotationPropertyModal)