import { Stylesheet } from "cytoscape";
import { GrapholTypesEnum, GrapholscapeTheme } from "../../../model";
import { ColoursNames } from "../../../style/themes";
import grapholStyle from "../graphol/graphol-style";

export default function (theme: GrapholscapeTheme) {
  const baseStyle = grapholStyle(theme)
  const liteStyle = [

    {
      selector: 'node',
      style: {
        'shape': 'ellipse',
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.CONCEPT}"]`,
      style: {
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign': 'center',
        'text-halign': 'center',
        'height': 'data(width)'
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
      selector: `[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.role_dark),
        'source-arrow-color': theme.getColour(ColoursNames.role_dark),
        'target-arrow-color': theme.getColour(ColoursNames.role_dark),
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

  ] as Stylesheet[]

  return baseStyle.concat(liteStyle)
}