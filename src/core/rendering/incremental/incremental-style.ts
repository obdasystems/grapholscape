import { StylesheetJson } from "cytoscape"
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../../model"
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
      selector: `node[type = "${TypesEnum.INDIVIDUAL}"]`,
      style: {
        'text-valign': 'top',
        'text-wrap': 'ellipsis',
        'text-max-width': 180,
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
      selector: `.unknown-parent-class`,
      style: {
        backgroundColor: theme.getColour(ColoursNames.neutral),
        opacity: 0.6,
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
        'label': 'Find shortest paths to...',
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

    {
      selector: "node.localized",
      style: {
        "border-color": theme.getColour(ColoursNames.danger_muted),
        "border-width": 4,
      }
    },

    {
      selector: 'edge.localized',
      style: {
        "width": 2,
      }
    }


  ] as StylesheetJson

  return baseStyle.concat(incrementalStyle)
}