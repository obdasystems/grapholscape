import * as theme from './widgets/themes'

let colors = theme.gscape

export const graph_style = [
  {
    selector: 'node',
    style: {
      'height': 'data(height)',
      'width': 'data(width)',
      'background-color': colors.graph_node_light_bg.cssText,
      'shape': 'data(shape)',
      'border-width': 1,
      'border-color': colors.graph_node_border.cssText,
      'border-style': 'solid',
      'font-size': 12,
    }
  },

  {
    selector: '[label]',
    style: {
      'label': 'data(label)',
      'text-margin-x': 'data(labelXpos)',
      'text-margin-y': 'data(labelYpos)',
      'text-wrap': 'wrap'
    }
  },

  {
    selector: 'edge',
    style: {
      'width': 1,
      'line-color': colors.graph_edge.cssText,
      'target-arrow-color': colors.graph_edge.cssText,
      'target-arrow-shape': 'data(target_arrow)',
      'target-arrow-fill': 'data(arrow_fill)',
      'line-style': 'data(style)',
      'curve-style': 'bezier',
      'arrow-scale': 1.3
    }
  },

  {
    selector: '[segment_distances]',
    style: {
      'curve-style': 'segments',
      'segment-distances': 'data(segment_distances)',
      'segment-weights': 'data(segment_weights)',
      'edge-distances': 'node-position'
    }
  },

  {
    selector: '[source_arrow]',
    style: {
      'source-arrow-color': colors.graph_edge.cssText,
      'source-arrow-shape': 'data(source_arrow)',
      'source-arrow-fill': 'data(arrow_fill)'
    }
  },

  {
    selector: '[source_endpoint]',
    style: {
      'source-endpoint': 'data(source_endpoint)'
    }
  },

  {
    selector: '[target_endpoint]',
    style: {
      'target-endpoint': 'data(target_endpoint)'
    }
  },

  {
    selector: '[?functional][!inverseFunctional]',
    style: {
      'border-width': 5,
      'border-color': colors.graph_node_border.cssText,
      'border-style': 'double'
    }
  },

  {
    selector: '[?inverseFunctional][!functional]',
    style: {
      'border-width': 4,
      'border-color': colors.graph_node_border.cssText,
      'border-style': 'solid'
    }
  },

  {
    selector: '[edge_label]',
    style: {
      'label': 'data(edge_label)',
      'font-size': 10,
      'text-rotation': 'autorotate',
      'text-margin-y': -10
    }
  },

  {
    selector: '[target_label]',
    style: {
      'target-label': 'data(target_label)',
      'font-size': 10,
      'target-text-offset': 15,
      'target-text-margin-y': -5
    }
  },

  {
    selector: '[shape_points]',
    style: {
      'shape-polygon-points': 'data(shape_points)'
    }
  },

  {
    selector: '.filtered',
    style: {
      'display': 'none'
    }
  },

  {
    selector: '.facet',
    style: {
      'background-opacity': 0
    }
  },

  {
    selector: '.hidden',
    style: {
      'visibility': 'hidden'
    }
  },

  {
    selector: '.no_border',
    style: {
      'border-width': 0
    }
  },

  {
    selector: '.no_overlay',
    style: {
      'overlay-opacity': 0,
      'overlay-padding': 0
    }
  },

  {
    selector: '.concept',
    style: {
      'background-color': colors.graph_concept.cssText,
      'border-color': colors.graph_concept_dark.cssText,
    } 
  },

  {
    selector: '.role, .fake-triangle',
    style: {
      'background-color': colors.graph_role.cssText,
      'border-color': colors.graph_role_dark.cssText,
    } 
  },

  {
    selector: '.attribute',
    style: {
      'background-color': colors.graph_attribute.cssText,
      'border-color': colors.graph_attribute_dark.cssText,
    } 
  },

  {
    selector: '.individual',
    style: {
      'background-color': colors.graph_individual.cssText,
      'border-color': colors.graph_individual_dark.cssText,
    } 
  },

  {
    selector: '[type = "range-restriction"], [type = "disjoint-union"]',
    style: {
      'background-color': colors.graph_node_dark_bg.cssText,
    }
  },

  { // the right border part of functional && inverseFunctional roles
    selector: '.fake-triangle-right',
    style: {
      'background-color': colors.graph_role_dark.cssText,
    }
  },

  // selected selector always last
  {
    selector: 'edge:selected',
    style: {
      'line-color': colors.secondary.cssText,
      'source-arrow-color': colors.secondary.cssText,
      'target-arrow-color': colors.secondary.cssText,
      'width': '4',
    }
  },

  {
    selector: ':selected',
    style: {
      'overlay-color': colors.secondary.cssText,
      'overlay-opacity': 0.2,
      'z-index': '100'
    }
  },
]