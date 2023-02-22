import { Grapholscape } from "../../core"
import { WidgetEnum } from "../util/widget-enum"
import GscapeIncrementalDetails from "./incremental-details"

export { GscapeIncrementalDetails as GscapeIncrementalMenu }

export * as IncrementalCommands from '../../incremental/ui/commands-widget/commands'

export * from './view-model'

export default function initIncrementalMenu(grapholscape: Grapholscape) {
  const incrementalMenu = new GscapeIncrementalDetails()
  // const instancesExplorer = new GscapeInstanceExplorer()
//   // grapholscape.on(LifecycleEvent.NodeSelection, node => {
//   //   if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL)
//   //     cxtMenuWidget.attachTo((grapholscape.renderer.cy.$id(node.id) as any).popperRef(), [])
//   // })

  grapholscape.widgets.set(WidgetEnum.CLASS_INSTANCE_DETAILS, incrementalMenu)
  // grapholscape.widgets.set(WidgetEnum.INSTANCES_EXPLORER, instancesExplorer)
}