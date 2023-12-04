import { Stylesheet } from "cytoscape";
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../../model";
import grapholStyle from "../graphol/graphol-style";

export default function (theme: GrapholscapeTheme) {
  const baseStyle = grapholStyle(theme)
  const liteStyle = [

    {
      selector: `edge[type = "${TypesEnum.INPUT}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'none',
      }
    },

    { // UNIONS AND DISJOINT UNIONS ARE EDGES IN GRAPHOL-LITE
      selector: `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`,
      style: {
        'label': '',
        'width': 0.1,
        'height': 0.1,
      }
    },

    { // UNIONS AND DISJOINT UNIONS ARE EDGES IN GRAPHOL-LITE
      selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
      style: {
        'width': 6,
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
      style: {
        'target-label': 'C',
        'font-size': 15,
        'target-text-offset': 20,
        'text-background-color': theme.getColour(ColoursNames.bg_graph),
        'text-background-opacity': 1,
        'text-background-shape': 'roundrectangle',
        'text-background-padding': 2,
      }
    },

    {
      selector: `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"]`,
      style: {
        'target-arrow-fill': 'hollow',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`,
      style: {
        'target-arrow-fill': 'filled',
      }
    },

    { // DOMAIN-RANGE RESTRICTIONS ARE EDGES IN GRAPHOL-LITE
      selector: `[type = "${TypesEnum.DOMAIN_RESTRICTION}"], [type = "${TypesEnum.RANGE_RESTRICTION}"]`,
      style: {
        'line-color' : theme.getColour(ColoursNames.object_property_contrast),
        'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
      }
    },

    {
      selector: `[type = "${TypesEnum.RANGE_RESTRICTION}"]`,
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: `[type = "${TypesEnum.DOMAIN_RESTRICTION}"]`,
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'hollow',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.DATA_PROPERTY}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.data_property_contrast),
        'source-arrow-shape': 'none',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: `edge[type = "${TypesEnum.ROLE_INVERSE}"]`,
      style: {
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'text-rotation': 'autorotate',
      }
    },

  ] as Stylesheet[]

  return baseStyle.concat(liteStyle)
}