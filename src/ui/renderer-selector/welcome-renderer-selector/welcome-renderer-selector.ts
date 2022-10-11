import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../../style"
import { RendererStatesEnum } from "../../../model";
import { BaseMixin } from "../../common/base-widget-mixin";
import { RendererStateViewModel } from "../view-model";

export default class GscapeWelcomeRendererSelector extends BaseMixin(LitElement) {
  rendererStates: (RendererStateViewModel | undefined)[]

  onRendererStateSelection: (rendererState: RendererStatesEnum) => void

  static properties: PropertyDeclarations = {
    rendererStates: { type: Object, attribute: false }
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
      <div class="title bold-text">Select a rendering mode:</div>
      <div class="options">
        ${this.rendererStates.map(rendererState => {
          return html`
            <div class="card" renderer-state=${rendererState.id} @click=${this.handleRendererSelection}>
              <div class="icon">${rendererState.icon}</div>
              <div class="title bold-text">${rendererState.name}</div>
              <div class="description muted-text">${rendererState.description}</div>
            </div>
          `
        })}
      </div>
    `
  }

  private handleRendererSelection(evt: MouseEvent) {
    const targetElement = evt.currentTarget as HTMLElement

    this.onRendererStateSelection(targetElement.getAttribute('renderer-state') as RendererStatesEnum)
    this.hide()
  }
}

customElements.define('gscape-welcome-renderer-selector', GscapeWelcomeRendererSelector)