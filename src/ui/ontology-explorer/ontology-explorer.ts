import { css, html, LitElement } from 'lit'
import { EntityOccurrence } from '../../model/graphol-elems/entity'
import { blankSlateDiagrams, entityIcons, explore } from '../assets/icons'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import { GscapeEntitySearch } from '../common/text-search'
import { SearchEvent } from '../common/text-search/entity-text-search'
import BaseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import emptySearchBlankState from '../util/empty-search-blank-state'
import { getEntityOccurrencesTemplate } from '../util/get-entity-view-occurrences'
import { EntityViewData, search } from '../util/search-entities'
import entityListItemStyle from './entity-list-item-style'

export default class GscapeExplorer extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Ontology Explorer'
  private _entities: EntityViewData[]
  private shownEntities: EntityViewData[]
  // search: (e:any) => void = () => { }
  // filterEntities: (entityFilters: IEntityFilters) => void = () => { }
  onNodeNavigation: (occurrence: EntityOccurrence) => void = () => { }
  // onSearch: (e: KeyboardEvent) => void
  // onEntityFilterToggle: () => void

  static properties = {
    entities: { type: Object, attribute: false },
    shownEntities: { type: Object, attribute: false }
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

      .list-wrapper > .blank-slate {
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

    this.addEventListener('onsearch', (e: SearchEvent) => {
      if (e.detail.searchText.length > 2) {
        this.shownEntities = search(e.detail.searchText, this.entities)
      } else {
        this.shownEntities = this.entities
      }
    })
  }

  render() {
    return html`
    <gscape-button type="subtle" @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>
      <div class="content-wrapper">
        <gscape-entity-search></gscape-entity-search>
        <!-- <gscape-entity-type-filter></gscape-entity-type-filter> -->

        <div class="list-wrapper">

          ${this.shownEntities.length === 0
            ? emptySearchBlankState
            : null
          }

          ${this.shownEntities.map(entity => {
            return html`
              <gscape-entity-list-item
                ?asaccordion=${true}
                displayedname=${entity.displayedName}
                type=${entity.value.type}
                iri=${entity.value.iri.fullIri}
              >
                <div slot="accordion-body">
                ${entity.viewOccurrences && entity.viewOccurrences.size > 0
                  ? getEntityOccurrencesTemplate(entity.viewOccurrences, this.onNodeNavigation)
                  : html`
                    <div class="blank-slate">
                      ${blankSlateDiagrams}
                      <div class="header">No Occurrences</div>
                      <div class="description">The entity has no occurrences in this rendering mode.</div>
                    </div>
                  `
                }
                </div>
              </gscape-entity-list-item>
            `
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

  get entities() { return this._entities }
  set entities(newEntities: EntityViewData[]) {
    this._entities = this.shownEntities = newEntities
  }

  get searchEntityComponent() { return this.shadowRoot?.querySelector('gscape-entity-search') as GscapeEntitySearch | undefined }
}

customElements.define('gscape-explorer', GscapeExplorer)