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