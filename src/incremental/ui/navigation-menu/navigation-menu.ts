import { css, html, LitElement, PropertyDeclarations } from "lit";
import { BaseMixin, baseStyle, EntityViewData, GscapeEntityListItem, icons, ViewIncrementalObjectProperty } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";
import getIconSlot from "../../../ui/util/get-icon-slot";
import menuBaseStyle from "../menu-base-style";

export default class GscapeNavigationMenu extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef: HTMLElement

  /** @internal */
  private _objectProperties: ViewIncrementalObjectProperty[] = []
  /** @internal */
  objectPropertiesRanges?: Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>
  /** @internal */
  canShowObjectPropertiesRanges = true
  /** @internal */
  referenceEntity?: EntityViewData

  static properties: PropertyDeclarations = {
    objectProperties: { type: Object },
    objectPropertiesRanges: { type: Object },
    canShowObjectPropertiesRanges: { type: Boolean },
  }

  static styles = [
    baseStyle,
    menuBaseStyle,
    css`
      .connected-class-wrapper, .object-property-wrapper {
        display: flex;
        justify-content: space-between;
      }
    `
  ]

  constructor() {
    super()

    this.cxtWidgetProps.placement = 'right'
  }

  render = () => html`
    <div class="gscape-panel" id="drop-panel">
      
      <div class="header">
        <gscape-entity-list-item
          displayedname=${this.referenceEntity?.displayedName}
          iri=${this.referenceEntity?.value.iri.fullIri}
          type=${this.referenceEntity?.value.type}
        ></gscape-entity-list-item>
      </div>

      ${this.objectProperties && this.objectProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.objectProperties.map(objectProperty => {

                // const values = this.dataPropertiesValues?.get(dataProperty.value.iri.fullIri)

                return html`
                  <gscape-entity-list-item
                    displayedname=${objectProperty.objectProperty.displayedName}
                    iri=${objectProperty.objectProperty.value.iri.fullIri}
                    type=${objectProperty.objectProperty.value.type}
                    ?actionable=${true}
                    ?asaccordion=${this.canShowObjectPropertiesRanges}
                  >
                  
                    <span slot="trailing-element" class="hover-btn">
                      <gscape-button
                        size="s"
                        type="subtle"
                        @click=${this.handleSearchInstancesRange}
                      >
                      ${getIconSlot('icon', icons.search)}
                      </gscape-button>
                    </span>

                    ${this.canShowObjectPropertiesRanges
                      ? html`
                        <div slot="accordion-body">
                          ${objectProperty.connectedClasses.map(connectedClass => {
                            return html`
                                <gscape-entity-list-item
                                  displayedname=${connectedClass.displayedName}
                                  iri=${connectedClass.value.iri.fullIri}
                                  objpropertyiri=${objectProperty.objectProperty.value.iri.fullIri}
                                  direct=${objectProperty.direct}
                                  type=${connectedClass.value.type}
                                  ?actionable=${false}
                                >
                                  <div slot="trailing-element" class="hover-btn">
                                    <gscape-button
                                      size="s"
                                      type="subtle"
                                      @click=${this.handleInsertInGraphClick}
                                    >
                                      ${getIconSlot('icon', icons.insertInGraph)}
                                    </gscape-button>
                                  </div>
                                </gscape-entity-list-item>
                            `
                          })}
                        </div>
                      `
                      : null
                    }
                  </gscape-entity-list-item>
                `
              })}
            </div>
          </div>
        `
        : null
      } 
    </div>
  `

  private handleInsertInGraphClick(e: MouseEvent) {
    const targetListItem = (e.currentTarget as HTMLElement).parentElement?.parentElement as GscapeEntityListItem | null

    if (targetListItem) {
      this.dispatchEvent(new CustomEvent('onclassselection', { 
        bubbles: true, 
        composed: true, 
        detail: {
          referenceClassIri: this.referenceEntity?.value.iri.fullIri,
          rangeClassIri: targetListItem.iri,
          objectPropertyIri: targetListItem.getAttribute('objpropertyiri'),
          direct: targetListItem.getAttribute('direct') === 'true',
        }
      }) as ObjectPropertyNavigationEvent)
    }
  }

  private handleSearchInstancesRange() {
  }

  attachTo(element: HTMLElement): void {
    this.shadowRoot
      ?.querySelectorAll(`gscape-entity-list-item[asaccordion]`)
      .forEach((listItemAccordion: GscapeEntityListItem) => listItemAccordion.closeAccordion())
    super.attachTo(element)
  }

  get objectProperties() {
    return this._objectProperties
  }

  set objectProperties(newObjectProperties) {
    this._objectProperties = newObjectProperties.map(op => {
      op.connectedClasses.sort((a,b) => a.displayedName.localeCompare(b.displayedName))
      return op
    }).sort((a,b) => a.objectProperty.displayedName.localeCompare(b.objectProperty.displayedName))
    this.requestUpdate()
  }

  updated() {
    if (this.popperRef)
      this.attachTo(this.popperRef)
  }

}

customElements.define('gscape-navigation-menu', GscapeNavigationMenu)


export type ObjectPropertyNavigationEvent = CustomEvent<{
  referenceClassIri: string,
  rangeClassIri: string,
  objectPropertyIri: string,
  direct: boolean,
}>