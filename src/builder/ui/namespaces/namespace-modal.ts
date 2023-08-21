import { CSSResultGroup, LitElement, PropertyDeclarations, css, html } from "lit"
import * as UI from '../../../ui'
import { OntologyViewModel } from "../../../ui/ontology-info/ontology-info"
import { Iri, Namespace } from "../../../model"
import modalSharedStyles from "../modal-shared-styles"


const {
    ModalMixin, BaseMixin,
    icons,
    baseStyle,
} = UI

export default class GscapeNamespaceModal extends ModalMixin(BaseMixin(LitElement)) {
    
    ontology: OntologyViewModel

    public onConfirm: (namespace: Namespace | undefined, prefix: string | undefined, newnamespace: string, newprefix: string) => void = () => { }
    public onCancel: () => void = () => { }

    static properties: PropertyDeclarations = {
        namespace: {type: Namespace},
        prefixx: {type: String}
      }

    constructor(public namespace?: Namespace, public prefixx?: string ) {
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
        let myform = this.shadowRoot?.querySelector('#new-namespace-form') as HTMLFormElement
        if(myform){
            const prefixInput = this.shadowRoot?.querySelector('#prefix') as HTMLInputElement
            const namespaceInput = this.shadowRoot?.querySelector('#namespace') as HTMLInputElement

            this.onConfirm(this.namespace, this.prefixx,  namespaceInput.value, prefixInput.value)
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
        let myform = this.shadowRoot?.querySelector('#new-namespace-form') as HTMLFormElement
        this.namespace = undefined
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
                    Edit Namespace
                    </div>
                    <form id= "new-namespace-form" action= "javascript:void(0);" onkeyup="if (event.keyCode === 13 && !this.offsetParent.querySelector('#ok').disabled) this.offsetParent.querySelector('#ok').click();">
                        <label style = "width: 95%;" id="prefix-label" for="prefix"><b>Prefix:</b></label>
                        <input style = "width: 95%;" id="prefix" value="${this.prefixx}" type="text"/>
                        <label style = "width: 95%;" id="namespace-label" for="namespace"><b>Namespace:</b></label>
                        <input style = "width: 95%;" id="namespace" value="${this.namespace?.toString()}" type="text" oninput="if(this.value.length > 0 ) {this.offsetParent.querySelector('#ok').disabled = false;} else {this.offsetParent.querySelector('#ok').disabled = true;}"/>
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
    
    customElements.define('gscape-namespace', GscapeNamespaceModal)