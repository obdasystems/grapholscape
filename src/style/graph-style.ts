import { CssStyleDeclaration } from "cytoscape";
import { Shape, GrapholTypesEnum } from "../model/graphol-elems/node-enums";
import GrapholTheme from '../model/theme'
import { ColoursNames } from "./themes";

export function getGraphStyle(theme: GrapholTheme) {
  return [
    {
      selector: 'node',
      style: {
        'height': 'data(height)',
        'width': 'data(width)',
        'background-color': theme.getColour(ColoursNames.node_bg),
        'shape': 'data(shape)',
        'border-width': 1,
        'border-color': theme.getColour(ColoursNames.node_border),
        'border-style': 'solid',
        'font-size': 12,
        'color': theme.getColour(ColoursNames.label_color),
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
        'color': theme.getColour(ColoursNames.label_color),
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
      selector: `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
      style: {
        'width': 6,
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.UNION}"]`,
      style: {
        'target-arrow-fill': 'hollow',
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
      style: {
        'target-arrow-fill': 'filled',
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
      selector: ':loop',
      style: {
        'control-point-step-size': 'data(control_point_step_size)',
        'control-point-weight': 0.5,
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
        'border-color': theme.getColour(ColoursNames.node_border),
        'border-style': 'double'
      }
    },

    {
      selector: '[?inverseFunctional][!functional]',
      style: {
        'border-width': 4,
        'border-color': theme.getColour(ColoursNames.node_border),
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
      selector: '[sourceLabel],[targetLabel]',
      style: {
        'font-size': 15,
        'target-text-offset': 20,
      }
    },

    {
      selector: 'edge[displayedName],[sourceLabel],[targetLabel],[text_background]',
      style: {
        'text-background-color': theme.getColour(ColoursNames.background),
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
      selector: `.${GrapholTypesEnum.CLASS}`,
      style: {
        'background-color': theme.getColour(ColoursNames.concept),
        'border-color': theme.getColour(ColoursNames.concept_dark),
      }
    },

    {
      selector: `.${GrapholTypesEnum.OBJECT_PROPERTY}, .fake-triangle`,
      style: {
        'background-color': theme.getColour(ColoursNames.role),
        'border-color': theme.getColour(ColoursNames.role_dark),
      }
    },

    {
      selector: `.${GrapholTypesEnum.DATA_PROPERTY}`,
      style: {
        'background-color': theme.getColour(ColoursNames.attribute),
        'border-color': theme.getColour(ColoursNames.attribute_dark),
      }
    },

    {
      selector: `.${GrapholTypesEnum.DATA_PROPERTY}:selected`,
      style: {
        'text-background-color': theme.getColour(ColoursNames.background),
        'text-background-opacity': 1,
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"], edge[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
      style: {
        'line-color' : theme.getColour(ColoursNames.role_dark),
        'source-arrow-color': theme.getColour(ColoursNames.role_dark),
        'target-arrow-color': theme.getColour(ColoursNames.role_dark),
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'width': 4,
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"]`,
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'hollow',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.attribute_dark),
        'source-arrow-shape': 'none',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: '.bubble',
      style: {
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign' : 'center',
        'text-halign' : 'center',
        'shape': 'ellipse',
        'height': 'data(width)'
      }
    },

    {
      selector: `.${GrapholTypesEnum.INDIVIDUAL}`,
      style: {
        'background-color': theme.getColour(ColoursNames.individual),
        'border-color': theme.getColour(ColoursNames.individual_dark),
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"], [type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
      style: {
        'background-color': theme.getColour(ColoursNames.node_bg_contrast),
      }
    },

    {
      selector: '.float:locked',
      style: {
        'border-width' : '4px',
      }
    },

    {
      selector: '.float[?pinned]',
      style: {
        'border-color' : theme.getColour(ColoursNames.secondary),
      }
    },

    { // the right border part of functional && inverseFunctional roles
      selector: '.fake-triangle-right',
      style: {
        'background-color': theme.getColour(ColoursNames.role_dark) || 'black',
      }
    },

    {
      selector: `[shape = "${Shape.HEXAGON}"],[type = "${GrapholTypesEnum.VALUE_DOMAIN}"], .${GrapholTypesEnum.FACET}`,
      style: {
        'color': theme.getColour(ColoursNames.node_bg_contrast),
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: ':selected',
      style: {
        'overlay-color': theme.getColour(ColoursNames.secondary),
        'overlay-opacity': 0.2,
        'z-index': '100'
      }
    },
  ] as CssStyleDeclaration[]
}