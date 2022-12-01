import { Grapholscape } from "../../core"
import { WidgetEnum } from "../util/widget-enum"
import GscapeIncrementalDetails from "./incremental-details"

export { GscapeIncrementalDetails as GscapeIncrementalMenu }

export * as IncrementalCommands from './commands'

export default function initIncrementalMenu(grapholscape: Grapholscape) {
  const incrementalMenu = new GscapeIncrementalDetails()

//   // grapholscape.on(LifecycleEvent.NodeSelection, node => {
//   //   if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL)
//   //     cxtMenuWidget.attachTo((grapholscape.renderer.cy.$id(node.id) as any).popperRef(), [])
//   // })

  grapholscape.widgets.set(WidgetEnum.INCREMENTAL_MENU, incrementalMenu)
}

// function getCxtMenuProps(cxtMenuWidget: ContextMenuWidget): Partial<Props> {
//   return {
//     trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
//     allowHTML: true,
//     interactive: true,
//     placement: "bottom",
//     appendTo: document.querySelector('.gscape-ui') || undefined,
//     // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
//     content: cxtMenuWidget,
//     hideOnClick: true,
//     offset: [0, 0],
//   }
// }

// export function attachCxtMenuTo(element: HTMLElement, commands: Command[]) {
//   cxtMenu.setProps(getCxtMenuProps())
//   cxtMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() } )
//   cxtMenuWidget.commands = commands
//   cxtMenu.show()
// }

// cxtMenuWidget.onCommandRun = () => cxtMenu.hide()