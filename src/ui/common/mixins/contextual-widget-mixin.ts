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
  attachToPosition(position: { x: number, y: number }, container: Element): void
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
    dummyDiv?: HTMLDivElement
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

    attachToPosition(position: { y: string; x: string; }, container: Element) {
      this.dummyDiv = document.createElement('div')
      this.dummyDiv.style.position = 'absolute'
      this.dummyDiv.style.top = position.y + "px"
      this.dummyDiv.style.left = position.x + "px"
      container.appendChild(this.dummyDiv)
      const oldOnHide = this.cxtWidgetProps.onHide
      this.cxtWidgetProps.onHide = (instance) => {
        this.dummyDiv?.remove()
        this.dummyDiv = undefined
        this.cxtWidgetProps.onHide = undefined

        if (oldOnHide) {
          oldOnHide(instance)

          //restore oldOnHide
          this.cxtWidgetProps.onHide = oldOnHide
        }
      }
      this.attachTo(this.dummyDiv)
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