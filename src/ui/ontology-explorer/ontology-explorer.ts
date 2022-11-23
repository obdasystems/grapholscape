import { css, html, LitElement } from 'lit'
import { EntityOccurrence } from '../../model/graphol-elems/entity'
import { EntityViewData } from '../util/search-entities'
import { entityIcons, explore } from '../assets/icons'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import BaseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { getEntityOccurrencesTemplate } from '../util/get-entity-view-occurrences'
import entityListItemStyle from './entity-list-item-style'
import GscapeEntitySearch from './entity-search-component'
import emptySearchBlankState from '../util/empty-search-blank-state'

export default class GscapeExplorer extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Ontology Explorer'
  entities: EntityViewData[]
  searchEntityComponent = new GscapeEntitySearch()

  // search: (e:any) => void = () => { }
  // filterEntities: (entityFilters: IEntityFilters) => void = () => { }
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

      .gscape-panel-in-tray > .content-wrapper {
        padding: 0;
        display: flex;
        flex-direction: column;
        max-height: 328px;
      }

      .blank-slate {
        white-space: normal;
        transform: translateY(40%);
      }

      .list-wrapper {
        position: relative;
        overflow: hidden auto;
        padding: 0px 8px;
        scrollbar-width: inherit;
        height: 100%;
      }

      .content-wrapper {
        height: 100%;
      }
    `
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
    <gscape-button type="subtle" @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>
      <div class="content-wrapper">
        ${this.searchEntityComponent}

        <div class="list-wrapper">

          ${this.entities.length === 0
            ? emptySearchBlankState
            : null
          }

          ${this.entities.map(entity => {
            return entity.viewOccurrences && entity.viewOccurrences.size > 0 ?
            html`
            <details class="ellipsed entity-list-item" title="${entity.displayedName}">
              <summary class="actionable">
                <span class="entity-icon" title="${entity.value.type}">${entityIcons[entity.value.type]}</span>
                <span class="entity-name">${entity.displayedName}</span>
              </summary>
              <div class="summary-body">
                ${getEntityOccurrencesTemplate(entity.viewOccurrences, this.onNodeNavigation)}
              </div>
            </details>
            `
            : null
          })}
        </div>
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