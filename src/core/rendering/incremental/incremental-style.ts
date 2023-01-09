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
        'target-arrow-color': theme.getColour(ColoursNames.class_instance_contrast)
      }
    }

  ] as Stylesheet[]

  return baseStyle.concat(incrementalStyle)
}