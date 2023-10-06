import { css, html, LitElement } from "lit";
import { Grapholscape } from "../../core";
import { BaseMixin } from "../common/mixins";
import { EntityViewData } from "../view-model";
import baseStyle from '../style'
import { createEntitiesList } from "../util/search-entities";
import { GscapeEntitySelector } from "../entity-selector";
import { LifecycleEvent } from "../../model";

export default class IncrementalInitialMenu extends BaseMixin(LitElement) {

  public classes?: EntityViewData[]
  public shortestPathEnabled: boolean = false
  public sideMenuMode: boolean = false

  static properties = {
    classes: { type: Array },
    sideMenuMode: { type: Boolean },
    shortestPathEnabled: { type: Boolean },
  }

  static styles = [
    baseStyle,
    css`
      :host {
        max-height: 70%;
        width: 40%;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        top: 20%;
        left: 50%;
        transform: translate(-50%);
        position: absolute;
      }

      gscape-entity-selector {
        display: block;
        z-index: 1;
      }

      #shortest-path-btn {
        position: fixed;
        top: 200px;
        align-self: center;
      }
    `,
  ]

  constructor(grapholscape?: Grapholscape) {
    super()
    if (grapholscape) {
      this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false } )
      grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
        this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false } )
      })
    }
  }

  render = () => {
    return html`
      <gscape-entity-selector
        .onClassSelection=${(iri: string) => this.handleClassSelection(iri)}
        .entityList=${this.classes}
      ></gscape-entity-selector>

      ${!this.sideMenuMode && this.shortestPathEnabled
        ? html`
          <gscape-button
            id="shortest-path-btn"
            label="Shortest Path"
            @click=${this.handleShortestPathBtnClick}
          ></gscape-button>
        `
        : null
      }
    `
  }

  focusInputSearch() {
    (this.shadowRoot
      ?.querySelector('gscape-entity-selector') as GscapeEntitySelector | null
    )?.focusInputSearch()
  }

  closePanel(): void {
    let entitySelector = this.shadowRoot
      ?.querySelector('gscape-entity-selector');

    (entitySelector as GscapeEntitySelector).closePanel()
    this.requestUpdate()
  }

  openPanel(): void {
    let entitySelector = this.shadowRoot
      ?.querySelector('gscape-entity-selector');

    (entitySelector as GscapeEntitySelector).openPanel()
    this.requestUpdate()
  }

  private async handleShortestPathBtnClick() {
    await this.updateComplete
    this.dispatchEvent(new CustomEvent('shortest-path-click', { bubbles: true, composed: true }))
  }

  private async handleClassSelection(iri: string) {
    await this.updateComplete
    this.dispatchEvent(new CustomEvent('class-selection', {
      bubbles: true,
      composed: true,
      detail: iri
    }))
  }
}

customElements.define('incremental-initial-menu', IncrementalInitialMenu)