import { NodeSingular } from "cytoscape"
import { TypesEnum } from "../../model"

export default (edgeType: TypesEnum, isReversed: boolean = false) => {
  return {
    canConnect: function (sourceNode: NodeSingular, targetNode: NodeSingular) {
      const sourceType = sourceNode.data('type')
      const targetType = targetNode.data('type')
      // return false if there are duplicates
      // object properties can have duplicates between same nodes
      if (edgeType !== TypesEnum.OBJECT_PROPERTY) {
        const edges = !isReversed 
          ? sourceNode.edgesTo(targetNode)
          : targetNode.edgesTo(sourceNode)
          
        if(edges.filter(e => e.data().type === edgeType).nonempty())
          return false
      }

      switch (sourceType) {

        case TypesEnum.UNION:
        case TypesEnum.DISJOINT_UNION:
          return targetType === TypesEnum.CLASS

        case TypesEnum.CLASS:
        case TypesEnum.INDIVIDUAL:
        case TypesEnum.CLASS_INSTANCE:
          return ((targetType === TypesEnum.INDIVIDUAL || targetType === TypesEnum.CLASS_INSTANCE) && edgeType === TypesEnum.OBJECT_PROPERTY) || targetType === TypesEnum.CLASS

        case TypesEnum.DATA_PROPERTY:
          return (targetType === TypesEnum.DATA_PROPERTY && edgeType === TypesEnum.INCLUSION) || (targetType === TypesEnum.CLASS && edgeType === TypesEnum.ATTRIBUTE_EDGE)

        default:
          return false
      }
    },
    edgeParams: function (sourceNode, targetNode) {
      return {
        data: {
          source: !isReversed ? sourceNode.id() : targetNode.id(),
          target: !isReversed ? targetNode.id() : sourceNode.id(),
          type: edgeType,
          targetLabel: edgeType === TypesEnum.COMPLETE_UNION ||
            edgeType === TypesEnum.COMPLETE_DISJOINT_UNION ? 'C' : undefined,
        }
      }
    },
    hoverDelay: 150, // time spent hovering over a target node before it is considered selected
    snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    snapThreshold: 30, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  }
}