import { Stylesheet } from "cytoscape";
import { GrapholTypesEnum, GrapholscapeTheme, ColoursNames } from "../../../model";
import grapholStyle from "../graphol/graphol-style";

export default function (theme: GrapholscapeTheme) {
  const baseStyle = grapholStyle(theme)
  const floatyStyle = [

    {
      selector: 'node',
      style: {
        'shape': 'ellipse',
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.CLASS}"]`,
      style: {
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign': 'center',
        'text-halign': 'center',
        'height': (node)=>  node.data('width') || 100,
        'width' : (node)=>  node.data('width') || 100
      }
    },
    {
      selector: `node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
      style: {
        'height': (node)=>  node.data('width') || 20,
        'width' : (node)=>  node.data('width') || 20
      }
    },
    {
      selector: `node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`,
      style: {
        backgroundColor: theme.getColour(ColoursNames.class_instance),
        "border-color": theme.getColour(ColoursNames.class_instance_contrast),
      }
    },
    {
      selector: `edge[type = "${GrapholTypesEnum.INSTANCE_OF}"]`,
      style: {
        "target-arrow-shape": 'triangle',
        'target-arrow-fill': 'filled',
        'line-color': theme.getColour(ColoursNames.class_instance_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.class_instance_contrast),
        'line-opacity': 0.4,
      }
    },
    {
      selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: `[displayedName][type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'label': (elem) => elem.data().displayedName.replace(/\r?\n|\r/g, '')
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.object_property_contrast),
        'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
        'width': 4,
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
      style: {
        'width': 35,
        'height': 35,
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
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
      style: {
        'target-arrow-fill': 'filled',
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
      selector: '[?pinned]',
      style: {
        'border-width': 4,
      }
    },

  ] as Stylesheet[]

  return baseStyle.concat(floatyStyle)
}