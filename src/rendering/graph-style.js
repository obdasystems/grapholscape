export function getGraphStyle(theme) {
  return [
    {
      selector: 'node',
      style: {
        'height': 'data(height)',
        'width': 'data(width)',
        'background-color': theme.node_bg.cssText,
        'shape': 'data(shape)',
        'border-width': 1,
        'border-color': theme.node_border.cssText,
        'border-style': 'solid',
        'font-size': 12,
        'color': theme.label_color.cssText,
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
        'line-color': theme.edge.cssText,
        'target-arrow-color': theme.edge.cssText,
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
        'source-arrow-color': theme.edge.cssText,
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
        'border-color': theme.node_border.cssText,
        'border-style': 'double'
      }
    },

    {
      selector: '[?inverseFunctional][!functional]',
      style: {
        'border-width': 4,
        'border-color': theme.node_border.cssText,
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
        'background-color': theme.concept.cssText,
        'border-color': theme.concept_dark.cssText,
      } 
    },

    {
      selector: '.role, .fake-triangle',
      style: {
        'background-color': theme.role.cssText,
        'border-color': theme.role_dark.cssText,
      } 
    },

    {
      selector: '.attribute',
      style: {
        'background-color': theme.attribute.cssText,
        'border-color': theme.attribute_dark.cssText,
      } 
    },

    {
      selector: '.individual',
      style: {
        'background-color': theme.individual.cssText,
        'border-color': theme.individual_dark.cssText,
      } 
    },

    {
      selector: '[type = "range-restriction"], [type = "disjoint-union"]',
      style: {
        'background-color': theme.node_bg_contrast.cssText,
      }
    },

    { // the right border part of functional && inverseFunctional roles
      selector: '.fake-triangle-right',
      style: {
        'background-color': theme.role_dark.cssText,
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: 'edge:selected',
      style: {
        'line-color': theme.secondary.cssText,
        'source-arrow-color': theme.secondary.cssText,
        'target-arrow-color': theme.secondary.cssText,
        'width': '4',
      }
    },

    {
      selector: ':selected',
      style: {
        'overlay-color': theme.secondary.cssText,
        'overlay-opacity': 0.2,
        'z-index': '100'
      }
    },
  ]
}