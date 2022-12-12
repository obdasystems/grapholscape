import { css, html, LitElement } from 'lit'
import { BaseMixin } from '../common/base-widget-mixin'
import { GscapeButtonStyle } from '../common/button'
import baseStyle from '../style'
import emptySearchBlankState from '../util/empty-search-blank-state'
import { EntityViewData, search } from '../util/search-entities'

export interface IEntitySelector {
  onClassSelection(callback:(iri: string) => void): void
}

export default class GscapeEntitySelector extends BaseMixin(LitElement) implements IEntitySelector {
  title = 'Class Selector'
  private fullEntityList: EntityViewData[] = []
  private _entityList: EntityViewData[] = []
  private onClassSelectionCallback: (iri: string) => void

  static get properties() {
    return {
      entityList: { type: Object, attribute: false },
    }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    css`
      :host {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%);
        max-height: 70%;
        display: flex;
        width: 25%;
      }

      .gscape-panel {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        max-height: unset;
        max-width: unset;
        width: 100%;
        font-size: 14px;
      }

      .header {
        text-align: center;
        flex-shrink: 0;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
      }

      gscape-entity-search {
        flex-shrink: 0;
      }

      .list-wrapper {
        padding: 0 8px;
      }

      input {
        margin: 8px 16px;
        flex-shrink: 0;
      }
    `
  ]

  constructor() {
    super()
  }

  render() {
    return html`
      <div class="gscape-panel ellipsed">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
        <input @keyup=${this.handleSearch} type="text" placeholder="Search a class by IRI, labels...">

          <div class="list-wrapper">
            ${this.entityList.map(entityItem => {
              return html`
                <gscape-action-list-item
                  type="subtle"
                  label=${entityItem.displayedName}
                  iri=${entityItem.value.iri.prefixed}
                  @click=${this.handleEntitySelection}
                ></gscape-action-list-item>
              `
            })}

            ${this.entityList.length === 0
              ? emptySearchBlankState
              : null
            }
          </div>
        </div>
      </div>
    `
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  private handleEntitySelection(evt: MouseEvent) {
    const iri = (evt.target as HTMLElement).getAttribute('iri')
    if (iri)
      this.onClassSelectionCallback(iri)
  }

  private handleSearch(e: KeyboardEvent) {
    const inputElement = e.currentTarget as HTMLInputElement
    if (!inputElement) return

    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur()
      inputElement.value = ''
      this.entityList = this.fullEntityList
      return
    }

    if (inputElement.value?.length > 2) {
      this.entityList = search(inputElement.value, this.fullEntityList)
    } else {
      this.entityList = this.fullEntityList
    }
  }

  onClassSelection(callback: (iri: string) => void) {
    this.onClassSelectionCallback = callback
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
}

customElements.define('gscape-entity-selector', GscapeEntitySelector)