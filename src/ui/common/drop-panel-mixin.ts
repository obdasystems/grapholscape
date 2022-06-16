// Define the interface for the mixin

import { LitElement } from "lit";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IDropPanelMixin {
  protected togglePanel(): () => void
  protected openPanel(): () => void
  protected closePanel(): () => void
  protected get panel(): () => void
  onTogglePanel: () => void
}


export const DropPanelMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class DropPanelMixinClass extends superClass {

    protected get panel() { return this.shadowRoot?.querySelector('.gscape-panel') }

    protected togglePanel() {
      this.panel?.classList.toggle('hide')
      this.onTogglePanel()
    }

    protected openPanel() {
      this.panel?.classList.remove('hide')
    }

    protected closePanel() {
      this.panel?.classList.add('hide')
    }

    blur() {
      super.blur()
      this.closePanel()
    }

    onTogglePanel: () => {}
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T
}

export function hasDropPanel(element: any): element is IDropPanelMixin {
  return element.togglePanel ? true : false
}