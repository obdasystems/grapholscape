import { css, html, LitElement } from 'lit'
import { GrapholEntity } from '../../model'
import { EntityOccurrence } from '../../model/graphol-elems/entity'
import { entityIcons, explore, searchOff } from '../assets/icons'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import BaseStyle from '../style'
import { DiagramViewData, getEntityOccurrencesTemplate, OccurrenceIdViewData } from '../util/get-entity-view-occurrences'
import entityListItemStyle from './entity-list-item-style'


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
}

customElements.define('gscape-explorer', GscapeExplorer)