import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { colors, minus, plus, searchOff } from "../assets";
import { BaseMixin, DropPanelMixin } from "../common/mixins";
import baseStyle from "../style";
import a11yClick from "../util/a11y-click";


export type ClassWithColor = {
  id: string,
  displayedName: string,
  iri: string,
  color?: string,
  filtered: boolean
}

export default class GscapeEntityColorLegend extends DropPanelMixin(BaseMixin(LitElement)) {
  title: string = 'Color Legend'
  elements: ClassWithColor[] = []
  protected isDefaultClosed: boolean = false

  onElementSelection: (classWithColor: ClassWithColor) => void = () => {}

  static properties: PropertyDeclarations = {
    elements: { type: Array },
  }

  static styles?: CSSResultGroup | undefined = [
    baseStyle,
    css`
      :host {
        position: absolute;
        bottom: 10px;
        left: 10px;
        max-height: 60%;
        max-width: 20%;
        display: flex;
      }

      .gscape-panel {
        max-height: unset;
        max-width: unset;
      }

      ul {
        margin: 0;
        padding: 0;
      }

      li {
        list-style: none;
      }

      gscape-entity-list-item[filtered] {
        opacity: 0.4;
      }
    `
  ]

  private handleElemClick(e: Event) {
    if (a11yClick(e)) {
      const elem = this.elements.find(c => c.id === (e.currentTarget as any).id)
      if (elem)
        this.onElementSelection(elem)
    }
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  render() {
    return html`
      <div class="top-bar ${this.isPanelClosed() ? null : 'traslated-down' }">
        <gscape-button style="z-index: 1;"
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? html`
                <span slot="icon">${colors}</span>
                <span slot="trailing-icon">${plus}</span>
              `
            : html`<span slot="icon">${minus}</span>`
          }
        </gscape-button>
      </div>


      <div id="drop-panel" class="gscape-panel">
        ${this.elements.length > 0
          ? html`
            <div class="list">
              ${this.elements.map(element => {
                return html`
                  <gscape-entity-list-item
                    id=${element.id}
                    @click=${this.handleElemClick}
                    iri=${element.iri}
                    displayedName=${element.displayedName}
                    color=${element.color}
                    ?filtered=${element.filtered}
                    actionable
                  ></gscape-entity-list-item>
                `
              })}  
            </div>
          `
          : html`
            <div class="blank-slate">
              ${searchOff}
              <div class="header">No Classes</div>
              <div class="description">Current diagram has no classes or instances displayed in it.</div>
            </div>
          `
        }
      </div>
    `
  }
}

customElements.define('gscape-entity-color-legend', GscapeEntityColorLegend)
