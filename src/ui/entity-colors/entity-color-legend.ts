import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { searchOff } from "../assets";
import { BaseMixin } from "../common/mixins";
import baseStyle from "../style";
import a11yClick from "../util/a11y-click";


export type ClassWithColor = {
  id: string,
  displayedName: string,
  iri: string,
  color?: string,
  filtered: boolean
}

export default class GscapeEntityColorLegend extends BaseMixin(LitElement) {
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
        display: block;
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

  render() {
    return html`
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
    `
  }
}

customElements.define('gscape-entity-color-legend', GscapeEntityColorLegend)
