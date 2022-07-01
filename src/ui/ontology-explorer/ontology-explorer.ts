import { html, css, LitElement } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import { explore, arrow_right, arrowDown, entityIcons, searchOff } from '../assets/icons'
import { GrapholTypesEnum } from '../../model/graphol-elems/node-enums'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import BaseStyle from '../style'
import entityListItemStyle from './entity-list-item-style'
import { DiagramViewData, getEntityOccurrencesTemplate, OccurrenceIdViewData } from '../util/get-entity-view-occurrences'
import { GrapholEntity, Iri } from '../../model'
import { EntityOccurrence } from '../../model/graphol-elems/entity'

// const TYPE_IMG_TEXT = {}
// TYPE_IMG_TEXT[GrapholTypesEnum.DATA_PROPERTY] = 'DP'
// TYPE_IMG_TEXT[GrapholTypesEnum.CONCEPT] = 'C'
// TYPE_IMG_TEXT[GrapholTypesEnum.OBJECT_PROPERTY] = 'OP'
// TYPE_IMG_TEXT[GrapholTypesEnum.INDIVIDUAL] = 'I'

export type EntityViewData = {
  value: GrapholEntity,
  viewOccurrences:  Map<DiagramViewData, OccurrenceIdViewData[]>
}

export default class GscapeExplorer extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Ontology Explorer'
  entities: EntityViewData[]

  search: (e:any) => void = () => { }
  onNodeNavigation: (occurrence: EntityOccurrence) => void = () => { }

  static properties = {
    entities: { type: Object, attribute: false }
  }

  static styles = [
    entityListItemStyle,
    BaseStyle,
    css`
      :host {
        order: 6;
        margin-top:10px;
      }      

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
      }

      .filter-box {
        padding: 8px;
      }

      .gscape-panel-in-tray {
        height: 350px;
        min-width: 200px;
      }

      .blank-slate {
        width: 200px;
        white-space: normal;
        transform: translateY(40%);
      }

      .content-wrapper {
        height: 100%;
      }
    `
  ]

  render() {
    return html`
    <gscape-button @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>

      <div class="filter-box">
        <input @keyup=${this.search} type="text" placeholder="Search IRI, labels..."></input>
      </div>

      <div class="content-wrapper">

        ${this.entities.length === 0
          ? html`
          <div class="blank-slate">
            ${searchOff}
            <div class="header">Can't find any entity</div>
            <div class="description">Please try again with another search text.</div>
          </div>
          `
          : null
        }

        ${this.entities.map(entity => {
          return html`
          <details class="ellipsed entity-list-item" title="${entity.value.iri.remainder}">
            <summary class="actionable">
              <span class="entity-icon" title="${entity.value.type}">${entityIcons[entity.value.type]}</span>
              <span class="entity-name">${entity.value.iri.remainder}</span>
            </summary>
            <div class="summary-body">
              ${getEntityOccurrencesTemplate(entity.viewOccurrences, this.onNodeNavigation)}
            </div>
          </details>
          `
        })}
      </div>
    </div>
    `
  }

  closePanel = () => {
    super.closePanel()

    this.shadowRoot?.querySelectorAll('.entity-list-item[open]')
      .forEach(item => (item as any).open = false)
  }

  // render() {
  //   return html`
  //     <gscape-head title="Explorer">
  //       <input
  //         type="text"
  //         autocomplete="off"
  //         @keyup="${this.search}"
  //         placeholder="Search Entities"
  //       />
  //     </gscape-head>

  //     <div class="widget-body hide">
  //     ${this.predicates.map( occurrences => {
  //       let entityData = occurrences[0]
  //       return html`
  //         <div>
  //           <div
  //             id="${entityData.id}"
  //             class="row highlight"
  //             type="${entityData.type}"
  //             title="${entityData.type}"
  //             displayed_name = "${entityData.displayed_name}"
  //             iri = "${entityData.iri.fullIri}"
  //             @click='${this.toggleSubRows}'
  //           >
  //             <span class="icon">
  //               ${entityData.areSubrowsOpen ? arrowDown : arrow_right}
  //             </span>
  //             <div>
  //               <div class="type-img type-img-${TYPE_IMG_TEXT[entityData.type]}">
  //                 <div>${TYPE_IMG_TEXT[entityData.type]}</div>
  //               </div>
  //             </div>
  //             <div class="row-label" >${entityData.displayed_name}</div>
  //           </div>

  //           <div class="sub-rows-wrapper hide">
  //           ${occurrences.map( entityInstance => {
  //             return html`
  //               <div class="sub-row highlight"
  //                 diagram_id="${entityInstance.diagram_id}"
  //                 node_id="${entityInstance.id}"
  //                 @click="${this.handleNodeSelection}"
  //               >
  //                 - ${entityInstance.diagram_name} - ${entityInstance.id_xml}
  //               </div>
  //             `
  //           })}
  //           </div>
  //         </div>
  //       `
  //     })}
  //     </div>
  //   `
  // }

  // toggleSubRows(e) {
  //   const iri = e.currentTarget.getAttribute('iri')

  //   e.currentTarget.parentNode
  //     .querySelector('.sub-rows-wrapper')
  //     .classList
  //     .toggle('hide')

  //   const entity = this.predicates.find( entityOccurr => entityOccurr[0].iri.fullIri === iri)
  //   entity[0].areSubrowsOpen = !entity[0].areSubrowsOpen

  //   e.currentTarget.classList.toggle('add-shadow')
  //   this.requestUpdate()
  // }

  // handleNodeSelection(e) {
  //   this.collapseBody()
  //   let node_id = e.target.getAttribute('node_id')
  //   this.onNodeNavigation(node_id)
  // }

  // // override
  // blur() {
  //   super.blur()
  //   this.shadowRoot.querySelector('input').blur()
  // }

  // firstUpdated() {
  //   super.firstUpdated()
  //   this.header.left_icon = explore
  //   this.makeDraggableHeadTitle()
  // }
}

customElements.define('gscape-explorer', GscapeExplorer)