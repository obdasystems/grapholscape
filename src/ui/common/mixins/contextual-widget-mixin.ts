import { LitElement } from "lit";
import tippy, { Props } from "tippy.js";

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class IContextualWidgetMixin {
  hide(): void
  attachTo(element: HTMLElement): void
  cxtWidgetProps: Partial<Props>
}


export const ContextualWidgetMixin = <T extends Constructor<LitElement>>(superClass: T) => {

  class ContextualWidgetMixinClass extends superClass {
    tippyWidget = tippy(document.createElement('div'))

    attachTo(element: HTMLElement) {
      this.tippyWidget.setProps(this.cxtWidgetProps)
      this.tippyWidget.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() })
      this.tippyWidget.show()
    }

    get cxtWidgetProps(): Partial<Props> {
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

    hide() {
      this.tippyWidget.hide()
    }
  }

  

  // Cast return type to your mixin's interface intersected with the superClass type
  return ContextualWidgetMixinClass as unknown as Constructor<IContextualWidgetMixin> & T
}