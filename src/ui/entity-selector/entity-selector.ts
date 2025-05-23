import { css, html, LitElement } from 'lit'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import { GscapeButtonStyle, SizeEnum } from '../common/button'
import baseStyle from '../style'
import emptySearchBlankState from '../util/empty-search-blank-state'
import { search } from '../util/search-entities'
import getIconSlot from '../util/get-icon-slot'
import { arrowDown, cross, insertInGraph, search as searchIcon } from '../assets'
import a11yClick from '../util/a11y-click'
import { GscapeEntityListItem } from '../common/list-item'
import { EntityViewData } from '../view-model'
import { contentSpinnerStyle, getContentSpinner } from '../common/spinners'
import { Command } from '../common/context-menu'

export interface IEntitySelector {
  onClassSelection(callback:(iri: string) => void): void
}

export class GscapeEntitySelector extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Class Selector'
  private fullEntityList: EntityViewData[] = []
  private _entityList: EntityViewData[] = []
  private onClassSelectionCallback: (iri: string) => void

  private isSearchTextEmpty: boolean = true
  loading: boolean = false
  classActions?: Command[]

  static get properties() {
    return {
      entityList: { type: Object, attribute: false },
      isSearchTextEmpty: { type: Boolean, state: true },
      loading: { type: Boolean },
      onClassSelection: { type: Object },
      classActions: { type: Array },
    }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    contentSpinnerStyle,
    css`

      .gscape-panel {
        width: 100%;
        max-width: unset;
        box-sizing: border-box;
      }

      .widget-body {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        z-index: 1;
      }

      #drop-panel {
        position: relative;
        top: 0;
        max-height: unset;
        min-height: 60vh;
        height: 1px;
        overflow: hidden;
      }

      gscape-entity-list-item {
        --custom-min-height: 26.5px;
      }

      .hover-btn {
        display: none;
      }
      
      gscape-entity-list-item:hover > .hover-btn {
        display: initial;
      }

      gscape-entity-search {
        flex-shrink: 0;
      }

      #input-wrapper {
        position: relative;
        flex-grow: 2;
      }

      #input-wrapper > .slotted-icon {
        position: absolute;
        left: 8px;
        top: 11px;
      }

      input {
        width: 100%;
        height: 100%;
        padding: 12px 24px;
        padding-left: 38px;
      }

      #clear-btn {
        position: absolute;
        top: 8px;
        right: 8px;
      }

      @keyframes drop-down {
        from {opacity: 0; top: -20%;}
        to {opacity: 1; top: 0;}
      }
    `
  ]

  constructor() {
    super()
  }

  render() {
    return html`
      <div class="gscape-panel widget-body">
        <div id="input-wrapper">
          <span class="slotted-icon muted-text">${searchIcon}</span>
          <input @keyup=${this.handleSearch} type="text" placeholder="Search a class by IRI, labels...">
          ${!this.isSearchTextEmpty
            ? html`
              <gscape-button id="clear-btn" size="s" type="subtle" title="Clear search" @click=${this.clearSearch}>
                ${getIconSlot('icon', cross)}
              </gscape-button>
            `
            : null
          }
        </div>
        
        <gscape-button 
          type="secondary"
          @click=${this.togglePanel}
          title="Toggle complete list"
          size=${SizeEnum.S}>
          ${getIconSlot('icon', arrowDown)}
        </gscape-button>
      </div>
          
      <div id="drop-panel" class="gscape-panel hide drop-down">
        ${this.loading
          ? html`<div style="margin: 16px auto; display: table;">${getContentSpinner()}</div>`
          : !this.isPanelClosed()
            ? html`
              ${this.entityList.length === 0
                ? emptySearchBlankState()
                : html`
                  <lit-virtualizer
                  scroller
                  class="background-propagation"
                  style="min-height: 100%;"
                  .items=${this.entityList}
                  .renderItem=${(entityItem: EntityViewData) => html`
                    <gscape-entity-list-item
                      style="width:100%"
                      .types=${entityItem.value.types}
                      displayedName=${entityItem.displayedName}
                      title=${entityItem.displayedName}
                      iri=${entityItem.value.iri.fullIri}
                      ?disabled=${entityItem.disabled}
                      tabindex="0"
                      @keypress=${this.handleKeyPressOnEntry.bind(this)}
                    >
                      <div slot="trailing-element" class="hover-btn">
                        ${this.classActions?.map(action => html`
                          <gscape-button
                            size="s"
                            type="subtle"
                            title=${action.content}
                            @click=${() => {
                              if (action.select)
                                action.select(entityItem.value.iri.fullIri)
                            }}
                          >
                            ${action.icon ? getIconSlot('icon', action.icon) : null}
                          </gscape-button>
                        `)}

                        ${!this.classActions || this.classActions.length === 0
                          ? html`
                            <gscape-button
                              size="s"
                              type="subtle"
                              title="Insert in graph"
                              @click=${this.handleEntitySelection.bind(this)}
                            >
                              ${getIconSlot('icon', insertInGraph)}
                            </gscape-button>
                          `
                          : null
                        }
                      </div>
                    </gscape-entity-list-item>
                  `}
                >
                </lit-virtualizer>
              `} 
            `
            : null
        }
      </div>
    `
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  async focusInputSearch() {
    await this.updateComplete
    this.shadowRoot?.querySelector('input')?.focus()
  }

  private handleEntitySelection(evt: MouseEvent) {
    const iri = (evt.currentTarget as HTMLElement).parentElement?.parentElement?.getAttribute('iri')
    if (iri)
      this.onClassSelectionCallback(iri)
  }

  private handleKeyPressOnEntry(evt: Event) {
    if (a11yClick(evt)) {
      this.onClassSelectionCallback((evt.currentTarget as GscapeEntityListItem).iri)
    }
  }

  private handleSearch(e: KeyboardEvent) {
    const inputElement = e.currentTarget as HTMLInputElement
    if (!inputElement) return

    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur()
      inputElement.value = ''
      this.entityList = this.fullEntityList
      this.isSearchTextEmpty = true
      this.closePanel()
      return
    }

    this.isSearchTextEmpty = inputElement.value.length <= 0

    if (inputElement.value?.length > 2) {
      this.loading = true
      search(inputElement.value, this.fullEntityList).then(entities => {
        this.loading = false
        this.entityList = entities
      })
      this.openPanel()
    } else {
      this.entityList = this.fullEntityList
    }
  }

  clearSearch() {
    if (this.input) {
      this.input.value = ''
      this.entityList = this.fullEntityList
      this.isSearchTextEmpty = true
    }
  }

  // onClassSelection(callback: (iri: string) => void) {
  //   this.onClassSelectionCallback = callback
  // }

  get onClassSelection() {
    return this.onClassSelectionCallback
  }

  set onClassSelection(callback: (iri: string) => void) {
    this.onClassSelectionCallback = callback
    this.requestUpdate()
  }

  set entityList(newEntityList) {
    if (!this.fullEntityList || this.fullEntityList.length === 0) {
      this.fullEntityList = newEntityList
    }

    this._entityList = newEntityList
    this.requestUpdate()
  }

  get entityList() {
    return this._entityList
  }

  private get input() { return this.shadowRoot?.querySelector('input') }
}

customElements.define('gscape-entity-selector', GscapeEntitySelector)