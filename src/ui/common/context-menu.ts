import { css, CSSResultArray, html, LitElement, PropertyDeclarations, SVGTemplateResult, TemplateResult } from "lit"
import baseStyle from "../style"
import { BaseMixin } from "./mixins"
import { ContextualWidgetMixin } from "./mixins/contextual-widget-mixin"

/**
 * A command for the context menu
 */
export interface Command {
  /** the string to show */
  content: string,
  /** optional icon */
  icon?: SVGTemplateResult,
  /** callback to execute on selection */
  select: () => void,
}

export default class GscapeContextMenu extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  commands: Command[] = []
  customElements: (LitElement | HTMLElement | TemplateResult)[] = []
  showFirst: 'commands' | 'elements' = 'elements'

  onCommandRun = () => { }

  static properties: PropertyDeclarations = {
    commands: { type: Object, attribute: false },
    customElements: { type: Object, attribute: false },
    showFirst: { type: String },
  }

  static styles: CSSResultArray = [
    baseStyle,
    css`
      :host {
        display: flex;
        flex-direction: column;
        padding: 5px 0;
      }

      .command-entry {
        white-space: nowrap;
        cursor: pointer;
        padding: 5px 10px;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .command-text {
        line-height: 20px;
      }

      .gscape-panel, .custom-elements {
        overflow: unset;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        align-items: stretch;
      }
    `
  ]

  render() {
    return html`
    <div class="gscape-panel">
      ${this.title ? html`<div>${this.title}</div>` : null}
      ${this.showFirst === 'elements' ? this.customElementsTemplate : null}
      
      ${this.showFirst === 'elements' && this.customElements.length > 0 && this.commands.length > 0
        ? html`<div class="hr"></div>` : null}

      ${this.commandsTemplate}

      ${this.showFirst === 'commands' && this.customElements.length > 0 && this.commands.length > 0
        ? html`<div class="hr"></div>` : null}


      ${this.showFirst === 'commands' ? this.customElementsTemplate : null}
    </div>
    `
  }

  // Attach context menu to a given html element
  attachTo(element: HTMLElement, commands?: Command[], elements?: (LitElement | HTMLElement | TemplateResult)[]) {
    super.attachTo(element)
    this.commands = commands || []
    this.customElements = elements || []
  }

  // Attach menu to nothing, show it in arbitrary position
  attachToPosition(
    position: { x: number; y: number; },
    container: Element,
    commands?: Command[],
    elements?: (LitElement | HTMLElement | TemplateResult)[]
  ): void {
    const dummyDiv = document.createElement('div')
    dummyDiv.style.position = 'absolute'
    dummyDiv.style.top = position.y + "px"
    dummyDiv.style.left = position.x + "px"
    container.appendChild(dummyDiv)
    super.attachTo(dummyDiv)
    this.commands = commands || []
    this.customElements = elements || []

    const oldOnHide = this.cxtWidgetProps.onHide

    this.cxtWidgetProps.onHide = (instance) => {
      dummyDiv.remove()
      this.cxtWidgetProps.onHide = undefined

      if (oldOnHide) {
        oldOnHide(instance)

        //restore oldOnHide
        this.cxtWidgetProps.onHide = oldOnHide
      }
    }
  }

  private handleCommandClick(e: any) {
    const command = this.commands[e.currentTarget.getAttribute('command-id')]
    if (command.select) {
      command.select()
      this.onCommandRun()
      this.hide()
    }
  }

  private get commandsTemplate() {
    if (this.commands.length > 0)
      return html`
        <div class="commands">
          ${this.commands.map((command, id) => {
        return html`
              <div class="command-entry actionable" command-id="${id}" @click=${this.handleCommandClick}>
                ${command.icon ? html`<span class="command-icon slotted-icon">${command.icon}</span>` : null}
                <span class="command-text">${command.content}</span>
              <div>
            `
      })}
        </div>
      `
  }

  private get customElementsTemplate() {
    if (this.customElements.length > 0)
      return html`
        <div class="custom-elements">
          ${this.customElements.map(c => html`<div class="custom-element-wrapper">${c}</div>`)}
        </div>    
      `
  }
}

customElements.define('gscape-context-menu', GscapeContextMenu)