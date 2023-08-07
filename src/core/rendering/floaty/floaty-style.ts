import { Stylesheet } from "cytoscape";
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../../model";
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
      selector: `[type = "${TypesEnum.CLASS}"]`,
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
      selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]`,
      style: {
        'height': (node)=>  node.data('width') || 20,
        'width' : (node)=>  node.data('width') || 20
      }
    },
    {
      selector: `node[type = "${TypesEnum.CLASS_INSTANCE}"]`,
      style: {
        backgroundColor: theme.getColour(ColoursNames.class_instance),
        "border-color": theme.getColour(ColoursNames.class_instance_contrast),
      }
    },
    {
      selector: `edge[type = "${TypesEnum.INSTANCE_OF}"]`,
      style: {
        "target-arrow-shape": 'triangle',
        'target-arrow-fill': 'filled',
        'line-color': theme.getColour(ColoursNames.class_instance_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.class_instance_contrast),
        'line-opacity': 0.4,
      }
    },
    {
      selector: `edge[type = "${TypesEnum.INPUT}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: `[displayedName][type = "${TypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'label': (elem) => elem.data().displayedName.replace(/\r?\n|\r/g, '')
      }
    },

    {
      selector: `[type = "${TypesEnum.OBJECT_PROPERTY}"]`,
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
      selector: `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`,
      style: {
        'width': 35,
        'height': 35,
      }
    },

    {
      selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
      style: {
        'width': 6,
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.UNION}"]`,
      style: {
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.DISJOINT_UNION}"]`,
      style: {
        'target-arrow-fill': 'filled',
      }
    },

    {
      selector: ':loop',
      style: {
        'control-point-step-size': 80,
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