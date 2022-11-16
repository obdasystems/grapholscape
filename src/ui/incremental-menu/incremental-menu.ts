
import { css, CSSResultGroup, html, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import capitalizeFirstChar from "../../util/capitalize-first-char";
import { classIcon, classInstanceIcon, dataPropertyIcon, entityIcons, objectPropertyIcon } from "../assets";
import GscapeEntitySearch from "../ontology-explorer/entity-search-component";
import style from "./style";
import GscapeContextMenu from "./context-menu";

export default class GscapeIncrementalMenu extends GscapeContextMenu {
  private entitySearchComponent: GscapeEntitySearch

  objectProperties?: {
      objectPropertyIri: string,
      classesIris: string[],
  }[]
  instances?: string[]
  dataPropertyEnabled = false

  onEntitySelection = (iri: string, objectPropertyIri?: string) => { }
  onShowInstances = () => { }
  onInstanceSelection = (iri: string) => { }
  onDataPropertyToggle = (enabled: boolean) => { }

  constructor() {
    super()
    this.entitySearchComponent = new GscapeEntitySearch()
  }

  static properties: PropertyDeclarations = {
    objectProperties: { type: Object, attribute: false },
    instances: { type: Array, attribute: false },
    dataPropertyEnabled: { type: Boolean, attribute: false },
  }

  static styles = [
    ...super.styles,
    style
  ]

  render() {
    return html`
    <div class="gscape-panel">
      <div class="header">Menu</div>

      <gscape-toggle 
        class="actionable"
        label="Data Properties"
        ?checked=${this.dataPropertyEnabled}
        @click=${this.handleDataPropertyToggle}
      ></gscape-toggle>

      ${this.entitySearchComponent}

      <div>Instances</div>
      <details class="ellipsed entity-list-item" title="Instances">
        <summary class="actionable" @click=${this.onShowInstances}>
          <span class="entity-type-icon">${classInstanceIcon}</span>
          <span class="entity-type-name">Instances</span>
        </summary>
      
        <div class="summary-body">
          ${this.instances?.map(instance => this.getEntitySuggestionTemplate(instance, GrapholTypesEnum.CLASS_INSTANCE))}
        </div>
      </details>

      ${this.objectProperties
        ? html`<div>Object Properties</div>`
        : null
      }
      ${this.objectProperties?.map((op) => {
        return html`
          <details class="ellipsed entity-list-item" title=${op.objectPropertyIri}>
            <summary class="actionable">
              <span class="entity-type-icon">${objectPropertyIcon}</span>
              <span class="entity-type-name">${op.objectPropertyIri}</span>
            </summary>
          
            <div class="summary-body">
              ${op.classesIris.map(classIri => this.getEntitySuggestionTemplate(classIri, GrapholTypesEnum.CLASS, op.objectPropertyIri))}
            </div>
          </details>
        `
      })}
      
    </div>
    `
  }

  private getEntityTypeListWrapperTemplate(entityType: GrapholTypesEnum) {
    let entityIcon = entityIcons[entityType]
    let title = entityType.split('-').map(w => capitalizeFirstChar(w)).join(' ')

    return html`
      
    `
  }

  private getEntitySuggestionTemplate(entityIri: string, entityType: GrapholTypesEnum, objectPropertyIri?: string) {
    return html`
      <div
        title=${entityIri}
        iri=${entityIri}
        entity-type="${entityType}"
        class="ellipsed entity-list-item actionable"
        @click=${(e: Event) => this.handleEntityClick(e, objectPropertyIri)}
      >
        ${entityIri}
      </div>
    `
  }

  private handleEntityClick(e: Event, objectPropertyIri?: string) {
    const target = e.target as HTMLElement
    const iri = target.getAttribute('iri')

    if (target.getAttribute('entity-type') === GrapholTypesEnum.CLASS_INSTANCE) {
      this.onInstanceSelection(iri)
    } else {
      this.onEntitySelection(iri, objectPropertyIri)
    }
    
  }

  private handleDataPropertyToggle(evt: MouseEvent) {
    evt.preventDefault()
    this.dataPropertyEnabled = !this.dataPropertyEnabled
    this.onDataPropertyToggle(this.dataPropertyEnabled)
  }

  protected get cxtMenuProps() {
    let cxtMenuProps = super.cxtMenuProps
    cxtMenuProps.placement = 'right'
    return cxtMenuProps
  }
}

customElements.define('gscape-incremental-menu', GscapeIncrementalMenu)