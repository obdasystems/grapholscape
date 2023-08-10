import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { Annotation } from "../../model";
import * as UI from '../../ui'

const {
  ModalMixin, BaseMixin,
  icons,
  baseStyle,
} = UI

export default class GscapeAnnotationsModal extends ModalMixin(BaseMixin(LitElement)) {

    public onCancel: () => void = () => { }
    public deleteAnnotation: (annotation: Annotation) => void = () => {}
    public initEditAnnotation: (annotation?: Annotation) => void = () => {}

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

    private handleDeleteAnnotation = (annotation) => {
        this.deleteAnnotation(annotation)
    }

    private handleEditAnnotation = (annotation?) => {
        this.initEditAnnotation(annotation)
    }

    render() {
        return html`
            <div>          
                <div class="gscape-panel">
                    <div class="header" style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between; align-items: center;">
                        <span class="slotted-icon">${icons.entityIcons[this.entityType]}${this.dialogTitle}</span>
                        <gscape-button style = "border-radius: 50%;" size='s' id ="more" label="+" @click=${() => this.handleEditAnnotation()}></gscape-button>
                    </div>
                    <div class=area style="min-height: 200px;">
                        ${this.annotations.map((a, i) => {
                            return html`<div style="margin: 8px 8px 8px 8px; display:flex; justify-content:space-between;" id=ann${i}>
                                            <div class=annotation-row style="margin: 8px 8px 8px 8px;">
                                                <b>${a.kind.charAt(0).toUpperCase() + a.kind.slice(1)}</b> 
                                                <span class="language muted-text bold-text"> @${a.language} </span>
                                                <span> ${a.lexicalForm} </span>
                                            </div>    
                                            <div>
                                                <gscape-button style = "border-radius: 50%;" size='s' id ="editAnnotation" @click=${() => this.handleEditAnnotation(a)}><span slot="icon">${icons.editIcon}</span></gscape-button>
                                                <gscape-button style = "border-radius: 50%;" size='s' id ="deleteAnnotation" @click=${() => this.handleDeleteAnnotation(a)}><span slot="icon">${icons.rubbishBin}</span></gscape-button>
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