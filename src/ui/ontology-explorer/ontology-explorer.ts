import { css, html, LitElement } from 'lit'
import { blankSlateDiagrams, explore } from '../assets/icons'
import { BaseMixin, TippyDropPanelMixin } from '../common/mixins'
import { GscapeEntitySearch } from '../common/text-search'
import { SearchEvent } from '../common/text-search/entity-text-search'
import BaseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import emptySearchBlankState from '../util/empty-search-blank-state'
import { getEntityOccurrencesTemplate } from '../util/get-entity-view-occurrences'
import { search } from '../util/search-entities'
import { EntityViewData } from '../view-model'
import { LitVirtualizer } from '@lit-labs/virtualizer'
import { contentSpinnerStyle, getContentSpinner } from '../common/spinners'

LitVirtualizer

export default class GscapeExplorer extends TippyDropPanelMixin(BaseMixin(LitElement), 'left') {
  title = 'Entity Explorer'
  private _entities: EntityViewData[] = []
  private shownEntities: EntityViewData[] = []
  loading = false
  // search: (e:any) => void = () => { }
  // filterEntities: (entityFilters: IEntityFilters) => void = () => { }
  onNodeNavigation: (elementId: string, diagramId: number) => void = () => { }
  // onSearch: (e: KeyboardEvent) => void
  // onEntityFilterToggle: () => void

  static properties = {
    entities: { type: Object, attribute: false },
    shownEntities: { type: Object, attribute: false },
    loading: { type: Boolean }
  }

  static styles = [
    BaseStyle,
    contentSpinnerStyle,
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
        height: 50vh;
        max-height: unset;
        min-width: 300px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
      }

      .list-wrapper > .blank-slate {
        white-space: normal;
        transform: translateY(40%);
      }

      .list-wrapper {
        padding: 0px 8px;
        overflow: auto;
        flex-grow: 2;
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
        this.loading = true
        search(e.detail.searchText, this.entities).then(entities => {
          this.loading = false
          this.shownEntities = entities
        })
      } else {
        this.shownEntities = this.entities
      }
    })
    this.closePanel()
  }

  render() {
    return html`
    <gscape-button type="subtle" @click=${this.togglePanel}>
      <span slot="icon">${explore}</span>
    </gscape-button>

    <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
      <div class="header">${this.title}</div>
      <gscape-entity-search
        class=0
        object-property=0
        data-property=0
        individual=0
        class-instance=0
      ></gscape-entity-search>

        ${this.loading 
          ? html`<div style="margin: 16px auto; display: table;">${getContentSpinner()}</div>`
          : this.shownEntities.length === 0
            ? emptySearchBlankState
            : !this.isPanelClosed()
              ? html`
                <div style="padding: 0 8px; height: inherit">
                  <lit-virtualizer
                    scroller
                    class="background-propagation"
                    style="min-height: 100%"
                    .items=${this.shownEntities}
                    .renderItem=${(entity: EntityViewData) => html`
                      <gscape-entity-list-item
                        style="width: 100%"
                        ?asaccordion=${true}
                        displayedname=${entity.displayedName}
                        .types=${entity.value.types}
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
                    `}
                  >
                  </lit-virtualizer>
                </div>
              `
              : null
        }
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