import { NodeSingular } from "cytoscape";
import { LifecycleEvent, RendererStatesEnum } from "../../../model";
import { GscapeButton, icons } from "../../../ui";
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin";
import getIconSlot from "../../../ui/util/get-icon-slot";
import IncrementalController from "../../controller";
import NodeButton from "./node-button";

export function NodeButtonsFactory(incrementalController: IncrementalController) {

  const btn = new NodeButton()
  btn.appendChild(getIconSlot('icon', icons.instancesIcon))
  btn.style.setProperty('--gscape-border-radius-btn', '25%')

  incrementalController.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      incrementalController.grapholscape.renderer.cy?.on('mouseover', 'node', (e) => {
        const targetNode = e.target

        btn.attachTo(targetNode.popperRef())
      })
    }
  })

  
}