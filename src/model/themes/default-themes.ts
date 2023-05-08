import { ColourMap, ColoursNames } from "./colours"
import GrapholscapeTheme from "./theme"

export enum DefaultThemesEnum {
  GRAPHOLSCAPE = 'grapholscape',
  GRAPHOL = 'graphol',
  DARK = 'dark',
}

export const gscapeColourMap: ColourMap = {
  // graph colours
  [ColoursNames.bg_graph]: '#fafafa',
  [ColoursNames.edge]: '#000',
  [ColoursNames.bg_node_light]: '#fcfcfc',
  [ColoursNames.bg_node_dark]: '#000',
  [ColoursNames.border_node]: '#000',
  [ColoursNames.label]: '#000',
  [ColoursNames.label_contrast]: '#fcfcfc',

  [ColoursNames.class]: '#F9F3A6',
  [ColoursNames.class_contrast]: '#B08D00',

  [ColoursNames.object_property]: '#AACDE1',
  [ColoursNames.object_property_contrast]: '#065A85',

  [ColoursNames.data_property]: '#C7DAAD',
  [ColoursNames.data_property_contrast]: '#4B7900',

  [ColoursNames.individual]: '#d3b3ef',
  [ColoursNames.individual_contrast]: '#9875b7',

  // UI colours
  [ColoursNames.fg_default]: '#24292f',
  [ColoursNames.fg_muted]: '#57606a',
  [ColoursNames.fg_subtle]: '#6e7781',
  [ColoursNames.fg_on_emphasis]: '#ffffff',

  [ColoursNames.bg_default]: '#f6f8fa',
  [ColoursNames.bg_inset]: '#eff2f5',

  [ColoursNames.border_default]: '#d0d7de',
  [ColoursNames.border_subtle]: 'rgba(27, 31, 36, 0.15)',

  [ColoursNames.shadow]: '#d0d7de',

  [ColoursNames.neutral]: '#e8ecef',
  [ColoursNames.neutral_muted]: '#dae0e7',
  [ColoursNames.neutral_subtle]: '#f3f5f7',

  [ColoursNames.accent]: '#0969da',
  [ColoursNames.accent_muted]: 'rgba(84, 174, 255, 0.4)',
  [ColoursNames.accent_subtle]: '#ddf4ff',

  // State Colours
  [ColoursNames.success]: '#1a7f37',
  [ColoursNames.success_muted]: 'rgba(74, 194, 107, 0.4)',
  [ColoursNames.success_subtle]: '#2da44e',

  [ColoursNames.attention]: '#9a6700',
  [ColoursNames.attention_muted]: 'rgba(212, 167, 44, 0.4)',
  [ColoursNames.attention_subtle]: '#fff8c5',

  [ColoursNames.danger]: '#cf222e',
  [ColoursNames.danger_muted]: 'rgba(255, 129, 130, 0.4)',
  [ColoursNames.danger_subtle]: '#FFEBE9',

  // Instance Colours
  [ColoursNames.class_instance]: '#d3b3ef',
  [ColoursNames.class_instance_contrast]: '#9875b7'
}

export const classicColourMap: ColourMap = Object.assign(JSON.parse(JSON.stringify(gscapeColourMap)), {
  [ColoursNames.bg_graph]: '#fafafa',
  [ColoursNames.edge]: '#000',
  [ColoursNames.bg_node_light]: '#fcfcfc',
  [ColoursNames.bg_node_dark]: '#000',
  [ColoursNames.border_node]: '#000',
  [ColoursNames.label]: '#000',
  [ColoursNames.label_contrast]: '#fcfcfc',

  [ColoursNames.object_property]: '#fcfcfc',
  [ColoursNames.object_property_contrast]: '#000',

  [ColoursNames.data_property]: '#fcfcfc',
  [ColoursNames.data_property_contrast]: '#000',

  [ColoursNames.class]: '#fcfcfc',
  [ColoursNames.class_contrast]: '#000',

  [ColoursNames.individual]: '#fcfcfc',
  [ColoursNames.individual_contrast]: '#000',

  // Instance Colours
  [ColoursNames.class_instance]: '#fcfcfc',
  [ColoursNames.class_instance_contrast]: '#000'
})

export const darkColourMap: ColourMap = {

  // graph colors
  [ColoursNames.bg_graph]: '#0d1117',
  [ColoursNames.edge]: '#a0a0a0',
  [ColoursNames.bg_node_light]: '#a0a0a0',
  [ColoursNames.bg_node_dark]: '#010101',
  [ColoursNames.border_node]: '#a0a0a0',
  [ColoursNames.label]: '#a0a0a0',
  [ColoursNames.label_contrast]: '#000',

  [ColoursNames.object_property]: '#043954',
  [ColoursNames.object_property_contrast]: '#7fb3d2',

  [ColoursNames.data_property_contrast]: '#C7DAAD',
  [ColoursNames.data_property]: '#4B7900',

  [ColoursNames.class_contrast]: '#b28f00',
  [ColoursNames.class]: '#423500',

  [ColoursNames.individual_contrast]: '#9875b7',
  [ColoursNames.individual]: '#422D53',

  // Instance Colours
  [ColoursNames.class_instance]: '#422D53',
  [ColoursNames.class_instance_contrast]: '#9875b7',

  // UI colours
  [ColoursNames.fg_default]: '#c9d1d9',
  [ColoursNames.fg_muted]: '#8b949e',
  [ColoursNames.fg_subtle]: '#6e7681',
  [ColoursNames.fg_on_emphasis]: '#ffffff',

  [ColoursNames.bg_default]: '#21262d',
  [ColoursNames.bg_inset]: '#010409',

  [ColoursNames.border_default]: '#8b949e',
  [ColoursNames.border_subtle]: 'rgba(240,246,252,0.1)',

  [ColoursNames.shadow]: '#010409',

  [ColoursNames.neutral]: '#313b48',
  [ColoursNames.neutral_muted]: '#343941',
  [ColoursNames.neutral_subtle]: '#0c1015',

  [ColoursNames.accent]: '#58a6ff',
  [ColoursNames.accent_muted]: 'rgba(56,139,253,0.4)',
  [ColoursNames.accent_subtle]: 'rgba(56,139,253,0.15)',
}

export const DefaultThemes: { [key in DefaultThemesEnum]: GrapholscapeTheme } = {
  grapholscape: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOLSCAPE, gscapeColourMap, 'Grapholscape'),
  graphol: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOL, classicColourMap, 'Graphol'),
  dark: new GrapholscapeTheme(DefaultThemesEnum.DARK, darkColourMap, 'Dark'),
}