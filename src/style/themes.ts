export enum ColoursNames {
  primary = 'primary',
  on_primary = 'on_primary',
  primary_dark = 'primary_dark',
  on_primary_dark = 'on_primary_dark',
  secondary = 'secondary',
  on_secondary = 'on_secondary',
  secondary_dark = 'secondary_dark',
  on_secondary_dark = 'on_secondary_dark',
  shadows = 'shadows',
  borders = 'borders',
  error = 'error',
  on_error = 'on_error',
  warning = 'warning', 
  on_warning = 'on_warning',
  background = 'background',
  edge = 'edge',
  node_bg = 'node_bg',
  node_bg_contrast = 'node_bg_contrast',
  node_border = 'node_border',
  label_color = 'label_color',
  label_color_contrast = 'label_color_contrast',
  role = 'role',
  role_dark = 'role_dark',
  attribute = 'attribute',
  attribute_dark = 'attribute_dark',
  concept = 'concept',
  concept_dark = 'concept_dark',
  individual = 'individual',
  individual_dark = 'individual_dark'
}

export type ColourMap = { [key in ColoursNames]?: string }

export const gscapeColourMap: ColourMap = {
  // primary colors
  primary: `#fff`,
  on_primary: `#666`,
  primary_dark: `#e6e6e6`,
  on_primary_dark: `#888`,

  // secondary colors
  secondary: `rgb(81,149,199)`,
  on_secondary: `#fff`,
  secondary_dark: `#2c6187`,
  on_secondary_dark: `#fff`,

  // misc
  shadows: `rgba(0,0,0,0.2)`,
  borders: `rgba(0,0,0,0.2)`,
  error: `#cc3b3b`,
  on_error: `#fff`,
  warning: `#D39F0A`,
  on_warning: `#fff`,

  // graph colors
  background: `#fafafa`,
  edge: `#000`,
  node_bg: `#fcfcfc`,
  node_bg_contrast: `#000`,
  node_border: `#000`,
  label_color: `#000`,
  label_color_contrast: `#fcfcfc`,

  role: `#AACDE1`,
  role_dark: `#065A85`,

  attribute: `#C7DAAD`,
  attribute_dark: `#4B7900`,

  concept: `#F9F3A6`,
  concept_dark: `#B08D00`,

  individual: `#d3b3ef`,
  individual_dark: `#9875b7`,
}

export const classicColourMap: ColourMap = {
  // primary colors
  primary: `#fff`,
  on_primary: `#666`,
  primary_dark: `#e6e6e6`,
  on_primary_dark: `#888`,

  // secondary colors
  secondary: `rgb(81,149,199)`,
  on_secondary: `#fff`,
  secondary_dark: `#2c6187`,
  on_secondary_dark: `#fff`,

  // misc
  shadows: `rgba(0,0,0,0.2)`,
  borders: `rgba(0,0,0,0.2)`,
  error: `#cc3b3b`,
  on_error: `#fff`,

  background: `#fafafa`,
  edge: `#000`,
  node_bg: `#fcfcfc`,
  node_bg_contrast: `#000`,
  node_border: `#000`,
  label_color: `#000`,
  label_color_contrast: `#fcfcfc`,

  role: `#fcfcfc`,
  role_dark: `#000`,

  attribute: `#fcfcfc`,
  attribute_dark: `#000`,

  concept: `#fcfcfc`,
  concept_dark: `#000`,

  individual: `#fcfcfc`,
  individual_dark: `#000`,
}

export const dark_old: ColourMap = {
  primary: `#333`,
  on_primary: `#fff`,
  primary_dark: `#1a1a1a`,
  on_primary_dark: `#fff`,

  secondary: `#99ddff`,
  on_secondary: `#333`,
  secondary_dark: `#0099e6`,
  on_secondary_dark: `#fff`,

  shadows: `rgba(255, 255, 255, 0.5)`,
  error: `#cc3b3b`,
  on_error: `#fff`,

  // graph colors
  background: `#333`,
  edge: `#fff`,
  node_bg: `#333`,
  node_bg_contrast: `#000`,
  node_border: `#fcfcfc`,
  label_color: `#fcfcfc`,

  role: `#666`,
  role_dark: `#065A85`,

  attribute: `#666`,
  attribute_dark: `#4B7900`,

  concept: `#666`,
  concept_dark: `#B08D00`,

  individual: `#666`,
  individual_dark: `#9875b7`,
}

export const darkColourMap: ColourMap = {
  primary: `#222831`,
  on_primary: `#a0a0a0`,
  primary_dark: `#1a1a1a`,
  on_primary_dark: `#a0a0a0`,

  secondary: `#72c1f5`,
  on_secondary: `#222831`,
  secondary_dark: `#0099e6`,
  on_secondary_dark: `#a0a0a0`,

  shadows: `transparent`,
  borders: `rgba(255, 255, 255, 0.25)`,
  error: `#cc3b3b`,
  on_error: `#fff`,

  // graph colors
  background: `#181c22`,
  edge: `#a0a0a0`,
  node_bg: `#a0a0a0`,
  node_bg_contrast: `#010101`,
  node_border: `#a0a0a0`,
  label_color: `#a0a0a0`,

  role: `#043954`,
  role_dark: `#7fb3d2`,

  attribute_dark: `#C7DAAD`,
  attribute: `#4B7900`,

  concept_dark: `#b28f00`,
  concept: `#423500`,

  individual_dark: `#9875b7`,
  individual: `#422D53`,
}