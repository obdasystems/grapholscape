import { Stylesheet } from "cytoscape";
import { GrapholTypesEnum, GrapholscapeTheme } from "../../../model";
import { ColoursNames } from "../../../style/themes";
import grapholStyle from "../graphol/graphol-style";

export default function (theme: GrapholscapeTheme) {
  const baseStyle = grapholStyle(theme)
  const liteStyle = [

    {
      selector: `edge[type = "${GrapholTypesEnum.INPUT}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'none',
      }
    },

    { // UNIONS AND DISJOINT UNIONS ARE EDGES IN GRAPHOL-LITE
      selector: `[type = "${GrapholTypesEnum.UNION}"], [type = "${GrapholTypesEnum.DISJOINT_UNION}"]`,
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

    { // DOMAIN-RANGE RESTRICTIONS ARE EDGES IN GRAPHOL-LITE
      selector: `[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"], [type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
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
      selector: `[type = "${GrapholTypesEnum.RANGE_RESTRICTION}"]`,
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: `[type = "${GrapholTypesEnum.DOMAIN_RESTRICTION}"]`,
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

  ] as Stylesheet[]

  return baseStyle.concat(liteStyle)
}