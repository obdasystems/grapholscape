
import { html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../style";
import { GrapholTypesEnum } from "../../model";
import capitalizeFirstChar from "../../util/capitalize-first-char";
import { instancesIcon, entityIcons, objectPropertyIcon, superHierarchies } from "../assets";
import GscapeEntitySearch from "../ontology-explorer/entity-search-component";
import { EntityViewData } from "../util/search-entities";
import incrementalDetailsStyle from "./style";
import { entityListItemStyle } from "../ontology-explorer";
import { textSpinner, textSpinnerStyle } from "../common/spinners";

export interface IIncrementalDetails {
  // callbacks
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
  setDataProperties: (dataProperties: EntityViewData[]) => void
  addDataProperties: (dataProperties: EntityViewData[]) => void

  /** remove current instances and add the new ones */
  setInstances: (instances: EntityViewData[]) => void
  /** append new instances to the existing ones */
  addInstances: (instances: EntityViewData[]) => void

  canShowInstances: boolean
  isInstanceCounterLoading: boolean
  instanceCount: number
}

export type ViewIncrementalObjectProperty = {
  objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  direct: boolean
}

export default class GscapeIncrementalDetails extends LitElement implements IIncrementalDetails {
  private entitySearchComponent: GscapeEntitySearch

  private dataProperties?: EntityViewData[]
  private objectProperties?: ViewIncrementalObjectProperty[]
  private instances?: EntityViewData[]
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
    dataProperties: { type: Object, attribute: false },
    objectProperties: { type: Object, attribute: false },
    instances: { type: Array, attribute: false },
    showDataPropertyToggle: { type: Boolean, attribute: false },
    canShowInstances: { type: Boolean, attribute: false },
    isInstanceCounterLoading: { type: Boolean, attribute: false },
    instanceCount: { type: Number, attribute: false },
    onShowSuperClasses: { type: Object, attribute: false },
    onHideSuperClasses: { type: Object, attribute: false },
    onShowSubClasses: { type: Object, attribute: false },
    onHideSubClasses: { type: Object, attribute: false },
  }

  static styles = [ baseStyle, entityListItemStyle, incrementalDetailsStyle, textSpinnerStyle ]

  render() {
    return html`
    <div class="content-wrapper">   
      <!-- <gscape-button @click=${this.onShowSuperClasses} size="s" type="subtle" label="Show super classes" title="Show super classes">
        <span slot="icon">${superHierarchies}</span>
      </gscape-button>

      <gscape-button label="Hide super-classes" @click=${this.onHideSuperClasses}></gscape-button>

      <div class="hr"></div>
      
      <gscape-button title="Show sub classes" size="s" @click=${this.onShowSubClasses}>
      
      </gscape-button>
      <gscape-button label="Hide sub-classes" @click=${this.onHideSubClasses}></gscape-button>

      <div class="hr"></div> -->

      <!-- <gscape-button label="Remove" @click=${this.onRemove}></gscape-button> -->
      
      ${this.canShowInstances
        ? html`
        <details class="ellipsed entity-list-item" title="Instances" style="position:relative">
          <summary class="actionable" @click=${this.handleShowInstances}>
            <span class="entity-icon slotted-icon">${instancesIcon}</span>
            <span class="entity-name">Instances</span>
            <span class="counter chip">
              ${this.isInstanceCounterLoading || this.instanceCount === undefined
                ? textSpinner()
                : this.instanceCount
              }
            </span>
          </summary>
      
          <div class="summary-body">
            ${this.instances?.map(instance => this.getEntitySuggestionTemplate(instance))}
          </div>
        </details>
        `
        : null
      }

      ${this.dataProperties && this.dataProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.dataProperties?.map(dataProperty => this.getEntitySuggestionTemplate(dataProperty))}
            </div>
          </div>
        `
        : null
      }

      ${this.objectProperties && this.objectProperties.length > 0
        ? html`
            <div class="section">
              <div class="section-header bold-text">Object Properties</div>
              <div class="section-body" style="padding: 0">
                ${this.objectProperties?.map((op) => {
                  return html`
                    <details class="ellipsed entity-list-item" title=${op.objectProperty.displayedName}>
                      <summary class="actionable">
                        <span class="entity-icon slotted-icon">${objectPropertyIcon}</span>
                        <span class="entity-name">${op.objectProperty.displayedName}</span>
                        ${!op.direct
                          ? html`<span class="chip" style="line-height: 1">Inverse</span>`
                          : null
                        }
                      </summary>
                  
                      <div class="summary-body" ?isDirect=${op.direct}>
                        ${op.connectedClasses.map(classIri =>
                          this.getEntitySuggestionTemplate(classIri, op.objectProperty.value.iri.fullIri
                        ))}
                      </div>
                    </details>
                  `
                })}
              </div>
            </div>
          `
        : null
      }    
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

  private getEntitySuggestionTemplate(entity: EntityViewData, objectPropertyIri?: string) {
    let entityIcon: { _$litType$: 2; strings: TemplateStringsArray; values: unknown[] }

    return html`
      <div 
        title=${entity.displayedName}
        iri=${entity.value.iri.fullIri}
        entity-type="${entity.value.type}"
        class="ellipsed entity-list-item ${entity.value.type !== GrapholTypesEnum.DATA_PROPERTY ? 'actionable' : null }"
        @click=${(e: Event)=> this.handleEntityClick(e, objectPropertyIri)}
      >
        <span class="entity-icon slotted-icon">${entityIcons[entity.value.type]}</span>
        <span class="entity-name">${entity.displayedName}</span>
      </div>
    `
  }

  private handleEntityClick(e: Event, objectPropertyIri?: string) {
    const target = e.currentTarget as HTMLElement
    const iri = target.getAttribute('iri')
    const direct = target.parentElement?.getAttribute('isDirect')
    if (!iri) return

    if (target.getAttribute('entity-type') === GrapholTypesEnum.CLASS_INSTANCE) {
      this.onInstanceSelection(iri)
    } else if (objectPropertyIri) {
      this.onObjectPropertySelection(iri, objectPropertyIri, direct !== null)
    }

  }

  // protected get cxtMenuProps() {
  //   let cxtMenuProps = super.cxtMenuProps
  //   cxtMenuProps.placement = 'right'
  //   return cxtMenuProps
  // }

  setDataProperties(dataProperties: EntityViewData[]) { this.dataProperties = dataProperties }
  addDataProperties(dataProperties: EntityViewData[]) {
    this.dataProperties = (this.dataProperties || []).concat(dataProperties)
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

customElements.define('gscape-incremental-menu', GscapeIncrementalDetails)