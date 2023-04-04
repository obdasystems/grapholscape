import { css, html, LitElement, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../../model";
import { BaseMixin, baseStyle, EntityViewData, GscapeEntityListItem, icons } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";
import a11yClick from "../../../ui/util/a11y-click";
import getIconSlot from "../../../ui/util/get-icon-slot";
import menuBaseStyle from "../menu-base-style";
import { ViewIncrementalObjectProperty } from "../view-model";

export default class GscapeNavigationMenu extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef?: HTMLElement

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
                const disabled = !this.canShowObjectPropertiesRanges && objectProperty.hasUnfolding === false
                return html`
                  <gscape-entity-list-item
                    displayedname=${objectProperty.entityViewData.displayedName}
                    iri=${objectProperty.entityViewData.value.iri.fullIri}
                    type=${objectProperty.entityViewData.value.type}
                    ?actionable=${!this.canShowObjectPropertiesRanges}
                    ?asaccordion=${this.canShowObjectPropertiesRanges}
                    ?disabled=${disabled}
                    @click=${this.handleEntitySelection}
                    direct=${objectProperty.direct}
                    title=${disabled ? 'Property not mapped to data' : objectProperty.entityViewData.displayedName}
                  >
                    ${this.canShowObjectPropertiesRanges
                      ? html`
                        <div slot="accordion-body">
                          ${objectProperty.connectedClasses.map(connectedClass => {
                            return html`
                                <gscape-entity-list-item
                                  displayedname=${connectedClass.entityViewData.displayedName}
                                  iri=${connectedClass.entityViewData.value.iri.fullIri}
                                  objpropertyiri=${objectProperty.entityViewData.value.iri.fullIri}
                                  direct=${objectProperty.direct}
                                  type=${connectedClass.entityViewData.value.type}
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

                    ${!objectProperty.direct
                      ? html`
                        <span slot="trailing-element" class="chip" style="line-height: 1">Inverse</span>
                      `
                      : null
                    }
                  </gscape-entity-list-item>
                `
              })}
            </div>
          </div>
        `
        : html`
          <div class="blank-slate" style="padding-bottom: 8px">
            ${icons.blankSlateDiagrams}
            <div class="header">No Object Properties Available</div>
          </div>
        `
      } 
    </div>
  `

  private handleEntitySelection(e: Event) {
    if (a11yClick(e)) {
      if (this.popperRef) 
        this.attachTo(this.popperRef)
  
      const targetListItem = e.currentTarget as GscapeEntityListItem | null

      if (targetListItem &&
        this.referenceEntity?.value.type === GrapholTypesEnum.CLASS_INSTANCE &&
        !targetListItem.disabled) {
        this.dispatchEvent(new CustomEvent('onobjectpropertyselection', {
          bubbles: true,
          composed: true,
          detail: {
            referenceClassIri: this.referenceEntity?.value.iri.fullIri,
            objectPropertyIri: targetListItem.iri,
            direct: targetListItem.getAttribute('direct') === 'true'
          }
        }) as ObjectPropertyNavigationEvent)
      }
    }
  }

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

  hide(): void {
    // wait a bit.
    // if you don't wait, the user will see all accordions closing before the menu disappear
    setTimeout(() => {
      this.shadowRoot
        ?.querySelectorAll(`gscape-entity-list-item[asaccordion]`)
        .forEach((listItemAccordion: GscapeEntityListItem) => listItemAccordion.closeAccordion())
    }, 500);
    

    super.hide()
  }

  attachTo(element: HTMLElement): void {
    this.popperRef = element
    super.attachTo(element)
  }

  get objectProperties() {
    return this._objectProperties
  }

  set objectProperties(newObjectProperties) {
    this._objectProperties = newObjectProperties.map(op => {
      op.connectedClasses.sort((a,b) => a.entityViewData.displayedName.localeCompare(b.entityViewData.displayedName))
      return op
    }).sort((a,b) => a.entityViewData.displayedName.localeCompare(b.entityViewData.displayedName))
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
  rangeClassIri?: string,
  objectPropertyIri: string,
  direct: boolean,
}>