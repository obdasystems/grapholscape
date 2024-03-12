import { css, html, LitElement, PropertyDeclarations } from "lit";
import { TypesEnum } from "../../../model";
import { BaseMixin, baseStyle, EntityViewData, GscapeEntityListItem, icons, SizeEnum } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";
import a11yClick from "../../../ui/util/a11y-click";
import getIconSlot from "../../../ui/util/get-icon-slot";
import { ViewObjectProperty } from "../../../ui/view-model";
import menuBaseStyle from "../menu-base-style";

export default class GscapeNavigationMenu extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef?: HTMLElement

  /** @internal */
  private _objectProperties: ViewObjectProperty[] = []
  /** @internal */
  objectPropertiesRanges?: Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>
  /** @internal */
  canShowObjectPropertiesRanges = true
  /** @internal */
  referenceEntity?: EntityViewData
  /** @internal */
  referenceEntityType?: TypesEnum

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
          .types=${this.referenceEntity?.value.types}
        ></gscape-entity-list-item>
      </div>

      ${this.objectProperties && this.objectProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.objectProperties.map(objectProperty => {

                // const values = this.dataPropertiesValues?.get(dataProperty.value.iri.fullIri)
                const disabled = !this.canShowObjectPropertiesRanges || objectProperty.disabled === true
                return html`
                  <gscape-entity-list-item
                    displayedname=${objectProperty.displayedName}
                    iri=${objectProperty.value.iri.fullIri}
                    .types=${objectProperty.value.types}
                    ?asaccordion=${this.canShowObjectPropertiesRanges}
                    ?disabled=${disabled}
                    direct=${objectProperty.direct}
                    title=${disabled ? 'Property not mapped to data' : objectProperty.displayedName}
                  >
                    ${this.canShowObjectPropertiesRanges
                      ? html`
                        <div slot="accordion-body">
                          ${objectProperty.connectedClasses.map(connectedClass => {
                            return html`
                                <gscape-entity-list-item
                                  displayedname=${connectedClass.displayedName}
                                  iri=${connectedClass.value.iri.fullIri}
                                  objpropertyiri=${objectProperty.value.iri.fullIri}
                                  direct=${objectProperty.direct}
                                  .types=${connectedClass.value.types}
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

                    <div slot="trailing-element" style="display: flex; align-items: center; gap: 4px">
                      ${!objectProperty.direct
                        ? html`
                          <span class="chip" style="line-height: 1">Inverse</span>
                        `
                        : null
                      }

                      ${!this.canShowObjectPropertiesRanges
                        ? html`
                          <span>
                            <gscape-button
                              @click=${(e) => this.handleSearchInstancesRange(e, objectProperty)}
                              size=${SizeEnum.S}
                              title='Search instances in relationship'
                            >
                              ${getIconSlot('icon', icons.search)}
                            </gscape-button>
                          </span>
                          <span>
                            <gscape-button
                              @click=${(e) => this.handleObjPropertySelection(e, objectProperty)}
                              size=${SizeEnum.S}
                              title='Directly add first 50 instances'
                            >
                              ${getIconSlot('icon', icons.arrow_right)}
                            </gscape-button>
                          </span>
                        `
                        : null
                      }
                    </div>
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

  private handleObjPropertySelection(e: Event, objectProperty: ViewObjectProperty) {
    if (a11yClick(e)) {

      // if (this.referenceEntity?.value.types.includes(TypesEnum.CLASS_INSTANCE) &&
      //   (
      //     this.canShowObjectPropertiesRanges &&
      //     !objectProperty.disabled
      //   )) {
      //   this.dispatchEvent(new CustomEvent('objectpropertyselection', {
      //     bubbles: true,
      //     composed: true,
      //     detail: {
      //       referenceClassIri: this.referenceEntity?.value.iri.fullIri,
      //       objectPropertyIri: objectProperty.value.iri.fullIri,
      //       direct: objectProperty.direct
      //     }
      //   }) as ObjectPropertyNavigationEvent)
      // }
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

  private handleSearchInstancesRange(e: MouseEvent, objectProperty: ViewObjectProperty) {
    e.stopPropagation()
    if (a11yClick(e)) {
      if (this.popperRef) 
        this.attachTo(this.popperRef)
  
      // const targetListItem = (e.currentTarget as any)?.parentElement.parentElement.parentElement as GscapeEntityListItem | null

      // if (objectProperty &&
      //   this.referenceEntity?.value.types.includes(TypesEnum.CLASS_INSTANCE) &&
      //   !objectProperty.disabled) {
      //   this.dispatchEvent(new CustomEvent('searchinstancesranges', {
      //     bubbles: true,
      //     composed: true,
      //     detail: {
      //       referenceClassIri: this.referenceEntity?.value.iri.fullIri,
      //       objectPropertyIri: objectProperty.value.iri.fullIri,
      //       direct: objectProperty.direct
      //     }
      //   }) as ObjectPropertyNavigationEvent)
      // }
    }
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
      op.connectedClasses.sort((a,b) => a.displayedName.localeCompare(b.displayedName))
      return op
    }).sort((a,b) => a.displayedName.localeCompare(b.displayedName))
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