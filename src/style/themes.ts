export enum ColoursNames {
  // primary = 'primary',
  // on_primary = 'on_primary',
  // primary_dark = 'primary_dark',
  // on_primary_dark = 'on_primary_dark',
  // secondary = 'secondary',
  // on_secondary = 'on_secondary',
  // secondary_dark = 'secondary_dark',
  // on_secondary_dark = 'on_secondary_dark',
  // shadows = 'shadows',
  // borders = 'borders',
  // error = 'error',
  // on_error = 'on_error',
  // warning = 'warning',
  // on_warning = 'on_warning',
  // background = 'background',
  // edge = 'edge',
  // node_bg = 'node_bg',
  // node_bg_contrast = 'node_bg_contrast',
  // node_border = 'node_border',
  // label_color = 'label_color',
  // label_color_contrast = 'label_color_contrast',
  // role = 'role',
  // role_dark = 'role_dark',
  // attribute = 'attribute',
  // attribute_dark = 'attribute_dark',
  // concept = 'concept',
  // concept_dark = 'concept_dark',
  // // individual = 'individual',
  // individual_dark = 'individual_dark',

  // foreground
  fg_default = 'fg-default',
  fg_muted = 'fg-muted',
  fg_subtle = 'fg-subtle',
  fg_on_emphasis = 'fg-on-emphasis',

  // background
  bg_default = 'bg-default',
  bg_inset = 'bg-inset',

  // borders
  border_default = 'border-default',
  border_subtle = 'border-subtle',

  shadow = 'shadow',

  // neutral
  neautral = 'neutral',
  neutral_muted = 'neutral-muted',
  neutral_subtle = 'neutral-subtle',

  // accent
  accent = 'accent',
  accent_muted = 'accent-muted',
  accent_subtle = 'accent-subtle',

  // role colors
  success = 'success',
  success_muted = 'success-muted',
  success_subtle = 'success-subtle',

  attention = 'attention',
  attention_muted = 'attention-muted',
  attention_subtle = 'attention-subtle',

  danger = 'danger',
  danger_muted = 'danger-muted',
  danger_subtle = 'danger-subtle',


  // entities
  class = 'class',
  class_contrast = 'class-contrast',

  object_property = 'object-property',
  object_property_contrast = 'object-property-contrast',

  data_property = 'data-property',
  data_property_contrast = 'data-property-contrast',

  individual = 'individual',
  individual_contrast = 'individual-contrast',

  // graph colors
  bg_graph = 'bg-graph',
  bg_node_light = 'bg-node-light',
  bg_node_dark = 'bg-node-dark',
  border_node = 'border-node',
  label = 'label',
  label_contrast = 'label-contrast',
  edge = 'edge'
}

export type ColourMap = { [key in ColoursNames]?: string }

export const gscapeColourMap: ColourMap = {
  // graph colours
  'bg-graph': '#fafafa',
  'edge': '#000',
  'bg-node-light': '#fcfcfc',
  'bg-node-dark': '#000',
  'border-node': '#000',
  'label': '#000', 
  'label-contrast': '#fcfcfc',

  'class': '#F9F3A6',
  'class-contrast': '#B08D00',

  'object-property': '#AACDE1',
  'object-property-contrast': '#065A85',

  'data-property': '#C7DAAD',
  'data-property-contrast': '#4B7900',

  'individual': '#d3b3ef',
  'individual-contrast': '#9875b7',

  // UI colours
  'fg-default': '#24292f',
  'fg-muted': '#57606a',
  'fg-subtle': '#6e7781',
  'fg-on-emphasis': '#ffffff',

  'bg-default': '#f6f8fa',
  'bg-inset': '#eff2f5',

  'border-default': '#d0d7de',
  'border-subtle': 'rgba(27, 31, 36, 0.15)',

  'shadow': '#d0d7de',

  'neutral': '#e8ecef',
  'neutral-muted': '#dae0e7',
  'neutral-subtle': '#f3f5f7',

  'accent': '#0969da',
  'accent-muted': 'rgba(84, 174, 255, 0.4)',
  'accent-subtle': '#ddf4ff',

  // State Colours
  'success': '#1a7f37',
  'success-muted': 'rgba(74, 194, 107, 0.4)',
  'success-subtle': '#2da44e',
  
  'attention': '#9a6700',
  'attention-muted': 'rgba(212, 167, 44, 0.4)',
  'attention-subtle': '#fff8c5',

  'danger': '#cf222e',
  'danger-muted': 'rgba(255, 129, 130, 0.4)',
  'danger-subtle': '#FFEBE9',


  // primary colors
  // primary: '#fff',
  // on_primary: '#666',
  // primary_dark: '#e6e6e6',
  // on_primary_dark: '#888',

  // // secondary colors
  // secondary: 'rgb(81,149,199)',
  // on_secondary: '#fff',
  // secondary_dark: '#2c6187',
  // on_secondary_dark: '#fff',

  // // misc
  // shadows: 'rgba(0,0,0,0.2)',
  // borders: 'rgba(0,0,0,0.2)',
  // error: '#cc3b3b',
  // on_error: '#fff',
  // warning: '#D39F0A',
  // on_warning: '#fff',

  // // graph colors
  // background: '#fafafa',
  // edge: '#000',
  // node_bg: '#fcfcfc',
  // node_bg_contrast: '#000',
  // node_border: '#000',
  // label_color: '#000',
  // label_color_contrast: '#fcfcfc',

  // role: '#AACDE1',
  // role_dark: '#065A85',

  // attribute: '#C7DAAD',
  // attribute_dark: '#4B7900',

  // concept: '#F9F3A6',
  // concept_dark: '#B08D00',

  // individual: '#d3b3ef',
  // individual_dark: '#9875b7',
}

export const classicColourMap: ColourMap = {
  "bg-graph": '#fafafa',
  'edge': '#000',
  "bg-node-light": '#fcfcfc',
  "bg-node-dark": '#000',
  "border-node": '#000',
  'label': '#000',
  "label-contrast": '#fcfcfc',

  "object-property": '#fcfcfc',
  "object-property-contrast": '#000',

  "data-property": '#fcfcfc',
  "data-property-contrast": '#000',

  'class': '#fcfcfc',
  "class-contrast": '#000',

  'individual': '#fcfcfc',
  "individual-contrast": '#000',
}

export const darkColourMap: ColourMap = {
  // primary: '#222831',
  // on_primary: '#a0a0a0',
  // primary_dark: '#1a1a1a',
  // on_primary_dark: '#a0a0a0',

  // secondary: '#72c1f5',
  // on_secondary: '#222831',
  // secondary_dark: '#0099e6',
  // on_secondary_dark: '#a0a0a0',

  // shadows: 'transparent',
  // borders: 'rgba(255, 255, 255, 0.25)',
  // error: '#cc3b3b',
  // on_error: '#fff',

  // graph colors
  "bg-graph": '#0d1117',
  'edge': '#a0a0a0',
  "bg-node-light": '#a0a0a0',
  "bg-node-dark": '#010101',
  "border-node": '#a0a0a0',
  'label': '#a0a0a0',
  'label-contrast': '#000',

  "object-property": '#043954',
  "object-property-contrast": '#7fb3d2',

  "data-property-contrast": '#C7DAAD',
  "data-property": '#4B7900',

  'class-contrast': '#b28f00',
  'class': '#423500',

  'individual-contrast': '#9875b7',
  'individual': '#422D53',

  // UI colours
  'fg-default': '#c9d1d9',  
  'fg-muted': '#8b949e',
  'fg-subtle': '#6e7681',
  'fg-on-emphasis': '#ffffff',

  'bg-default': '#21262d',
  'bg-inset': '#010409',

  'border-default': '#8b949e',
  'border-subtle': 'rgba(240,246,252,0.1)',

  'shadow': '#010409',

  'neutral': '#313b48',
  'neutral-muted': 'rgba(110,118,129,0.4)',
  'neutral-subtle': 'rgba(110,118,129,0.1)',

  'accent': '#58a6ff',
  'accent-muted': 'rgba(56,139,253,0.4)',
  'accent-subtle': 'rgba(56,139,253,0.15)',
}