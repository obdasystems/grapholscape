import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { BaseMixin, ModalMixin } from "../common/mixins";
import { baseStyle } from "..";
import { entityIcons, editIcon, rubbishBin } from "../assets";
import { Annotation } from "../../model";

export default class GscapeAnnotationsModal extends ModalMixin(BaseMixin(LitElement)) {

    public onCancel: () => void = () => { }
    public deleteAnnotation: (annotation: Annotation) => void = () => {}


    static properties: PropertyDeclarations = {
        dialogTitle: { type: String },
        entityType: { type: String },
        annotations: {type: Array}
      }
    
    constructor(public dialogTitle?, public entityType?, public annotations?) {
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

    private handleCancel = () => {
        this.onCancel()
    }

    private handleDeleteAnnotation = (annotation, divId) => {
        this.deleteAnnotation(annotation)
        const divToRemove = this.shadowRoot?.querySelector('#ann'+divId)
        if(divToRemove){
            divToRemove.remove()
        }
    }

    render() {
        return html`
            <div>          
                <div class="gscape-panel">
                    <div class="header">
                        <span class="slotted-icon">${entityIcons[this.entityType]}</span> ${this.dialogTitle}
                    </div>
                    <div class=area>
                        ${this.annotations.map((a, i) => {
                            return html`<div style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between;" id=ann${i}>
                                            <div class=annotation-row style="margin: 8px 8px 8px 8px;">
                                                <b>${a.property}</b> 
                                                <span class="language muted-text bold-text"> @${a.language} </span>
                                                <span> ${a.lexicalForm} </span>
                                            </div>    
                                            <div>
                                                <gscape-button style = "border-radius: 50%;" size='s' id ="editAnnotation"><span slot="icon">${editIcon}</span></gscape-button>
                                                <gscape-button style = "border-radius: 50%;" size='s' id ="deleteAnnotation" @click=${() => this.handleDeleteAnnotation(a, i)}><span slot="icon">${rubbishBin}</span></gscape-button>
                                            </div>
                                        </div>`
                        })}
                    </div>
                    <div class="buttons" style="display: flex; justify-content: center; align-items: center;" id="buttons">
                        <gscape-button size='s' id="ok" label="Ok" @click=${this.handleCancel}></gscape-button>
                    </div>
                </div>
            </div>
            `
    }
}

customElements.define('gscape-annotations', GscapeAnnotationsModal)