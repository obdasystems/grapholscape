import { LitElement } from "lit";
import tippy, { Instance, Props } from "tippy.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IContextualWidgetMixin {
  hide(): void
  /**
   * Attach cxt widget and show it
   * @param element the target html elment
   */
  attachTo(element: HTMLElement): void
  /**
   * Attach cxt widget and do not show it, if it was visible it stays visible
   * @param element the target html element
   */
  attachToSilently(element: HTMLElement): void
  cxtWidgetProps: Partial<Props>
  tippyWidget: Instance<Props>
}


export const ContextualWidgetMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class ContextualWidgetMixinClass extends superClass {
    tippyWidget = tippy(document.createElement('div'))
    cxtWidgetProps: Partial<Props> = {
      trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
      allowHTML: true,
      interactive: true,
      placement: "bottom",
      appendTo: ((ref) => {
        return document.querySelector('.gscape-ui') || ref
      }),
      // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
      content: this,
      offset: [0, 0],
      maxWidth: 'unset',
    }

    attachTo(element: HTMLElement) {
      this._attachTo(element)
      this.tippyWidget.show()
    }

    attachToSilently(element: HTMLElement) {
      this._attachTo(element)
    }

    private _attachTo(element: HTMLElement) {
      this.tippyWidget.setProps(this.cxtWidgetProps)
      this.tippyWidget.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() })
    }

    hide() {
      this.tippyWidget.hide()
    }

    oncontextmenu = (e: MouseEvent) => e.preventDefault()
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return ContextualWidgetMixinClass as unknown as Constructor<IContextualWidgetMixin> & T
}