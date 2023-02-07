import { Grapholscape } from "../../core"
import { WidgetEnum } from "../util/widget-enum"
import GscapeIncrementalDetails from "./incremental-details"

export { GscapeIncrementalDetails as GscapeIncrementalMenu }

export * as IncrementalCommands from './commands'

export * from './view-model'

export default function initIncrementalMenu(grapholscape: Grapholscape) {
  const incrementalMenu = new GscapeIncrementalDetails()

//   // grapholscape.on(LifecycleEvent.NodeSelection, node => {
//   //   if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL)
//   //     cxtMenuWidget.attachTo((grapholscape.renderer.cy.$id(node.id) as any).popperRef(), [])
//   // })

  grapholscape.widgets.set(WidgetEnum.INCREMENTAL_MENU, incrementalMenu)
}