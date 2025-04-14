// Define the interface for the mixin

import { LitElement } from "lit";
import tippy, { Instance, Placement, Props } from "tippy.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IDropPanelMixin {
  protected isDefaultClosed: boolean
  togglePanel(): void
  openPanel(): void
  closePanel(): void
  protected get panel(): HTMLElement | undefined | null
  onTogglePanel(): void
  isPanelClosed(): boolean
}


export const DropPanelMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class DropPanelMixinClass extends superClass {

    protected get panel(): HTMLElement | undefined | null { return this.shadowRoot?.querySelector('#drop-panel') }
    protected isDefaultClosed = true

    togglePanel() {
      this.isPanelClosed() ? this.openPanel() : this.closePanel()
      this.onTogglePanel()
    }

    openPanel() {
      this.panel?.classList.remove('hide')
      this.requestUpdate()

      // Blur other widgets in bottom-right-buttons-tray, keep only one panel open at time
      const container = this.parentElement
      if (container && container.classList.contains('gscape-ui-buttons-tray')) {
        for (const siblingElement of container.children) {
          if (siblingElement !== this)
            (siblingElement as DropPanelMixinClass).blur()
        }
      }
    }

    closePanel() {
      if (!this.isPanelClosed()) {
        this.panel?.classList.add('hide')
        this.requestUpdate()
      }
    }

    blur() {
      super.blur()
      this.closePanel()
    }

    onblur: ((ev: FocusEvent) => any) = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      const target = ev.relatedTarget as HTMLElement

      if (target && !this.contains(target)) {
        this.blur()
      }
    }

    isPanelClosed() {
      if (this.panel) {
        return this.panel.classList.contains('hide')
      } else {
        return this.isDefaultClosed
      }
    }

    onTogglePanel = () => { }
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T
}

export const TippyDropPanelMixin = <T extends Constructor<LitElement>>(superClass: T, placement: Placement = 'bottom') => {

  class DropPanelMixinClass extends (superClass) {

    protected get panel(): HTMLElement | undefined | null { return this.shadowRoot?.querySelector('#drop-panel') }
    protected isDefaultClosed = true
    protected tippyProps: Partial<Props> = {
      placement: placement,
      interactive: true,
      allowHTML: true,
      hideOnClick: 'toggle',
      offset: [0, 0],
      trigger: 'manual',
      maxWidth: 'unset',
      popperOptions: {
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              padding: 0,
            },
          },
        ],
      },
      appendTo: (ref) => this.shadowRoot as unknown as Element || 'parent'
    }
    protected tippyRef?: Instance<Props>

    togglePanel() {
      this.isPanelClosed() ? this.openPanel() : this.closePanel()
      this.onTogglePanel()
    }

    openPanel() {
      if (!this.tippyRef) {
        if (this.panel) {
          this.panel?.classList.remove('hide')
          this.tippyRef = tippy(this, {
            content: this.panel,
            ...this.tippyProps,
          })
        }
      }

      if (this.isPanelClosed()) {

        this.tippyRef?.show()
        this.requestUpdate()

        // Blur other widgets in bottom-right-buttons-tray, keep only one panel open at time
        const container = this.parentElement
        if (container && container.classList.contains('gscape-ui-buttons-tray')) {
          for (const siblingElement of container.children) {
            if (siblingElement !== this)
              (siblingElement as DropPanelMixinClass).blur()
          }
        }
      }
    }

    closePanel() {
      if (!this.isPanelClosed()) {
        this.tippyRef?.hide()
      }
    }

    blur() {
      super.blur()
      this.closePanel()
    }

    onblur: ((ev: FocusEvent) => any) = (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      const target = ev.relatedTarget as HTMLElement

      if (target && !this.contains(target)) {
        this.blur()
      }
    }

    isPanelClosed() {
      return this.tippyRef === undefined || !this.tippyRef.state.isVisible
    }

    onTogglePanel = () => { }
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T
}

// export function hasDropPanel(element: any): element is IDropPanelMixin {
//   return element.togglePanel ? true : false
// }