import { css, html, LitElement, PropertyValueMap } from 'lit'
import { BaseMixin } from '../common/base-widget-mixin'
import { GscapeButtonStyle } from '../common/button'
import { GscapeActionListItem } from '../common/list-item'
import GscapeEntitySearch from '../ontology-explorer/entity-search-component'
import baseStyle from '../style'

export default class GscapeEntitySelector extends BaseMixin(LitElement) {
  title = 'Class Selector'
  entityList: string[] = []
  searchEntityComponent = new GscapeEntitySearch()
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
        max-height: 50%;
        display: flex;
      }

      .gscape-panel {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        max-height: unset;
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
    `
  ]

  render() {
    return html`
      <div class="gscape-panel ellipsed">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
          ${this.searchEntityComponent}

          <div class="list-wrapper">
            ${this.entityList.map(entityItem => {
              return html`
                <gscape-action-list-item
                  type="subtle"
                  label=${entityItem}
                  @click=${this.handleEntitySelection}
                ></gscape-action-list-item>
              `
            })}
          </div>
        </div>
      </div>
    `
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  private handleEntitySelection(evt: MouseEvent) {
    this.onClassSelectionCallback((evt.target as GscapeActionListItem).label)
  }

  onClassSelection(callback: (iri: string) => void) {
    this.onClassSelectionCallback = callback
  }
}

customElements.define('gscape-entity-selector', GscapeEntitySelector)