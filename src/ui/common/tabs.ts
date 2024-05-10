import { css, html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit";
import baseStyle from "../style";

export type TabProps = {
  id: number,
  icon?: SVGTemplateResult,
  label: string
}

export default class GscapeTabs extends LitElement {

  public tabs: TabProps[] = []

  private activeTabID: number = 0

  static properties: PropertyDeclarations = {
    tabs: { type: Object },
    activeTabID: { type: String, state: true },
  }

  static styles = [
    baseStyle,
    css`
      .nav-bar {
        display: flex;
        justify-content: space-evenly;
        gap: 8px;
      }

      .tab {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .tab-wrapper {
        flex-grow: 1;
        padding-bottom: 4px;
      }

      .tab-wrapper[active] {
        border-bottom: solid 3px var(--gscape-color-accent);
      }

      .tab > .label {
        text-align: center;
      }
    `
  ]

  private async handleTabClick(evt: MouseEvent) {
    const tabID = (evt.currentTarget as HTMLDivElement | undefined)?.id

    if (tabID !== undefined) {
      this.activeTabID = parseInt(tabID)

      await this.updateComplete
      this.dispatchEvent(new CustomEvent<number>('change', {
        bubbles: true,
        composed: true,
        detail: this.activeTabID
      }))
    }
  }

  render() {
    return html`
      <div class="nav-bar">
        ${this.tabs.map(tab => {
          return html`
            <div id=${tab.id} @click=${this.handleTabClick} class="tab-wrapper" ?active=${this.activeTabID === tab.id}>
              <div class="actionable tab">
                ${tab.icon
                  ? html`<span class="slotted-icon">${tab.icon}</span>`
                  : null
                }
                <span class="label">${tab.label}</span>
              </div>
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.define('gscape-tabs', GscapeTabs)