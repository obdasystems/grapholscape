import { NodeSingular, StylesheetJson } from "cytoscape";
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../../model";
import grapholStyle from "../graphol/graphol-style";
import { getNodeBodyColor, getNodeBorderColor, getNodeLabelColor } from "../style-util";

export default function (theme: GrapholscapeTheme): StylesheetJson {
  const baseStyle = grapholStyle(theme)
  const floatyStyle: StylesheetJson = [

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
        'height': (node) => node.data('width') || 80,
        'width': (node) => node.data('width') || 80,
        // 'text-background-color': (node) => getNodeBodyColor(node, theme) || 'rgba(0, 0, 0, 0)',
        // 'text-background-opacity': (node) => getNodeBodyColor(node, theme) ? 1 : 0,
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '2',
        color: (node: NodeSingular) => getNodeLabelColor(node, theme) || '',
        backgroundColor: (node) => getNodeBodyColor(node, theme) || theme.getColour(ColoursNames.class),
        "border-color": (node) => getNodeBorderColor(node, theme) || theme.getColour(ColoursNames.class_contrast) || '',
      }
    },
    {
      selector: `node[type = "${TypesEnum.DATA_PROPERTY}"]`,
      style: {
        'height': (node) => node.data('width') || 20,
        'width': (node) => node.data('width') || 20
      }
    },
    {
      selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
      style: {
        'height': (node) => node.data('width') || 60,
        'width': (node) => node.data('width') || 60,
        backgroundColor: (node) => getNodeBodyColor(node, theme) || theme.getColour(ColoursNames.individual),
        "border-color": (node) => getNodeBorderColor(node, theme) || theme.getColour(ColoursNames.individual_contrast) || '',
      }
    },
    {
      selector: `edge[type = "${TypesEnum.INSTANCE_OF}"]`,
      style: {
        "target-arrow-shape": 'triangle',
        'target-arrow-fill': 'filled',
        'line-color': theme.getColour(ColoursNames.individual_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.individual_contrast),
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
      selector: `[type = "${TypesEnum.OBJECT_PROPERTY}"], [type = "${TypesEnum.ANNOTATION_PROPERTY}"]`,
      style: {
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
        'width': 4,
      }
    },

    {
      selector: `[type = "${TypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.object_property_contrast),
        'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
      }
    },

    {
      selector: `[type = "${TypesEnum.ANNOTATION_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.annotation_property_contrast),
        'source-arrow-color': theme.getColour(ColoursNames.annotation_property_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.annotation_property_contrast),
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
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
        'text-background-shape': 'roundrectangle',
        'text-background-padding': '2',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
      style: {
        'target-label': 'C',
      }
    },

    {
      selector: ':loop',
      style: {
        'control-point-step-size': 80,
        'control-point-weight': 0.5,
      }
    },

    // DOMAIN DP

    {
      selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainMandatory][!domainTyped]:selected`,
      style: {
        'source-label': 'M'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][!domainMandatory]:selected`,
      style: {
        'source-label': 'T'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.ATTRIBUTE_EDGE}"][?domainTyped][?domainMandatory]:selected`,
      style: {
        'source-label': 'TM'
      }
    },

    // DOMAIN OP

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainMandatory][!domainTyped]:selected`,
      style: {
        'source-label': 'M'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainTyped][!domainMandatory]:selected`,
      style: {
        'source-label': 'T'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?domainTyped][?domainMandatory]:selected`,
      style: {
        'source-label': 'TM'
      }
    },

    // RANGE OP

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeMandatory][!rangeTyped]:selected`,
      style: {
        'target-label': 'M'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeTyped][!rangeMandatory]:selected`,
      style: {
        'target-label': 'T'
      }
    },

    {
      selector: `edge[type = "${TypesEnum.OBJECT_PROPERTY}"][?rangeTyped][?rangeMandatory]:selected`,
      style: {
        'target-label': 'TM'
      }
    },

    {
      selector: `node[icon]`,
      style: {
        'background-image': 'data(icon)',
        'text-valign': 'top',
        'color': theme.getColour(ColoursNames.label),
        'background-width': '100%',
        'background-height': '100%',
        'background-image-crossorigin': "null" as any,
      }
    },

    // {
    //   selector: `node[icon][type = "${TypesEnum.CLASS}"]`,
    //   style: {
    //     'background-width': '50%',
    //     'background-height': '50%',
    //   }
    // },

    // {
    //   selector: `node[icon][type = "${TypesEnum.INDIVIDUAL}"]`,
    //   style: {
    //     'background-width': '100%',
    //     'background-height': '100%',
    //   }
    // },

    {
      selector: '[?pinned]',
      style: {
        'border-width': 4,
      }
    },

  ]

  return baseStyle.concat(floatyStyle)
}

// function getNodeBodyColor(node: NodeSingular, theme: GrapholscapeTheme) {
//   if ((theme.id === DefaultThemesEnum.COLORFUL_LIGHT || theme.id === DefaultThemesEnum.COLORFUL_DARK) && node.data().computedFillColor) {
//     if (ColorManager.isBackgroundDark(theme)) {
//       const color = chroma(node.data().computedFillColor)
//       if (color.luminance() > 0.5) {
//         color.luminance(0.5, 'lab')
//       }

//       return color.desaturate().darken().css()
//     } else {
//       return node.data().computedFillColor
//     }
//   }
// }

// function getNodeBorderColor(node: NodeSingular, theme: GrapholscapeTheme) {
//   if ((theme.id === DefaultThemesEnum.COLORFUL_LIGHT || theme.id === DefaultThemesEnum.COLORFUL_DARK) && node.data().computedFillColor) {
//     if (ColorManager.isBackgroundDark(theme)) {
//       return chroma(node.data().computedFillColor).css()
//     } else {
//       return chroma(node.data().computedFillColor).darken(2).css()
//     }
//   }
// }