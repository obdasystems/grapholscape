import { LitElement } from "lit";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IBaseMixin {
  hide(): void
  show(): void
  enable(): void
  disable(): void
  onStateChange(): void
  isVisible: boolean
  enabled: boolean
}


export const BaseMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class BaseMixinClass extends superClass {
    enabled = true
    private display = this.style.display

    onStateChange = () => { }

    hide() {
      if (this.enabled && this.style.display !== 'none') {
        this.display = this.style.display
        this.style.display = 'none'
      }
      
    }

    show() {
      if (this.enabled && this.style.display === 'none')
        this.style.display = this.display
    }

    enable() {
      this.enabled = true
      this.show()
      this.onStateChange()
    }

    disable() {
      this.hide()
      this.enabled = false
      this.onStateChange()
    }

    get isVisible() { return this.enabled && this.style.display !== 'none' }
  }

  // Cast return type to your mixin's interface intersected with the superClass type

  return BaseMixinClass as unknown as Constructor<IBaseMixin> & T
}