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
      this.panel?.classList.toggle('hide')
      this.onTogglePanel()
    }

    openPanel() {
      this.panel?.classList.remove('hide')
    }

    closePanel() {
      this.panel?.classList.add('hide')
    }

    blur() {
      super.blur()
      this.closePanel()
    }

    isPanelClosed() {
      return this.panel?.classList.contains('hide')
    }

    onTogglePanel = () => {}
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T
}

export function hasDropPanel(element: any): element is IDropPanelMixin {
  return element.togglePanel ? true : false
}