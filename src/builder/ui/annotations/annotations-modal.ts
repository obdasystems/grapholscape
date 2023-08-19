import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { Annotation, TypesEnum } from "../../../model";
import * as UI from '../../../ui'
import modalSharedStyles from "../modal-shared-styles";
import { annotationsTemplateStyle, annotationsTemplate } from "./annotations-template";

const {
  ModalMixin, BaseMixin,
  icons,
  baseStyle,
} = UI

export default class GscapeAnnotationsModal extends ModalMixin(BaseMixin(LitElement)) {

  public onCancel: () => void = () => { }
  public onDeleteAnnotation: (annotation: Annotation) => void = () => { }
  public onEditAnnotation: (annotation?: Annotation) => void = () => { }

  static properties: PropertyDeclarations = {
    dialogTitle: { type: String },
    entityType: { type: String },
    annotations: { type: Array }
  }

  constructor(public dialogTitle?: string, public entityType?: TypesEnum | 'ontology', public annotations: Annotation[] = []) {
    super()
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    modalSharedStyles,
    annotationsTemplateStyle,
    css`
    :host {
      position: absolute;
      }
    `
  ]

  private handleCancel = () => {
    this.onCancel()
    this.remove()
  }

  private handleDeleteAnnotation = (annotation) => {
    this.onDeleteAnnotation(annotation)
  }

  private handleEditAnnotation = (annotation?) => {
    this.onEditAnnotation(annotation)
  }

  private get headerIcon() {
    if (this.entityType === 'ontology') {
      return icons.notes
    } else if (this.entityType) {
      return icons.entityIcons[this.entityType]
    }
  }

  render() {
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div class="header">
            ${this.headerIcon ? html`<span class="slotted-icon">${this.headerIcon}</span>` : null}
            <span>${this.dialogTitle} - Annotations</span>
          </div>
          <gscape-button type="subtle" size='s' id="more" title="Close" @click=${this.handleCancel}>
            <span slot="icon">${icons.close}</span>
          </gscape-button>
        </div>

        <div class="modal-body">
          ${annotationsTemplate(this.annotations, this.handleEditAnnotation, this.handleDeleteAnnotation)}
        </div>

        <div class="bottom-buttons">
          <gscape-button type="primary" id="more" title="Add Annotation" label="Add" @click=${() => this.handleEditAnnotation()}>
            <span slot="icon">${icons.plus}</span>
          </gscape-button>
        </div>
      </div>
    `
  }
}

customElements.define('gscape-annotations', GscapeAnnotationsModal)