import { css, html, LitElement, PropertyDeclarations } from "lit";
import { BaseMixin, baseStyle, ModalMixin, icons } from "../../../ui";
import { Annotation, Ontology } from "../../../model";
import { ontologyAnnotationsTemplate } from "./ontology-annotations-template";
import { ontologyNamespacesTemplate } from "./ontology-namespaces-template";

export default class OntologyManager extends ModalMixin(BaseMixin(LitElement)) {

  public initEditAnnotation: (annotation?: Annotation) => void = () => {}
  public deleteAnnotation: (annotation: Annotation) => void = () => {}
  public onCancel: () => void = () => { }

  static properties: PropertyDeclarations = {
    annotations: {type: Array},
    namespaces: {type: Array},
    annProperties: {type: Array}
  }

  constructor(public ontology: Ontology, public annotations?, public namespaces?, public annProperties?) {
    super()
  }
  static styles: any[] = [
    baseStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 30%;
        min-width: 300px;
        max-height: calc(90% - 100px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
      }

      table {
        border-spacing: 0;
      }

      th, td {
        padding: 2px;
      }

      td {
        padding-left: 8px;
      }

      th {
        text-align: left;
        border-right: solid 1px var(--gscape-color-border-subtle);
        padding-right: 8px;
      }
      
      table > caption {
        margin-top: 8px;
        font-weight: 600;
      }
    `
  ]

  private handleCancel = () => {
    this.onCancel()
  }

  private handleEditAnnotation = (annotation?) => {
    this.initEditAnnotation(annotation)
  }

  private handleDeleteAnnotation = (annotation) => {
    this.deleteAnnotation(annotation)
}

  private showOntologyAnnotationsTab() {
    return ontologyAnnotationsTemplate(this.ontology.getAnnotations(), this.handleEditAnnotation, this.handleDeleteAnnotation)
  }

  private showOntologyNamespacesTab() {
    return ontologyNamespacesTemplate(this.ontology.namespaces)
  }

  private showOntologyAnnotationPropertiesTab() {}

  render() {
    return html`
      <div class="gscape-panel">
        ${this.showOntologyAnnotationsTab()}
        <div class="buttons" style="display: flex; justify-content: center; align-items: center;" id="buttons">
          <gscape-button size='s' id="ok" label="Ok" @click=${this.handleCancel}></gscape-button>
        </div>
      </div>
    `
  }
}

customElements.define('ontology-manger', OntologyManager)