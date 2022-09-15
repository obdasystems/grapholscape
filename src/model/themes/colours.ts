export enum ColoursNames {
  // foreground
  /** Foreground color, used for main texts */
  fg_default = 'fg-default',
  /** Foreground muted, should be darker than default. Used for secondary text */
  fg_muted = 'fg-muted',
  /** Foreground muted, should be lighter and softer than default.
   * Used for placeholders, tips and text used for clarifying UI objects 
   */
  fg_subtle = 'fg-subtle',

  /** Foreground text colour placed on a surface of a emphasy color such as accent, danger, success and so on */
  fg_on_emphasis = 'fg-on-emphasis',

  // background
  /** Main background surface colours used in UI widgets */
  bg_default = 'bg-default',
  /** Background color to create a higher or lower level with respect to bg_default color */
  bg_inset = 'bg-inset',

  // borders
  /** Borders main color */
  border_default = 'border-default',
  /** Softer than default, used for creating softer separations between UI objects */
  border_subtle = 'border-subtle',
  
  shadow = 'shadow',

  // neutral
  /** Used to emphasize secondary elements or texts. Like active elements */
  neutral = 'neutral',
  /** Emphasize secondary elements, should be darker than default */
  neutral_muted = 'neutral-muted',
  /** Emphasize secondary elements, used for active elements borders */
  neutral_subtle = 'neutral-subtle',

  // accent
  /** Primary color for selected/active elements in diagram or activable elemnts like toggles */
  accent = 'accent',
  /** Primary color in darker tone, used for decorations like surfaces or borders */
  accent_muted = 'accent-muted',
  /** Primary color in lighter tone, used for decorations like toggle's background color */
  accent_subtle = 'accent-subtle',

  // role colors
  /** Color for denoting a successful action */
  success = 'success',
  /** Denote successful action in darker tone, used for texts or borders */
  success_muted = 'success-muted',
  /** Denote successful action in lighter tone, used for backgrounds or surfaces */
  success_subtle = 'success-subtle',

  /** Color for denoting warnings */
  attention = 'attention',
  /** Color for denoting warnings in darker tone, used for texts or borders */
  attention_muted = 'attention-muted',
  /** Color for denoting warnings in lighter tone, used for backgrounds or surfaces */
  attention_subtle = 'attention-subtle',

  /** Color for denoting errors */
  danger = 'danger',
  /** Color for denoting errors in darker tone, used for texts or borders */
  danger_muted = 'danger-muted',
  /** Color for denoting errors in lighter tone, used for backgrounds or surfaces */
  danger_subtle = 'danger-subtle',


  // entities
  /** Color used for classes' nodes bodies */
  class = 'class',
  /** Color used for classes' nodes borders */
  class_contrast = 'class-contrast',

  /** Color used for object properties' nodes bodies */
  object_property = 'object-property',
  /** Color used for object properties' nodes borders */
  object_property_contrast = 'object-property-contrast',

  /** Color used for data properties' nodes bodies */
  data_property = 'data-property',
  /** Color used for data properties' nodes borders */
  data_property_contrast = 'data-property-contrast',

  /** Color used for individual's nodes bodies */
  individual = 'individual',
  /** Color used for individual's nodes borders */
  individual_contrast = 'individual-contrast',

  // graph colors
  /** Background color used in the diagram canvas */
  bg_graph = 'bg-graph',
  /** Body color for nodes that are white in plain Graphol */
  bg_node_light = 'bg-node-light',
  /** Body color for nodes that are black in plain Graphol */
  bg_node_dark = 'bg-node-dark',
  /** Body border color */
  border_node = 'border-node',
  /** Nodes/Edges label color */
  label = 'label',
  /** Opposite color of label */
  label_contrast = 'label-contrast',
  /** Edges lines color */
  edge = 'edge'
}

export type ColourMap = { [key in ColoursNames]?: string }