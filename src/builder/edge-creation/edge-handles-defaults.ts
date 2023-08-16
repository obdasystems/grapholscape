import { TypesEnum } from "../../model"

export default (edgeType: TypesEnum, isReversed: boolean = false) => {
  return {
    canConnect: function (sourceNode: any, targetNode: any) {
      const sourceType = sourceNode.data('type')
      const targetType = targetNode.data('type')

      switch (sourceType) {

        case TypesEnum.CLASS:
          return targetType === TypesEnum.CLASS
        case TypesEnum.CLASS:
        case TypesEnum.UNION:
        case TypesEnum.DISJOINT_UNION:
          return targetType === TypesEnum.CLASS

        case TypesEnum.DATA_PROPERTY:
          return targetType === TypesEnum.DATA_PROPERTY

        default:
          return false
      }
    },
    edgeParams: function (sourceNode, targetNode) {
      let temp_id = 'temp_' + sourceNode.data('iri') + '-' + targetNode.data('iri')
      if (sourceNode.data('type') === TypesEnum.UNION || sourceNode.data('type') === TypesEnum.DISJOINT_UNION) {
        temp_id = 'temp_' + sourceNode.data('id') + '-' + targetNode.data('iri')
      }
      return {
        data: {
          id: temp_id,
          name: temp_id,
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