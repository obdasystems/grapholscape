import { css, html, LitElement } from "lit";
import { TypesEnum } from "../../../model";
import { BaseMixin, baseStyle, ModalMixin, SizeEnum } from "../../../ui";
import { Entity, EntityTypeEnum, OntologyPath } from "../../api/swagger";

export default class GscapePathSelector extends ModalMixin(BaseMixin(LitElement)) {

  paths: OntologyPath[] = []
  selectedPathID: number = 0
  canShowMore: boolean = false

  static properties = {
    getMorePaths: { type: Boolean },
    paths: { type: Array },
    selectedPathID: { type: Number },
    canShowMore: { type: Boolean }
  }

  static styles = [
    baseStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 80%;
        min-width: 300px;
      }

      .header {
        margin: 8px;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
      }

      .path {
        display: flex;
        align-items: center;
        overflow: auto;
        gap: 4px;
        border: solid 1px var(--gscape-color-border-subtle);
      }

      .path[selected] {
        border: solid 2px var(--gscape-color-accent);
        background: var(--gscape-color-neutral-subtle);
      }

      gscape-entity-list-item {
        max-width: 200px;
        pointer-events: none;
      }

      .path-list {
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">Select a path over the ontology</div>

        <div class="path-list">
          ${this.paths.map((path, i) => {
            return html`
              <div id=${i} class="path actionable" ?selected=${this.selectedPathID === i} @click=${this.handlePathClick}>
                ${i === 0
                  ? html`
                    <span class="chip">
                      Shortest
                    </span>
                  `
                  : null
                }
                
                ${path.entities?.map((entity) => {
                  let types = new Set()
                  let displayedName: string | undefined
                  if (entity.type === EntityTypeEnum.ObjectProperty ||
                    entity.type === EntityTypeEnum.InverseObjectProperty) {
                    if (!entity.iri?.endsWith('subClassOf')) {
                      types.add(TypesEnum.OBJECT_PROPERTY)
                    } else {
                      displayedName = 'subClassOf'
                    }
                  }

                  if (entity.type === EntityTypeEnum.Class) {
                    types.add(TypesEnum.CLASS) 
                  }

                  return html`
                    <gscape-entity-list-item
                      displayedName=${displayedName || this.getDisplayedName(entity)}
                      iri=${entity.iri}
                      .types=${types}

                    >
                    </gscape-entity-list-item>
                  `
                })}
              </div>
            `
          })}
        </div>

        ${this.canShowMore
          ? html`
            <center>
              <gscape-button label="Show More" type="subtle" size=${SizeEnum.S} @click=${this.handleShowMoreClick}></gscape-button>
            </center>
            `
          : null
        }

        <div class="buttons">
          <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
          <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `
  }

  getDisplayedName = (entity: Entity) => entity.iri

  private handlePathClick(e: MouseEvent) {
    const id = (e.currentTarget as HTMLDivElement)?.getAttribute('id')
    if (id) {
      this.selectedPathID = parseInt(id)
    }
  }

  private async handleShowMoreClick(e: MouseEvent) {
    await this.updateComplete

    this.dispatchEvent(new CustomEvent('show-more-paths', {
      bubbles: true,
      composed: true,
    } as PathSelectionEvent))
  }

  private async handleConfirm() {
    await this.updateComplete

    this.dispatchEvent(new CustomEvent('path-selection', {
      bubbles: true,
      composed: true,
      detail: this.selectedPath
    } as PathSelectionEvent))

    this.remove()
  }

  private handleCancel() {
    this.remove()
  }

  get selectedPath() {
    return this.paths[this.selectedPathID]
  }
}

customElements.define('gscape-path-selector', GscapePathSelector)

export type PathSelectionEvent = CustomEvent<OntologyPath>