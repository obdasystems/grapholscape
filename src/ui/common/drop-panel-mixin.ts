// Define the interface for the mixin

import { LitElement } from "lit";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IDropPanelMixin {
  protected togglePanel(): () => void
}


export const DropPanelMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class DropPanelMixinClass extends superClass {

    protected togglePanel() {
      this.shadowRoot?.querySelector('.gscape-panel')?.classList.toggle('hide')
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return DropPanelMixinClass as unknown as Constructor<IDropPanelMixin> & T

}