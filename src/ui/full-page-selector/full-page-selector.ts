import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../style"
import { RendererStatesEnum } from "../../model";
import { BaseMixin } from "../common/mixins";
import { UiOption } from "../renderer-selector/view-model";

export default class GscapeFullPageSelector extends BaseMixin(LitElement) {
  options: (UiOption | undefined)[]
  title: string = ''

  onOptionSelection: (optionId: string) => void

  static properties: PropertyDeclarations = {
    rendererStates: { type: Object, attribute: false },
    title: { type: String, reflect: true },
  }

  static styles: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        z-index: 100;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
        background: var(--gscape-color-bg-default);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 50px;
      }

      .title {
        font-size: 150%;
        text-align: center;
      }

      .options {
        display: flex;
        justify-content: center;
        align-items: stretch;
        gap: 24px;
      }

      .card {
        box-shadow: 0 2px 10px 0 var(--gscape-color-shadow);
        border: solid 1px var(--gscape-color-border-default);
        border-radius: var(--gscape-border-radius);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        width: 15%;
        gap: 8px;
      }

      .card > .icon {
        margin-bottom: 16px;
      }

      .card > .icon > svg {
        height: 40px !important;
        width: auto !important;
      }

      .card > .title {
        font-size: 120%;
      }

      .card > .description {
        text-align: center;
      }

      .card:hover {
        border-color: var(--gscape-color-accent);
        cursor: pointer;
        background-color: var(--gscape-color-neutral);
      }
    `
  ]

  render() {
    return html`
      <div class="title bold-text">${this.title}</div>
      <div class="options">
        ${this.options.map(option => {
          if (option)
            return html`
              <div class="card" renderer-state=${option.id} @click=${this.handleRendererSelection} title=${option.name}>
                <div class="icon">${option.icon}</div>
                <div class="title bold-text">${option.name}</div>
                <div class="description muted-text">${option.description}</div>
              </div>
            `
        })}
      </div>
    `
  }

  private handleRendererSelection(evt: MouseEvent) {
    const targetElement = evt.currentTarget as HTMLElement

    this.onOptionSelection(targetElement.getAttribute('renderer-state') as RendererStatesEnum)
    this.hide()
  }
}

customElements.define('gscape-welcome-renderer-selector', GscapeFullPageSelector)