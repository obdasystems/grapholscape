import { NodeSingular } from "cytoscape"
import { GrapholTypesEnum } from "../model"

export const edgeHandlesOptions = {
  canConnect: function (sourceNode: NodeSingular, targetNode: NodeSingular) {
    const sourceType = sourceNode.data('type')
    const targetType = targetNode.data('type')

    const isTypeValid = (type: GrapholTypesEnum) => type === GrapholTypesEnum.CLASS || type === GrapholTypesEnum.CLASS_INSTANCE

    return sourceNode !== targetNode && isTypeValid(sourceType) && isTypeValid(targetType)
  },
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
}