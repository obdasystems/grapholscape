import chroma from "chroma-js"
import { NodeSingular, Stylesheet } from "cytoscape"
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../../model"
import { OntologyColorManager } from "../../colors-manager"
import floatyStyle from "../floaty/floaty-style"
import { getNodeBodyColor, getNodeBorderColor, getNodeLabelColor } from "../style-util"

export default function (theme: GrapholscapeTheme) {
  const baseStyle = floatyStyle(theme)
  const incrementalStyle = [
    {
      selector: '.incremental-expanded-class',
      style: {
        'border-width': 4,
        'background-blacken': 0.1,
      }
    },

    {
      selector: `node[type = "${TypesEnum.CLASS}"]`,
      style: {
        // 'text-background-color': (node) => getNodeBodyColor(node, theme, true) || 'rgba(0, 0, 0, 0)',
        // 'text-background-opacity': (node) => getNodeBodyColor(node, theme, true) ? 1 : 0,
        // 'text-background-shape': 'roundrectangle',
        // 'text-background-padding': 2,
        color: (node) => getNodeLabelColor(node, theme)
      }
    },
    {
      selector: `node[type = "${TypesEnum.CLASS_INSTANCE}"], node[type = "${TypesEnum.CLASS}"]`,
      style: {
        backgroundColor: (node) => getNodeBodyColor(node, theme, true),
        "border-color": (node) => getNodeBorderColor(node, theme, true),
      }
    },

    {
      selector: `node[type = "${TypesEnum.CLASS_INSTANCE}"]:selected`,
      style: {
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
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
      selector: `.unknown-parent-class`,
      style: {
        backgroundColor: theme.getColour(ColoursNames.neutral)
      }
    },

    {
      selector: '.path',
      style: {
        'underlay-opacity': 0.5,
        'underlay-color': theme.getColour(ColoursNames.success_subtle),
        'underlay-shape': 'ellipse'
      }
    },

    {
      selector: '.loading-edge',
      style: {
        width: 4,
        "line-color": theme.getColour(ColoursNames.neutral),
        "transition-property": "line-color target-arrow-color",
        "transition-duration": '0.5s',
        'text-rotation': 'autorotate',
        'target-arrow-color': theme.getColour(ColoursNames.neutral),
        'font-size': 12,
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        label: 'Loading...',
      }
    },

    {
      selector: '.loading-edge[?on]',
      style: {
        "line-color": theme.getColour(ColoursNames.accent),
        "target-arrow-color": theme.getColour(ColoursNames.accent)
      }
    },

    {
      selector: '.eh-ghost-edge, edge.eh-preview',
      style: {
        'width': 4,
        'label': 'Find path to...',
        'line-color': theme.getColour(ColoursNames.accent),
        'target-arrow-color': theme.getColour(ColoursNames.accent),
        'target-arrow-shape': 'triangle',
        'opacity': 0.8,
        'text-rotation': 'autorotate',
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
        'border-color': theme.getColour(ColoursNames.accent),
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

  ] as Stylesheet[]

  return baseStyle.concat(incrementalStyle)
}