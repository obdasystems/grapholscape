// Define the interface for the mixin

import { LitElement } from "lit";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IDropPanelMixin {
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
      return this.panel ? this.panel.classList.contains('hide') : false // default open
    }

    onTogglePanel = () => {}
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T
}

export function hasDropPanel(element: any): element is IDropPanelMixin {
  return element.togglePanel ? true : false
}