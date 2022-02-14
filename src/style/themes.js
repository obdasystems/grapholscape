/**
 * @typedef {object} Theme an object of colours
 * 
 * @property {string} id
 * @property {string?} name
 * @property {boolean?} selected
 * 
 * @property {string?} primary
 * @property {string?} on_primary
 * @property {string?} primary_dark
 * @property {string?} on_primary_dark
 * @property {string?} secondary
 * @property {string?} on_secondary
 * @property {string?} secondary_dark
 * @property {string?} on_secondary_dark
 * @property {string?} shadows
 * @property {string?} borders
 * @property {string?} error
 * @property {string?} on_error
 * @property {string?} warning
 * @property {string?} on_warning
 * @property {string?} background
 * @property {string?} edge
 * @property {string?} node_bg
 * @property {string?} node_bg_contrast
 * @property {string?} node_border
 * @property {string?} label_color
 * @property {string?} label_color_contrast
 * @property {string?} role
 * @property {string?} role_dark
 * @property {string?} attribute
 * @property {string?} attribute_dark
 * @property {string?} concept
 * @property {string?} concept_dark
 * @property {string?} individual
 * @property {string?} individual_dark
 */

import { css } from 'lit'

export const gscape = {
  // primary colors
  primary: css`#fff`,
  on_primary: css`#666`,
  primary_dark: css`#e6e6e6`,
  on_primary_dark: css`#888`,

  // secondary colors
  secondary: css`rgb(81,149,199)`,
  on_secondary: css`#fff`,
  secondary_dark: css`#2c6187`,
  on_secondary_dark: css`#fff`,

  // misc
  shadows: css`rgba(0,0,0,0.2)`,
  borders: css`rgba(0,0,0,0.2)`,
  error: css`#cc3b3b`,
  on_error: css`#fff`,
  warning: css`#D39F0A`,
  on_warning: css`#fff`,

  // graph colors
  background: css`#fafafa`,
  edge: css`#000`,
  node_bg: css`#fcfcfc`,
  node_bg_contrast: css`#000`,
  node_border: css`#000`,
  label_color: css`#000`,
  label_color_contrast: css`#fcfcfc`,

  role: css`#AACDE1`,
  role_dark: css`#065A85`,

  attribute: css`#C7DAAD`,
  attribute_dark: css`#4B7900`,

  concept: css`#F9F3A6`,
  concept_dark: css`#B08D00`,

  individual: css`#d3b3ef`,
  individual_dark: css`#9875b7`,
}

export const classic = {
  // primary colors
  primary: css`#fff`,
  on_primary: css`#666`,
  primary_dark: css`#e6e6e6`,
  on_primary_dark: css`#888`,

  // secondary colors
  secondary: css`rgb(81,149,199)`,
  on_secondary: css`#fff`,
  secondary_dark: css`#2c6187`,
  on_secondary_dark: css`#fff`,

  // misc
  shadows: css`rgba(0,0,0,0.2)`,
  borders: css`rgba(0,0,0,0.2)`,
  error: css`#cc3b3b`,
  on_error: css`#fff`,

  background: css`#fafafa`,
  edge: css`#000`,
  node_bg: css`#fcfcfc`,
  node_bg_contrast: css`#000`,
  node_border: css`#000`,
  label_color: css`#000`,
  label_color_contrast: css`#fcfcfc`,

  role: css`#fcfcfc`,
  role_dark: css`#000`,

  attribute: css`#fcfcfc`,
  attribute_dark: css`#000`,

  concept: css`#fcfcfc`,
  concept_dark: css`#000`,

  individual: css`#fcfcfc`,
  individual_dark: css`#000`,
}

export const dark_old = {
  primary: css`#333`,
  on_primary: css`#fff`,
  primary_dark: css`#1a1a1a`,
  on_primary_dark: css`#fff`,

  secondary: css`#99ddff`,
  on_secondary: css`#333`,
  secondary_dark: css`#0099e6`,
  on_secondary_dark: css`#fff`,

  shadows: css`rgba(255, 255, 255, 0.5)`,
  error: css`#cc3b3b`,
  on_error: css`#fff`,

  // graph colors
  background: css`#333`,
  edge: css`#fff`,
  node_bg: css`#333`,
  node_bg_contrast: css`#000`,
  node_border: css`#fcfcfc`,
  label_color: css`#fcfcfc`,

  role: css`#666`,
  role_dark: css`#065A85`,

  attribute: css`#666`,
  attribute_dark: css`#4B7900`,

  concept: css`#666`,
  concept_dark: css`#B08D00`,

  individual: css`#666`,
  individual_dark: css`#9875b7`,
}

export const dark = {
  primary: css`#222831`,
  on_primary: css`#a0a0a0`,
  primary_dark: css`#1a1a1a`,
  on_primary_dark: css`#a0a0a0`,

  secondary: css`#72c1f5`,
  on_secondary: css`#222831`,
  secondary_dark: css`#0099e6`,
  on_secondary_dark: css`#a0a0a0`,

  shadows: css`transparent`,
  borders: css`rgba(255, 255, 255, 0.25)`,
  error: css`#cc3b3b`,
  on_error: css`#fff`,

  // graph colors
  background: css`#181c22`,
  edge: css`#a0a0a0`,
  node_bg: css`#a0a0a0`,
  node_bg_contrast: css`#010101`,
  node_border: css`#a0a0a0`,
  label_color: css`#a0a0a0`,

  role: css`#043954`,
  role_dark: css`#7fb3d2`,

  attribute_dark: css`#C7DAAD`,
  attribute: css`#4B7900`,

  concept_dark: css`#b28f00`,
  concept: css`#423500`,

  individual_dark: css`#9875b7`,
  individual: css`#422D53`,
}