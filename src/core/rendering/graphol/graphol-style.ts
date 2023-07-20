import { NodeSingular, SingularElementArgument, Stylesheet } from "cytoscape";
import { ColoursNames, DefaultThemesEnum, GrapholscapeTheme, Shape, TypesEnum } from "../../../model";

export default function (theme: GrapholscapeTheme) {
  return [
    {
      selector: 'node',
      style: {
        'height': (n) => n.data('height') || 40,
        'width': (n) => n.data('width') || 40,
        'background-color': (node) => getColor(node, ColoursNames.bg_node_light),
        'shape': 'data(shape)',
        'border-width': 1,
        'border-color': theme.getColour(ColoursNames.border_node),
        'border-style': 'solid',
        'font-size': 12,
        'color': theme.getColour(ColoursNames.label),
      }
    },

    {
      selector: '[fontSize]',
      style: {
        'font-size': 'data(fontSize)',
      }
    },

    {
      selector: 'node[displayedName]',
      style: {
        'label': 'data(displayedName)',
        'text-margin-x': (n) => n.data('labelXpos') || 0,
        'text-margin-y': (n) => n.data('labelYpos') || 0,
        'text-wrap': 'wrap',
        'min-zoomed-font-size': '5px',
      }
    },

    {
      selector: `node[displayedName][type = "${TypesEnum.CLASS}"], node[displayedName][type = "${TypesEnum.INDIVIDUAL}"]`,
      style: {
        'text-max-width': (n) => n.data('width') || 40,
      }
    },

    {
      selector: 'node[labelXcentered]',
      style: {
        'text-halign': 'center',
      }
    },

    {
      selector: 'node[labelYcentered]',
      style: {
        'text-valign': 'center',
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': theme.getColour(ColoursNames.edge),
        'target-arrow-color': theme.getColour(ColoursNames.edge),
        'source-arrow-color': theme.getColour(ColoursNames.edge),
        'curve-style': 'bezier',
        'arrow-scale': 1.3,
        'color': theme.getColour(ColoursNames.label),
      }
    },

    {
      selector: `edge[type = "${TypesEnum.INCLUSION}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.MEMBERSHIP}"]`,
      style: {
        'line-style': 'dashed',
        'line-dash-pattern': [2, 3],
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.INPUT}"]`,
      style: {
        'line-style': 'dashed',
        'target-arrow-shape': 'diamond',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.EQUIVALENCE}"]`,
      style: {
        'line-style': 'solid',
        'source-arrow-shape': 'triangle',
        'source-arrow-fill': 'filled',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
      }
    },

    {
      selector: '[segmentDistances]',
      style: {
        'curve-style': 'segments',
        'segment-distances': 'data(segmentDistances)',
        'segment-weights': 'data(segmentWeights)',
        'edge-distances': 'node-position'
      }
    },

    {
      selector: '[sourceEndpoint]',
      style: {
        'source-endpoint': 'data(sourceEndpoint)'
      }
    },

    {
      selector: '[targetEndpoint]',
      style: {
        'target-endpoint': 'data(targetEndpoint)'
      }
    },

    {
      selector: '[?functional][!inverseFunctional]',
      style: {
        'border-width': 5,
        'border-color': theme.getColour(ColoursNames.border_node),
        'border-style': 'double'
      }
    },

    {
      selector: '[?inverseFunctional][!functional]',
      style: {
        'border-width': 4,
        'border-color': theme.getColour(ColoursNames.border_node),
        'border-style': 'solid'
      }
    },

    {
      selector: 'edge[displayedName]',
      style: {
        'label': 'data(displayedName)',
        'font-size': 10,
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
      }
    },

    {
      selector: '[sourceLabel],[targetLabel]',
      style: {
        'font-size': 15,
        'target-text-offset': 20,
      }
    },

    {
      selector: '[targetLabel]',
      style: {
        'target-label': 'data(targetLabel)',
      }
    },

    {
      selector: '[sourceLabel]',
      style: {
        'source-label': 'data(sourceLabel)',
      }
    },

    {
      selector: 'edge[displayedName],[sourceLabel],[targetLabel],[text_background]',
      style: {
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
        'text-background-shape': 'roundrectangle',
        'text-background-padding': 2,
      }
    },

    {
      selector: '[shapePoints]',
      style: {
        'shape-polygon-points': 'data(shapePoints)'
      }
    },

    {
      selector: '.filtered',
      style: {
        'display': 'none'
      }
    },

    {
      selector: `[type = "${TypesEnum.FACET}"][!fake], .fake-bottom-rhomboid`,
      style: {
        'background-opacity': 0
      }
    },

    {
      selector: `.fake-top-rhomboid`,
      style: {
        'background-color': node => getColor(node, ColoursNames.bg_inset),
      }
    },

    {
      selector: `[type = "${TypesEnum.PROPERTY_ASSERTION}"][!fake]`,
      style: {
        'background-opacity': 0,
        'border-width': 0,
      }
    },

    {
      selector: '.hidden',
      style: {
        'visibility': 'hidden'
      }
    },

    {
      selector: '.no_border',
      style: {
        'border-width': 0
      }
    },

    {
      selector: '.no_overlay',
      style: {
        'overlay-opacity': 0,
        'overlay-padding': 0
      }
    },

    {
      selector: `node[type = "${TypesEnum.CLASS}"]`,
      style: {
        'background-color': node => getColor(node, ColoursNames.class),
        'border-color': theme.getColour(ColoursNames.class_contrast),
      }
    },

    {
      selector: `node[type = "${TypesEnum.OBJECT_PROPERTY}"], .fake-triangle`,
      style: {
        'background-color': node => getColor(node, ColoursNames.object_property),
        'border-color': theme.getColour(ColoursNames.object_property_contrast),
      }
    },

    {
      selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]`,
      style: {
        'background-color': node => getColor(node, ColoursNames.data_property),
        'border-color': theme.getColour(ColoursNames.data_property_contrast),
      }
    },

    {
      selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]:selected`,
      style: {
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
      }
    },

    {
      selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
      style: {
        'background-color': node => getColor(node, ColoursNames.individual),
        'border-color': theme.getColour(ColoursNames.individual_contrast),
      }
    },

    {
      selector: `[type = "${TypesEnum.RANGE_RESTRICTION}"], [type = "${TypesEnum.DISJOINT_UNION}"]`,
      style: {
        'background-color': theme.getColour(ColoursNames.bg_node_dark),
      }
    },

    { // the right border part of functional && inverseFunctional roles
      selector: '.fake-triangle-right',
      style: {
        'background-color': theme.getColour(ColoursNames.object_property_contrast) || 'black',
      }
    },

    {
      selector: `[shape = "${Shape.HEXAGON}"],[type = "${TypesEnum.VALUE_DOMAIN}"]`,
      style: {
        'color': theme.getColour(ColoursNames.bg_node_dark),
      }
    },

    {
      selector: ':active',
      style: {
        'underlay-color': theme.getColour(ColoursNames.accent),
        'underlay-opacity': 0.2,
        'overlay-opacity': 0,
        'z-index': '100',
        'underlay-shape': (node: SingularElementArgument) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE
      },
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: ':selected, :active',
      style: {
        'overlay-color': theme.getColour(ColoursNames.accent),
        'overlay-opacity': 0.2,
        'z-index': '100',
        'overlay-shape': (node: SingularElementArgument) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE
      }
    },
  ] as Stylesheet[]

  function getColor(node: NodeSingular, colour: ColoursNames): string {
    // take color from parsed XML source file
    if (theme.id === DefaultThemesEnum.GRAPHOL) {
      return node.data().fillColor
    }

    else {
      return theme.getColour(colour) || node.data().fillColor
    }
  }
}