import { css, CSSResultGroup, html, HTMLTemplateResult, LitElement, PropertyDeclarations } from "lit";
import { BaseMixin, baseStyle, ModalMixin, icons, SizeEnum, TabProps } from "../../../ui";
import { Annotation, Namespace } from "../../../model";
import { namespacesTemplate, namespacesTemplateStyle } from "../namespaces/namespaces-template";
import { annotationsTemplate, annotationsTemplateStyle } from "../annotations";
import modalSharedStyles from "../modal-shared-styles";
import AnnotationProperty from "../../../model/annotation-property";
import { propertiesTemplate } from "../annotation-properties/ann-properties-template";

type TabInfo = TabProps & {
  getContent: () => HTMLTemplateResult | HTMLElement,
  onAdd: () => void,
}

export default class OntologyManager extends ModalMixin(BaseMixin(LitElement)) {

  public onEditAnnotation: (annotation?: Annotation) => void = () => { }
  public onDeleteAnnotation: (annotation: Annotation) => void = () => { }
  public onEditNamespace: (namespace?: Namespace, prefix?: string) => void = () => { }
  public onDeleteNamespace: (namespace: Namespace, prefix: string) => void = () => { }
  public onEditProperty: (annProperty?: AnnotationProperty) => void = () => { }
  public onDeleteProperty: (annProperty: AnnotationProperty) => void = () => { }
  public onCancel: () => void = () => { }

  static properties: PropertyDeclarations = {
    annotations: { type: Array },
    namespaces: { type: Array },
    annProperties: { type: Array },
    currentTab: { type: Object },
  }

  constructor(public annotations: Annotation[] = [], public namespaces: Namespace[] = [], public annProperties: AnnotationProperty[] = []) {
    super()
  }

  static styles: CSSResultGroup = [
    baseStyle,
    modalSharedStyles,
    annotationsTemplateStyle,
    namespacesTemplateStyle,
    css`
      .content {
        background: var(--gscape-color-bg-inset);
        border: solid 1px var(--gscape-color-border-default);
        border-bottom-left-radius: var(--gscape-border-radius);
        border-bottom-right-radius: var(--gscape-border-radius);
        padding: 16px;
        min-height: 106px;
      }
    `
  ]

  private handleCancel = () => {
    this.onCancel()
    this.remove()
  }

  private handleTabChange(e: CustomEvent<number>) {
    this.currentTab = this.tabs[e.detail]
  }

  private tabs: TabInfo[] = [
    {
      id: 0,
      label: 'Ontology Annotations',
      icon: icons.info_outline,
      getContent: () => annotationsTemplate(this.annotations, this.onEditAnnotation, this.onDeleteAnnotation),
      onAdd: () => this.onEditAnnotation()
    },
    {
      id: 1,
      label: 'Annotation Properties',
      icon: icons.notes,
      getContent: () => propertiesTemplate(this.annProperties, this.onEditProperty, this.onDeleteProperty),
      onAdd: () => this.onEditProperty() // Define new annotation property
    },
    {
      id: 2,
      label: 'Namespaces',
      icon: icons.protocol,
      getContent: () => namespacesTemplate(this.namespaces, this.onEditNamespace, this.onDeleteNamespace),
      onAdd: () => this.onEditNamespace()
    }
  ]

  private currentTab: TabInfo = this.tabs[0]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div class="header">
            <span class="slotted-icon">${icons.tools}</span>
            <span>Ontology Manager</span>
          </div>
          <gscape-button size=${SizeEnum.S} type="subtle" style="margin-left: auto" @click=${this.handleCancel}>
            <span slot="icon">${icons.close}</span>
          </gscape-button>
        </div>
      
        <div>
          <gscape-tabs .tabs=${this.tabs} @change=${this.handleTabChange}></gscape-tabs>
          <div class="modal-body content">${this.currentTab.getContent()}</div>
        </div>
      
        <div class="bottom-buttons">
          <gscape-button 
            type="primary"
            id="more"
            title="Add ${this.currentTab.label}"
            label="Add"
            @click=${this.currentTab.onAdd}
          >
            <span slot="icon">${icons.plus}</span>
          </gscape-button>
        </div>
      </div>
    `
  }
}

customElements.define('ontology-manger', OntologyManager)