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

  ] as Stylesheet[]

  return baseStyle.concat(incrementalStyle)
}