import { css, CSSResultArray, html, LitElement, PropertyDeclarations, SVGTemplateResult, TemplateResult } from "lit"
import baseStyle from "../style"
import { BaseMixin } from "./mixins"
import { ContextualWidgetMixin } from "./mixins/contextual-widget-mixin"
import { arrow_right } from "../assets"
import { contentSpinnerStyle, getContentSpinner } from "./spinners"
import emptySearchBlankState from "../util/empty-search-blank-state"
import * as icons from "../assets"

/**
 * A command for the context menu
 */
export interface Command {
  /** the string to show */
  content: string,
  /** optional icon */
  icon?: SVGTemplateResult,
  /** callback to execute on selection */
  select?: (...args: any[]) => void,
  subCommands?: Promise<CommandList>,
  description?: string,
  disabled?: boolean,
  hidden?: boolean,
}

export type CommandList = Command[] | { searchable: boolean, commands: Command[] }

export default class GscapeContextMenu extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  commands: Command[] = []
  customElements: (LitElement | HTMLElement | TemplateResult)[] = []
  showFirst: 'commands' | 'elements' = 'elements'
  loading = false
  searchable = false
  shownCommandsIds: string[] = []
  private subMenus: Map<string, GscapeContextMenu> = new Map()
  private loadingCommandsIds: string[] = []

  onCommandRun = () => { }

  static properties: PropertyDeclarations = {
    commands: { type: Object },
    customElements: { type: Object },
    showFirst: { type: String },
    loading: { type: Boolean },
    searchable: { type: Boolean },
    shownCommandsIds: { type: Array },
    loadingCommandsIds: { type: Array },
  }

  static styles: CSSResultArray = [
    baseStyle,
    contentSpinnerStyle,
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

      .command-entry[disabled] {
        opacity: 50%;
        cursor: initial;
        pointer-events: none;
      }

      .command-text {
        line-height: 20px;
        flex-grow: 2;
      }

      .command-icon {
        flex-shrink: 0;
      }

      .gscape-panel, .custom-elements {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }

      .command-entry.submenu-visible {
        background-color: var(--gscape-color-accent-muted);
      }

      .loading-wrapper {
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `
  ]

  constructor() {
    super()
    this.addEventListener('subcommandclick', () => this.hide())
  }

  render() {
    return html`
    <div class="gscape-panel">
      ${this.title ? html`<div>${this.title}</div>` : null}
      ${this.loading
        ? html`<div class="loading-wrapper">${getContentSpinner()}</div>`
        : html`
          ${this.showFirst === 'elements' ? this.customElementsTemplate : null}

          ${this.showFirst === 'elements' && this.customElements.length > 0 && this.commands.length > 0
            ? html`<div class="hr"></div>` : null}

          ${this.searchable
            ? html`
              <gscape-entity-search
                placeholder='Search...'
                @onsearch=${(e: CustomEvent<{ searchText: string }>) => this.handleCommandSearch(e)}
              ></gscape-entity-search>
            `
            : null
          }
          ${this.commandsTemplate}

          ${this.showFirst === 'commands' && this.customElements.length > 0 && this.commands.length > 0
            ? html`<div class="hr"></div>` : null}

          ${this.showFirst === 'commands' ? this.customElementsTemplate : null}
        `
      }
    </div>
    `
  }

  // Attach context menu to a given html element
  attachTo(element: HTMLElement, commands?: CommandList, elements?: (LitElement | HTMLElement | TemplateResult)[]) {
    super.attachTo(element)
    let searchable = false
    let _commands: Command[] = []
    if (commands) {
      if (GscapeContextMenu.isCommandListSearchable(commands)) {
        searchable = commands.searchable
        _commands = commands.commands
      } else {
        _commands = commands
      }
    }
    this.searchable = searchable
    this.commands = _commands
    this.shownCommandsIds = this.commands.map((c, i) => i.toString())
    this.customElements = elements || []
  }

  // Attach menu to nothing, show it in arbitrary position
  attachToPosition(
    position: { x: number; y: number; },
    container: Element,
    commands?: CommandList,
    elements?: (LitElement | HTMLElement | TemplateResult)[]
  ): void {
    let searchable = false
    let _commands: Command[] = []
    if (commands) {
      if (GscapeContextMenu.isCommandListSearchable(commands)) {
        searchable = commands.searchable
        _commands = commands.commands
      } else {
        _commands = commands
      }
    }
    super.attachToPosition(position, container)
    this.searchable = searchable
    this.commands = _commands
    this.shownCommandsIds = this.commands.map((c, i) => i.toString())
    this.customElements = elements || []
  }

  private async handleCommandClick(e: any) {
    const command = this.commands[e.currentTarget.getAttribute('command-id')]
    if (command.select && !command.disabled) {
      command.select()

      await this.updateComplete
      this.dispatchEvent(new CustomEvent('subcommandclick', {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: 'ciao'
      }))
      
      this.onCommandRun()
      this.hide()
    }
  }

  private handleCommandSearch(e: CustomEvent<{searchText: string}>) {
    if (e.detail.searchText.length > 2) {
      this.shownCommandsIds = this.commands.filter((c, i) => {
        return c.content.toLowerCase().includes(e.detail.searchText.toLowerCase())
      }).map((c) => this.commands.indexOf(c).toString())
    } else {
      this.shownCommandsIds = this.commands.map((c, i) => i.toString())
    }
    this.tippyWidget.popperInstance?.update()
  }

  private get commandsTemplate() {
    const commandsToShow = this.commands.filter((c, id) => !c.hidden && this.shownCommandsIds.includes(id.toString()))
    if (commandsToShow.length > 0) {
      return html`
        <div class="commands">
          ${this.commands.map((command, id) => { // cannot use commandsToShow because the ID is the index in the array
            if (command.hidden || !this.shownCommandsIds.includes(id.toString())){
              return null
            }

            return html`
              <div
                class="command-entry ellipsed ${!command.disabled ? 'actionable' : null} ${this.subMenus.get(id.toString())?.isConnected ? 'submenu-visible' : null}"
                command-id="${id}"
                @click=${this.handleCommandClick}
                @mouseover=${() => this.showSubMenu(command, id.toString())}
                title=${command.description}
                ?disabled=${command.disabled}
              >
                ${command.icon ? html`<span class="command-icon slotted-icon">${command.icon}</span>` : null}
                <span class="command-text">${command.content}</span>

                <span style="min-width: 20px">
                  ${command.subCommands
                    ? html`
                      <span class="command-icon slotted-icon">
                        ${this.loadingCommandsIds.includes(id.toString())
                          ? getContentSpinner()
                          : arrow_right
                        }
                      </span>
                    `
                    : null
                  }
                </span>
              </div>
            `
          })}
        </div>
      `
    } else {
      return this.commands.length === 0 && this.customElements.length === 0
        ? html`
          <div class="blank-slate">
            ${icons.blankSlateDiagrams}
            <div class="header">No options available</div>
            <div class="description"></div>
          </div>
        `
      : this.commands.length > 0 && this.searchable ? emptySearchBlankState('result') : null
    }
  }

  private showSubMenu(command: Command, commandID: string) {
    if (command.subCommands && !command.disabled) {
      let subMenu = this.subMenus.get(commandID)
      if (!subMenu) {
        subMenu = new GscapeContextMenu()
        subMenu.cxtWidgetProps.appendTo = this.shadowRoot as unknown as Element || 'parent'
      }
      if (!subMenu.isConnected) {
        this.subMenus.set(commandID, subMenu)
        subMenu.cxtWidgetProps.placement = 'right'
        subMenu.cxtWidgetProps.offset = [0, 12]
        subMenu.cxtWidgetProps.onHide = () => {
          subMenu!.remove()
          this.subMenus.delete(commandID)
        }
        this.loadingCommandsIds = [...this.loadingCommandsIds, commandID]
        const target = this.shadowRoot?.querySelector(`[command-id = "${commandID}"]`)
        if (target !== null && target !== undefined) {
          command.subCommands.then(subCommands => {
            if (this.isConnected && subMenu) {
              this.loadingCommandsIds = this.loadingCommandsIds.filter(commandId => commandId !== commandID)
              subMenu.attachTo(target as HTMLElement, subCommands)
            }
          })
        }
      }
    }
    this.commands.forEach((c, id) => {
      if (id.toString() !== commandID)
        this.hideSubMenu(id.toString())
    })

    this.requestUpdate()
  }

  public hideSubMenu(commandID: string) {
    const subMenu = this.subMenus.get(commandID)
    if (subMenu) {
      subMenu.hide()
      subMenu.subMenus.forEach((menu, id) => subMenu.hideSubMenu(id))
    }
  }

  private get customElementsTemplate() {
    if (this.customElements.length > 0)
      return html`
        <div class="custom-elements">
          ${this.customElements.map(c => html`<div class="custom-element-wrapper">${c}</div>`)}
        </div>    
      `
  }

  private static isCommandListSearchable(commandList: CommandList): commandList is { searchable: boolean, commands: Command[] } {
    return (commandList as any).commands !== undefined
  }
}

customElements.define('gscape-context-menu', GscapeContextMenu)