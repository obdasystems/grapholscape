import { css, html } from "lit";
import { cross, arrow_right } from "../assets";
import getIconSlot from "../util/get-icon-slot";
import { Grapholscape } from "../../core";
import { EntityViewData } from "../view-model";
import { createEntitiesList } from "../util/search-entities";
import { GscapeEntitySelector } from "../entity-selector";
import { SizeEnum } from "../common/button";
import GscapeConfirmDialog from "../common/confirm-dialog";

/** @internal */
export default class ShortestPathDialog extends GscapeConfirmDialog {

  public classes?: EntityViewData[]
  public class1EditEnabled: boolean = true
  private _class1?: string
  public class2EditEnabled: boolean = true
  private _class2?: string

  protected _onConfirm?: (sourceClassIri: string, targetClassIri: string) => void

  static properties = {
    classes: { type: Array },
    _class1: { type: String, attribute: 'class1' },
    _class2: { type: String, attribute: 'class2' },
    class1EditEnabled: { type: Boolean },
    class2EditEnabled: { type: Boolean },
  }

  static styles = [
    super.styles,
    css`
      gscape-entity-selector {
        position: static;
        display: block;
        z-index: 1;
      }

      .column-container {
        display: flex;
        padding: 16px 8px;
        justify-content: space-between;
        height: 60px;
        gap: 16px;
      }

      .selected-entity-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: fit-content;
        min-width: 200px;
        max-width: unset;
        box-sizing: border-box;
        position: unset;
        left: unset;
        transform: unset;
        align-self: center;
      }
    `,
  ]

  constructor(grapholscape?: Grapholscape) {
    super()
    if (grapholscape)
      this.classes = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false } )
  }

  render = () => {
    return html`
      <div class="gscape-panel" style="overflow: unset; max-width: 70%">
        <div class="header">Find shortest path between two classes</div>
        <div class="column-container">
          ${this.getClassSelectorTemplate(1, this.class1, this.class1EditEnabled)}

          <div style="width: fit-content; align-self: center;">
            ${arrow_right}
          </div>

          ${this.getClassSelectorTemplate(2, this.class2, this.class2EditEnabled)}
        </div>

        <div class="buttons">
          ${this._onConfirm || this._onCancel
            ? html`
              <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
            `
            : null
          }
          <gscape-button
            ?disabled=${!this._class1 || !this._class2}
            title="Find Shortest Path"
            type="primary"
            label="Confirm"
            @click=${this.handleConfirm}
          ></gscape-button>
        </div>
      </div>
    `
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

  public onConfirm(callback: (sourceClassIri: string, targetClassIri: string) => void): GscapeConfirmDialog {
    this._onConfirm = callback
    return this
  }

  private getClassSelectorTemplate(id: number, iri?: string, allowClear = true) {

    if (iri) {
      const classEntity = this.classes?.find(c => c.value.iri.equals(iri))
      if (classEntity)
        return html`
          <div class="gscape-panel selected-entity-wrapper">
            <gscape-entity-list-item
              .types=${classEntity.value.types}
              displayedName=${classEntity.displayedName}
              iri=${classEntity.value.iri}
            >
            </gscape-entity-list-item>
            ${allowClear 
              ? html`
                <gscape-button
                  title="Clear"
                  size=${SizeEnum.S}
                  @click=${() => { this[`class${id}`] = undefined }}
                >
                  ${getIconSlot('icon', cross)}
                </gscape-button>
              `
              : null
            }
          </div>
        `
    } else {
      return html`
        <gscape-entity-selector
          .onClassSelection=${(iri: string) => this.handleClassSelection(iri, id)}
          .entityList=${this.classes}
        ></gscape-entity-selector>
      `
    }
  }

  private async handleClassSelection(iri: string, selectorId?: number) {
    if (selectorId === 1) {
      this.class1 = iri
    } 
    
    if (selectorId === 2) {
      this.class2 = iri
    }
  }

  protected handleConfirm() {
    if (this._onConfirm && this.class1 && this.class2)
      this._onConfirm(this.class1, this.class2)
    this.remove()
  }

  set class1(newClassIri: string | undefined) {
    this._class1 = newClassIri
  }

  get class1() {
    return this._class1
  }

  set class2(newClassIri: string | undefined) {
    this._class2 = newClassIri
  }

  get class2() {
    return this._class2
  }
}

customElements.define('shortest-path-dialog', ShortestPathDialog)