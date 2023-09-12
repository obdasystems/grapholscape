import chroma from "chroma-js"
import { NodeSingular } from "cytoscape"
import { ColoursNames, DefaultThemesEnum, GrapholscapeTheme } from "../../model"

export function getNodeBodyColor(node: NodeSingular, theme: GrapholscapeTheme, ignoreTheme = false) {
  let shouldUseComputedColor: boolean = node.data().computedFillColor !== undefined

  if (!ignoreTheme) {
    shouldUseComputedColor = shouldUseComputedColor && (
      theme.id === DefaultThemesEnum.COLORFUL_LIGHT ||
      theme.id === DefaultThemesEnum.COLORFUL_DARK
    )
  }

  if (shouldUseComputedColor) {
    if (isThemeDark(theme)) {
      const color = chroma(node.data().computedFillColor)
      const darkenFactor = color.luminance()
      if (color.luminance() > 0.2) {
        color.luminance(0.2, 'lab')
      }

      return color.desaturate(0.1).darken(darkenFactor).css()
    } else {
      return node.data().computedFillColor
    }
  }
}

export function getNodeBorderColor(node: NodeSingular, theme: GrapholscapeTheme, ignoreTheme = false) {
  let shouldUseComputedColor: boolean = node.data().computedFillColor !== undefined

  if (!ignoreTheme) {
    shouldUseComputedColor = shouldUseComputedColor && (
      theme.id === DefaultThemesEnum.COLORFUL_LIGHT ||
      theme.id === DefaultThemesEnum.COLORFUL_DARK
    )
  }

  if (shouldUseComputedColor) {
    if (isThemeDark(theme)) {
      return chroma(node.data().computedFillColor).saturate().brighten().css()
    } else {
      return chroma(node.data().computedFillColor).darken(2).css()
    }
  }
}

export function getNodeLabelColor(node: NodeSingular, theme: GrapholscapeTheme) {
  if (
    node.data().computedFillColor !== undefined &&
    (
      theme.id === DefaultThemesEnum.COLORFUL_LIGHT ||
      theme.id === DefaultThemesEnum.COLORFUL_DARK
    )) {
    const nodeBGColor = chroma(node.style('background-color'))
    const labelColorString = theme.getColour(ColoursNames.label)
    let labelColor: chroma.Color

    if (labelColorString)
      labelColor = chroma(labelColorString)
    else
      return theme.getColour(ColoursNames.label)

    /**
     * 4.5:1 minimum contrast suggested by
     * https://www.w3.org/TR/WCAG20-TECHS/G18.html
     */
    if (chroma.contrast(nodeBGColor, labelColor) > 4.5) {
      return theme.getColour(ColoursNames.label)
    } else {
      return theme.getColour(ColoursNames.label_contrast)
    }
  } else {
    return theme.getColour(ColoursNames.label)
  }
}

function isThemeDark(theme: GrapholscapeTheme) {
  const bgColor = theme.getColour(ColoursNames.bg_graph)

  if (bgColor)
    return chroma(bgColor).luminance() < 0.3
}