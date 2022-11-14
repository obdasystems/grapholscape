import { css, CSSResultArray, CSSResultGroup, html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit"
import tippy, { Props } from 'tippy.js'
import { classIcon, dataPropertyIcon, objectPropertyIcon } from "../assets"
import { BaseMixin } from "../common/base-widget-mixin"
import baseStyle from "../style"

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

export default class GscapeContextMenu extends BaseMixin(LitElement) {
  commands: Command[] = []

  onCommandRun = () => { }

  tippyMenu = tippy(document.createElement('div'))

  static properties: PropertyDeclarations = {
    commands: { attribute: false }
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

      .command-icon {
        width: 19px;
        height: 19px;
      }

      .command-text {
        position: relative;
        top: 2px;
      }

      .gscape-panel {
        overflow: unset;
      }
    `
  ]

  render() {
    return html`
    <div class="gscape-panel">
      <div>${this.title}</div>
      ${this.commands.map((command, id) => {
        return html`
          <div class="command-entry actionable" command-id="${id}" @click=${this.handleCommandClick}>
            ${command.icon ? html`<span class="command-icon">${command.icon}</span>` : null }
            <span class="command-text">${command.content}</span>
          <div>
        `
      })}
    </div>
    `
  }

  attachTo(element: HTMLElement, commands?: Command[]) {
    console.log(element)
    this.tippyMenu.setProps(this.cxtMenuProps)
    this.tippyMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() })
    if (commands)
      this.commands = commands
    this.tippyMenu.show()
  }

  protected get cxtMenuProps(): Partial<Props> {
    return {
      trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
      allowHTML: true,
      interactive: true,
      placement: "bottom",
      appendTo: document.querySelector('.gscape-ui') || undefined,
      // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
      content: this,
      offset: [0, 0],
    }
  }
  

  private handleCommandClick(e: any) {
    this.commands[e.currentTarget.getAttribute('command-id')].select()
    this.onCommandRun()
    //this.tippyMenu.hide()
  }
}

customElements.define('gscape-context-menu', GscapeContextMenu)