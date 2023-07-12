import { Stylesheet } from "cytoscape"
import { GrapholscapeTheme, GrapholTypesEnum, ColoursNames } from "../../../model"
import floatyStyle from "../floaty/floaty-style"

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
      selector: `node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`,
      style: {
        backgroundColor: theme.getColour(ColoursNames.class_instance),
        "border-color": theme.getColour(ColoursNames.class_instance_contrast),
      }
    },

    {
      selector: `node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]:selected`,
      style: {
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
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
    }

  ] as Stylesheet[]

  return baseStyle.concat(incrementalStyle)
}