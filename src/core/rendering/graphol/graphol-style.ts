import { Stylesheet } from "cytoscape";
import { ColoursNames, GrapholscapeTheme, GrapholTypesEnum, Shape } from "../../../model";

export default function(theme: GrapholscapeTheme) {
  return [
    {
      selector: 'node',
      style: {
        'height': 'data(height)',
        'width': 'data(width)',
        'background-color': theme.getColour(ColoursNames.bg_node_light),
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
        'font-size' : 'data(fontSize)',
      }
    },

    {
      selector: 'node[displayedName]',
      style: {
        'label': 'data(displayedName)',
        'text-margin-x': 'data(labelXpos)',
        'text-margin-y': 'data(labelYpos)',
        'text-wrap': 'wrap',
        'min-zoomed-font-size' : '5px',
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
      selector: `edge[type = "${GrapholTypesEnum.INCLUSION}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled'
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.MEMBERSHIP}"]`,
      style: {
        'line-style': 'dashed',
        'line-dash-pattern': [2,3],
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
      style: {
        'line-style': 'dashed',
        'target-arrow-shape': 'diamond',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.EQUIVALENCE}"]`,
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
        'text-background-padding' : 2,
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
      selector: `.${GrapholTypesEnum.FACET}`,
      style: {
        'background-opacity': 0
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
      selector: `node[type = "${GrapholTypesEnum.CLASS}"]`,
      style: {
        'background-color': theme.getColour(ColoursNames.class),
        'border-color': theme.getColour(ColoursNames.class_contrast),
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"], .fake-triangle`,
      style: {
        'background-color': theme.getColour(ColoursNames.object_property),
        'border-color': theme.getColour(ColoursNames.object_property_contrast),
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
      style: {
        'background-color': theme.getColour(ColoursNames.data_property),
        'border-color': theme.getColour(ColoursNames.data_property_contrast),
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]:selected`,
      style: {
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.INDIVIDUAL}"]`,
      style: {
        'background-color': theme.getColour(ColoursNames.individual),
        'border-color': theme.getColour(ColoursNames.individual_contrast),
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"], [type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
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
      selector: `[shape = "${Shape.HEXAGON}"],[type = "${GrapholTypesEnum.VALUE_DOMAIN}"]`,
      style: {
        'color': theme.getColour(ColoursNames.bg_node_dark),
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: ':selected',
      style: {
        'overlay-color': theme.getColour(ColoursNames.accent),
        'overlay-opacity': 0.2,
        'z-index': '100'
      }
    },
  ] as Stylesheet[]
}