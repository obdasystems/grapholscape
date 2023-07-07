import { NodeSingular } from "cytoscape"
import { GrapholTypesEnum } from "../model"

export const shortestPathOptions = {
  canConnect: function (sourceNode: NodeSingular, targetNode: NodeSingular) {
    const sourceType = sourceNode.data('type')
    const targetType = targetNode.data('type')

    return sourceType === targetType && sourceType === GrapholTypesEnum.CLASS
  },
  edgeParams: function (sourceNode: NodeSingular, targetNode: NodeSingular) {
    return {
      data: {
        id: `${sourceNode.id()}-temp-shortest-path-${targetNode.id()}`,
        source: sourceNode.id(),
        target: targetNode.id(),
        type: 'shortest-path-preview'
      }
    }
  }
  ,
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
}