import { css, html, LitElement } from "lit";
import { BaseMixin, baseStyle, createEntitiesList, DropPanelMixin, EntityViewData, GscapeEntitySelector, SizeEnum } from "../../../ui";
import { cross } from "../../../ui/assets";
import getIconSlot from "../../../ui/util/get-icon-slot";
import IncrementalController from "../../controller";

export default class IncrementalInitialMenu extends BaseMixin(LitElement) {

  public shortestPathMode: boolean = false
  public sideMenuMode: boolean = false
  private class1?: EntityViewData
  private class2?: EntityViewData
  private classes?: EntityViewData[]

  static properties = {
    class1: { type: Object, attribute: 'class1' },
    class2: { type: Object, attribute: 'class2' },
    shortestPathMode: { type: Boolean },
    sideMenuMode: { type: Boolean }
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

      #shortest-path-btn {
        position: absolute;
        top: 200px;
        left: 50%;
        transform: translate(-50%);
      }

      gscape-entity-selector {
        display: block;
        z-index: 1;
      }

      .column-container {
        display: flex;
        gap: 36px;
      }

      .column-container > * {
        width: 40%
      }

      .dots {
        margin: 8px;
        position: relative;
        top: -3px;
      }

      .selected-entity-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: fit-content;
        min-width: 200px;
        max-width: unset;
        box-sizing: border-box;
      }
    `,
  ]

  constructor(public ic: IncrementalController) {
    super()
    this.classes = createEntitiesList(this.ic.grapholscape, { class: 1, areAllFiltersDisabled: false } )
  }

  render = () => {
    return html`
      ${this.shortestPathMode
        ? html`
          <center><p class="bold-text">Find the shortest path between two classes</p></center>
          <div class="column-container">
            ${this.getTemplate(1, this.class1)}

            <div style="width: fit-content; margin: 20px auto;"><span class="dots bold-text">...</span>to<span class="dots bold-text">...</span></div>

            ${this.getTemplate(2, this.class2)}
          </div>
        `
        : html`
          <gscape-entity-selector
            .onClassSelection=${(iri: string) => this.handleClassSelection(iri)}
            .entityList=${this.classes}
          ></gscape-entity-selector>
        `
      }

      ${!this.sideMenuMode
        ? html`
          <gscape-button
            id="shortest-path-btn"
            label=${this.shortestPathMode ? `Single Class` : `Shortest Path` }
            @click=${this.handleShortestPathBtnClick}
          ></gscape-button>
        `
        : null
      }

      ${this.shortestPathMode && this.class1 && this.class2 ? html `
        <center>
          <gscape-button
            title="Find Shortest Path"
            type="primary"
            label="Confirm"
            @click=${this.handleConfirm}
          ></gscape-button>
        </center>
      ` : null}
    `
  }

  focusInputSearch() {
    (this.shadowRoot
      ?.querySelector('gscape-entity-selector') as GscapeEntitySelector | null
    )?.focusInputSearch()
  }

  closePanel(): void {
    let entitySelectors = this.shadowRoot
      ?.querySelectorAll('gscape-entity-selector')

    entitySelectors?.forEach(entitySelector => (entitySelector as GscapeEntitySelector).closePanel())
    this.requestUpdate()
  }

  openPanel(): void {
    let entitySelectors = this.shadowRoot
      ?.querySelectorAll('gscape-entity-selector')

    entitySelectors?.forEach(entitySelector => (entitySelector as GscapeEntitySelector).openPanel())
    this.requestUpdate()
  }

  private getTemplate(id: number, entity?: EntityViewData) {
    return !entity
      ? html`
        <gscape-entity-selector
          .onClassSelection=${(iri: string) => this.handleClassSelection(iri, id)}
          .entityList=${this.classes}
        ></gscape-entity-selector>
      `
      : html`
        <div class="gscape-panel selected-entity-wrapper">
          <gscape-entity-list-item
            .types=${entity.value.types}
            displayedName=${entity.displayedName}
            iri=${entity.value.iri}
          >
          </gscape-entity-list-item>
          <gscape-button
            title="Clear"
            size=${SizeEnum.S}
            @click=${() => { this[`class${id}`] = undefined }}
          >
            ${getIconSlot('icon', cross)}
          </gscape-button>
        </div>
      `
  }

  private handleShortestPathBtnClick() {
    this.shortestPathMode = !this.shortestPathMode

    this.style.width = this.shortestPathMode ? '70%' : '40%'
  }

  private async handleClassSelection(iri: string, selectorId?: number) {
    const selectedClass = this.classes?.find(c => c.value.iri.equals(iri))
    if (selectorId === 1) {
      this.class1 = selectedClass
    } 
    
    if (selectorId === 2) {
      this.class2 = selectedClass
    }

    if (!this.shortestPathMode) {
      await this.updateComplete
      this.dispatchEvent(new CustomEvent('class-selection', {
        bubbles: true,
        composed: true,
        detail: iri
      }))
    }
  }

  private async handleConfirm() {
    if (this.shortestPathMode && this.class1 && this.class2) {
      await this.updateComplete
      this.dispatchEvent(new CustomEvent('confirm-shortest-path', {
        bubbles: true,
        composed: true,
        detail: {
          sourceClassIri: this.class1.value.iri.fullIri,
          targetClassIri: this.class2.value.iri.fullIri,
        }
      }))
    }
  }

}

customElements.define('incremental-initial-menu', IncrementalInitialMenu)