
import { html, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import capitalizeFirstChar from "../../util/capitalize-first-char";
import { classInstanceIcon, entityIcons, objectPropertyIcon } from "../assets";
import GscapeEntitySearch from "../ontology-explorer/entity-search-component";
import { EntityViewData } from "../util/search-entities";
import GscapeContextMenu from "./context-menu";
import style from "./style";

export interface IIncrementalMenu {
  // callbacks
  onDataPropertyToggle: (enabled: boolean) => void
  onObjectPropertySelection: (iri: string, objectPropertyIri: string, direct: boolean) => void
  onShowSuperClasses: () => void
  onShowSubClasses: () => void
  onHideSuperClasses: () => void
  onHideSubClasses: () => void
  onRemove: (iri: string) => void
  onGetInstances: () => void
  onInstanceSelection: (iri: string) => void

  // populate the menu
  setObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  addObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  /** remove current instances and add the new ones */
  setInstances: (instances: EntityViewData[]) => void
  /** append new instances to the existing ones */
  addInstances: (instances: EntityViewData[]) => void
  
  dataPropertyEnabled: boolean
  areDataPropertiesPresent: boolean
  canShowInstances: boolean
  isInstanceCounterLoading: boolean
  instanceCount: number
}

export type ViewIncrementalObjectProperty = {
  objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  direct: boolean
}

export default class GscapeIncrementalMenu extends GscapeContextMenu implements IIncrementalMenu {
  private entitySearchComponent: GscapeEntitySearch

  objectProperties?: ViewIncrementalObjectProperty[]
  instances?: EntityViewData[]
  dataPropertyEnabled = false
  areDataPropertiesPresent = false
  canShowInstances = false
  isInstanceCounterLoading = true
  instanceCount: number

  onObjectPropertySelection = (iri: string, objectPropertyIri: string, direct: boolean) => { }
  onGetInstances = () => { }
  onInstanceSelection = (iri: string) => { }
  onDataPropertyToggle = (enabled: boolean) => { }
  onShowSuperClasses = () => { }
  onHideSuperClasses = () => { }

  onShowSubClasses = () => { }
  onHideSubClasses = () => { }

  onRemove = (iri: string) => { }

  constructor() {
    super()
    this.entitySearchComponent = new GscapeEntitySearch()
  }

  static properties: PropertyDeclarations = {
    objectProperties: { type: Object, attribute: false },
    instances: { type: Array, attribute: false },
    areDataPropertiesPresent: { type: Boolean, attribute: false },
    dataPropertyEnabled: { type: Boolean, attribute: false },
    showDataPropertyToggle: { type: Boolean, attribute: false },
    canShowInstances: { type: Boolean, attribute: false },
    isInstanceCounterLoading: { type: Boolean, attribute: false },
    instanceCount: { type: Number, attribute: false },
    onShowSuperClasses: { type: Object, attribute: false },
    onHideSuperClasses: { type: Object, attribute: false },
    onShowSubClasses: { type: Object, attribute: false },
    onHideSubClasses: { type: Object, attribute: false },
  }

  static styles = [
    ...super.styles,
    style
  ]

  render() {
    return html`
    <div class="gscape-panel">
      <div class="header">Menu</div>
      ${this.areDataPropertiesPresent
      ? html`
        <gscape-toggle class="actionable" label="Data Properties" ?checked=${this.dataPropertyEnabled}
          @click=${this.handleDataPropertyToggle}>
        </gscape-toggle>
      `
      : null
      }
    
    
      <gscape-button label="Show super-classes" @click=${this.onShowSuperClasses}></gscape-button>
      <gscape-button label="Hide super-classes" @click=${this.onHideSuperClasses}></gscape-button>

      <div class="hr"></div>
      
      <gscape-button label="Show sub-classes" @click=${this.onShowSubClasses}></gscape-button>
      <gscape-button label="Hide sub-classes" @click=${this.onHideSubClasses}></gscape-button>

      <div class="hr"></div>

      <gscape-button label="Remove" @click=${this.onRemove}></gscape-button>

      ${this.entitySearchComponent}
      
      ${this.canShowInstances
        ? html`
        <div>Instances</div>
        <details class="ellipsed entity-list-item" title="Instances">
          <summary class="actionable" @click=${this.handleShowInstances}>
            <span class="entity-type-icon">${classInstanceIcon}</span>
            <span class="entity-type-name">Instances</span>
            <span class="counter chip">
              ${this.isInstanceCounterLoading || this.instanceCount === undefined
                ? html`...`
                : this.instanceCount
              }
            </span>
          </summary>
      
          <div class="summary-body">
            ${this.instances?.map(instance => this.getEntitySuggestionTemplate(instance, GrapholTypesEnum.CLASS_INSTANCE))}
          </div>
        </details>
        `
        : null
      }
    
      ${this.objectProperties
      ? html`<div>Object Properties</div>`
      : null
      }
      ${this.objectProperties?.map((op) => {
      return html`
      <details class="ellipsed entity-list-item" title=${op.objectProperty.displayedName}>
        <summary class="actionable">
          <span class="entity-type-icon">${objectPropertyIcon}</span>
          <span class="entity-type-name">${op.objectProperty.displayedName}</span>
        </summary>
    
        <div class="summary-body" ?isDirect=${op.direct}>
          ${op.connectedClasses.map(classIri => this.getEntitySuggestionTemplate(classIri, GrapholTypesEnum.CLASS, op.objectProperty.value.iri.fullIri))}
        </div>
      </details>
      `
      })}
    
    </div>
    `
  }

  private handleShowInstances(evt: MouseEvent) {
    const target = (evt.target as HTMLElement)?.parentElement as HTMLDetailsElement
    if (!target.open && (!this.instances || this.instances.length === 0)) {
      this.onGetInstances()
    }
  }

  private getEntityTypeListWrapperTemplate(entityType: GrapholTypesEnum) {
    let entityIcon = entityIcons[entityType]
    let title = entityType.split('-').map(w => capitalizeFirstChar(w)).join(' ')

    return html`
      
    `
  }

  private getEntitySuggestionTemplate(entity: EntityViewData, entityType: GrapholTypesEnum,  objectPropertyIri?: string) {
    return html`
      <div title=${entity.displayedName} iri=${entity.value.iri.fullIri} entity-type="${entityType}" class="ellipsed entity-list-item actionable"
        @click=${(e: Event)=> this.handleEntityClick(e, objectPropertyIri)}
        >
        ${entity.displayedName}
      </div>
    `
  }

  private handleEntityClick(e: Event, objectPropertyIri?: string) {
    const target = e.target as HTMLElement
    const iri = target.getAttribute('iri')
    const direct = target.parentElement?.getAttribute('isDirect')
    if (!iri) return

    if (target.getAttribute('entity-type') === GrapholTypesEnum.CLASS_INSTANCE) {
      this.onInstanceSelection(iri)
    } else if (objectPropertyIri) {
      this.onObjectPropertySelection(iri, objectPropertyIri, direct !== null)
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


  setObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) { this.objectProperties = objectProperties }
  addObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) {
    this.objectProperties = (this.objectProperties || []).concat(objectProperties)
  }
  setInstances(instances: EntityViewData[]) {
    this.instances = instances
  }
  addInstances(instances: EntityViewData[]) {
    // concat avoiding duplicates
    this.instances = [...new Set([...(this.instances || []),...instances])]
  }
}

customElements.define('gscape-incremental-menu', GscapeIncrementalMenu)