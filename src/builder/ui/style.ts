import { Core, Css, Stylesheet } from "cytoscape";
import getFloatyStyle from "../../core/rendering/floaty/floaty-style";
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../model";

export function setDesignerStyle(cy: Core, theme: GrapholscapeTheme) {
  const edgeCreationType = cy.scratch('edge-creation-type')
  const edgeCreationLabel = cy.scratch('edge-creation-label')
  const edgeCreationReversed = cy.scratch('edge-creation-reversed')
  let edgeHandlingStyle: Stylesheet[] = []
  if(edgeCreationType !== undefined) {
    edgeHandlingStyle = getEdgeHandlingStyle(theme, edgeCreationType as TypesEnum, edgeCreationLabel, edgeCreationReversed)
  }
  /**
   * Update style to change ghost edge styling based on edge-creation-type.
   * Could be done assigning here the type field to the ghost edge
   * but this event is fired before the creation of such edge, should use
   * a long enough timeout but trying it results in a poor UX.
   * So just update style with new values for .eh-ghost-edge.
   */
  (cy as any).style().resetToDefault().fromJson([
    ...getFloatyStyle(theme),
    ...getDesignerBaseStyle(theme),
    ...edgeHandlingStyle,
  ]).update()
}

export function getDesignerBaseStyle(theme: GrapholscapeTheme): Stylesheet[] {
  return [
    {
      selector: '.anchor-node',
      style: {
        height: 10,
        width: 10,
      }
    },
    {
      selector: 'edge.editing',
      style: {
        display: 'none',
      }
    }
  ]
}

/**
 * Apply stylesheet for edge handling during edge drawing in builder
 * @param cy cytoscape instance
 * @param theme current grapholscape's theme
 * @param creationEdgeType the kind of edge that is going to be shown
 * @param creationEdgeLabel the label to apply to the ghost edge
 */
export function getEdgeHandlingStyle(theme: GrapholscapeTheme, creationEdgeType: TypesEnum, creationEdgeLabel?: string, creationEdgeReversed = false) {
  const ehGhostEdgeStyles: { [x in TypesEnum]?: Css.Edge } = {
    [TypesEnum.INCLUSION]: {
      'target-arrow-shape': 'triangle',
    },
    [TypesEnum.OBJECT_PROPERTY]: {
      'line-color': theme.getColour(ColoursNames.object_property_contrast),
      'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
      'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'source-arrow-shape': 'square',
      'source-arrow-fill': 'hollow',
      'width': 4,
    },
    [TypesEnum.INPUT]: {
      'line-style': 'solid',
      'target-arrow-shape': 'none',
    },
    [TypesEnum.INSTANCE_OF]: {
      "target-arrow-shape": 'triangle',
      'target-arrow-fill': 'filled',
      'line-color': theme.getColour(ColoursNames.individual),
      'target-arrow-color': theme.getColour(ColoursNames.individual_contrast),
      'line-opacity': 0.4,
    },
    [TypesEnum.UNION]: {
      'width': 6,
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'hollow',
    },
    [TypesEnum.COMPLETE_UNION]: {
      'width': 6,
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'hollow',
      'target-label': "C",
      'text-background-color': theme.getColour(ColoursNames.bg_graph),
      'text-background-opacity': 1,
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2',
      'font-size': 15,
      'target-text-offset': 20,
    },
    [TypesEnum.DISJOINT_UNION]: {
      'width': 6,
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
    },
    [TypesEnum.COMPLETE_DISJOINT_UNION]: {
      'width': 6,
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'target-label': "C",
      'text-background-color': theme.getColour(ColoursNames.bg_graph),
      'text-background-opacity': 1,
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '2',
      'font-size': 15,
      'target-text-offset': 20,
    },
  }

  // Base style valid for any kind of ghost edge
  const ehGhostEdgeStyle: Css.Edge = {
    'opacity': 0.8,
    'text-rotation': 'autorotate',
    'label': creationEdgeLabel
  }

  // apply styling based on ghost edge type
  const ehGhostStyleByType = ehGhostEdgeStyles[creationEdgeType]
  if (ehGhostStyleByType) {
    if (creationEdgeReversed) {
      // reverse style of arrows
      const copy = JSON.parse(JSON.stringify(ehGhostStyleByType))

      ehGhostStyleByType['source-arrow-color'] = ehGhostStyleByType['target-arrow-color']
      ehGhostStyleByType['source-arrow-fill'] = ehGhostStyleByType['target-arrow-fill']
      ehGhostStyleByType['source-arrow-shape'] = ehGhostStyleByType['target-arrow-shape']
      ehGhostStyleByType['source-label'] = ehGhostStyleByType['target-label']
      ehGhostStyleByType['source-text-offset'] = ehGhostStyleByType['target-text-offset']

      ehGhostStyleByType['target-arrow-color'] = copy['source-arrow-color']
      ehGhostStyleByType['target-arrow-fill'] = copy['source-arrow-fill']
      ehGhostStyleByType['target-arrow-shape'] = copy['source-arrow-shape']
      ehGhostStyleByType['target-label'] = copy['source-label']
      ehGhostStyleByType['target-text-offset'] = copy['source-text-offset']
    }
    Object.assign(ehGhostEdgeStyle, ehGhostStyleByType)
  }

  const ehStyle = [
    {
      selector: '.eh-ghost-edge',
      style: ehGhostEdgeStyle
    },

    {
      selector: 'edge.eh-preview',
      style: {
        label: creationEdgeLabel
      }
    },

    {
      selector: '.eh-ghost-edge.eh-preview-active',
      style: {
        'opacity': 0,
      }
    },

    {
      selector: '.eh-target, .eh-source',
      style: {
        'border-width': 4,
      }
    },

    {
      selector: '.eh-presumptive-target',
      style: {
        'opacity': 1,
      }
    },

    {
      selector: '.eh-not-target',
      style: {
        'opacity': 0.4,
      }
    },
  ];

  return ehStyle
}