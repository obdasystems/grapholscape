import { LitElement } from "lit";
import { IBaseMixin } from "./base-widget-mixin";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IModalMixin {
  hide(): void
  show(): void
  protected modalBackground: HTMLDivElement
}

export const ModalMixin = <T extends Constructor<IBaseMixin>>(superClass: T) => {

  class ModalMixinClass extends superClass {
    protected modalBackground = document.createElement('div')

    constructor(..._: any) {
      super();

      (this as unknown as HTMLElement).style.cssText = `
        z-index: 100;
        position: relative;
        height: 100%;
        width: 100%;
        display: block;
      `

      this.modalBackground.style.cssText = `
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--gscape-color-bg-default);
        opacity: 0.6;
        display: none;
      `

      this.hide()
    }

    show() {
      super.show();
      // (this as unknown as HTMLElement).style.zIndex = '2';
      this.showModalBackground();
    }

    hide() {
      super.hide();
      (this as unknown as HTMLElement).style.zIndex = '';
      this.hideModalBackground()
    }

    private showModalBackground() {
      this.modalBackground.style.display = 'initial';
      const thisElem = this as unknown as LitElement
      thisElem.shadowRoot?.insertBefore(this.modalBackground, thisElem.shadowRoot?.firstElementChild)
    }
    
    private hideModalBackground() {
      this.modalBackground.style.display = 'none'
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return ModalMixinClass as unknown as Constructor<IModalMixin> & T
}