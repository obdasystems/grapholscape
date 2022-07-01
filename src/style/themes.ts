export enum ColoursNames {
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
  'neutral-muted': '#343941',
  'neutral-subtle': '#0c1015',

  'accent': '#58a6ff',
  'accent-muted': 'rgba(56,139,253,0.4)',
  'accent-subtle': 'rgba(56,139,253,0.15)',
}