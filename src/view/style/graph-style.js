export function getGraphStyle(theme) {
  return [
    {
      selector: 'node',
      style: {
        'height': 'data(height)',
        'width': 'data(width)',
        'background-color': theme.node_bg,
        'shape': 'data(shape)',
        'border-width': 1,
        'border-color': theme.node_border,
        'border-style': 'solid',
        'font-size': 12,
        'color': theme.label_color,
      }
    },

    {
      selector: '[fontSize]',
      style: {
        'font-size' : 'data(fontSize)',
      }
    },

    {
      selector: 'node[displayed_name]',
      style: {
        'label': 'data(displayed_name)',
        'text-margin-x': 'data(labelXpos)',
        'text-margin-y': 'data(labelYpos)',
        'text-wrap': 'wrap',
        'min-zoomed-font-size' : '5px',
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': theme.edge,
        'target-arrow-color': theme.edge,
        'source-arrow-color': theme.edge,
        'curve-style': 'bezier',
        'arrow-scale': 1.3,
        'color': theme.label_color,
      }
    },

    {
      selector: 'edge[type = "inclusion"], [type = "membership"], edge.inclusion',
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled'
      }
    },

    {
      selector: 'edge.hierarchy',
      style: {
        'width': 6,
        'target-arrow-fill': 'hollow',
      }
    },

    {
      selector: 'edge.disjoint',
      style: {
        'target-arrow-fill': 'filled',
      }
    },

    {
      selector: 'edge[type = "input"]',
      style: {
        'line-style': 'dashed',
        'target-arrow-shape': 'diamond',
        'target-arrow-fill': 'hollow'
      }
    },

    {
      selector: 'edge[type = "easy_input"]',
      style: {
        'line-style': 'solid',
      }
    },

    {
      selector: 'edge[type = "equivalence"]',
      style: {
        'line-style': 'solid',
        'source-arrow-shape': 'triangle',
        'source-arrow-fill': 'filled',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
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
      selector: ':loop',
      style: {
        'control-point-step-size': 'data(control_point_step_size)',
        'control-point-weight': 0.5,
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
        'border-color': theme.node_border,
        'border-style': 'double'
      }
    },

    {
      selector: '[?inverseFunctional][!functional]',
      style: {
        'border-width': 4,
        'border-color': theme.node_border,
        'border-style': 'solid'
      }
    },

    {
      selector: 'edge[displayed_name]',
      style: {
        'label': 'data(displayed_name)',
        'font-size': 10,
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
      }
    },

    {
      selector: '[target_label]',
      style: {
        'target-label': 'data(target_label)',
      }
    },

    {
      selector: '[source_label]',
      style: {
        'source-label': 'data(source_label)',
      }
    },

    {
      selector: '[source_label],[target_label]',
      style: {
        'font-size': 15,
        'target-text-offset': 20,
      }
    },

    {
      selector: 'edge[displayed_name],[source_label],[target_label],[text_background]',
      style: {
        'text-background-color': theme.background,
        'text-background-opacity': 1,
        'text-background-shape': 'roundrectangle',
        'text-background-padding' : 2,
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
        'background-color': theme.concept,
        'border-color': theme.concept_dark,
      }
    },

    {
      selector: '.role, .fake-triangle',
      style: {
        'background-color': theme.role,
        'border-color': theme.role_dark,
      }
    },

    {
      selector: '.attribute',
      style: {
        'background-color': theme.attribute,
        'border-color': theme.attribute_dark,
        'text-background-color': theme.background,
        'text-background-opacity': 1,
      }
    },

    {
      selector: 'edge.role',
      style: {
        'line-color' : theme.role_dark,
        'source-arrow-color': theme.role_dark,
        'target-arrow-color': theme.role_dark,
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'square',
        'source-arrow-fill': 'hollow',
      }
    },

    {
      selector: 'edge.range',
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: 'edge.domain',
      style: {
        'target-arrow-shape': 'square',
        'target-arrow-fill': 'hollow',
        'source-arrow-shape': 'none',
      }
    },

    {
      selector: 'edge.attribute',
      style: {
        'line-color': theme.attribute_dark,
        'source-arrow-shape': 'none',
        'target-arrow-shape': 'none',
      }
    },

    {
      selector: '.bubble',
      style: {
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign' : 'center',
        'text-halign' : 'center',
        'shape': 'ellipse',
        'height': 'data(width)'
      }
    },

    {
      selector: '.individual',
      style: {
        'background-color': theme.individual,
        'border-color': theme.individual_dark,
      }
    },

    {
      selector: '[type = "range-restriction"], [type = "disjoint-union"]',
      style: {
        'background-color': theme.node_bg_contrast,
      }
    },

    {
      selector: '.float:locked',
      style: {
        'border-color' : theme.secondary,
        'border-width' : '4px',
      }
    },

    { // the right border part of functional && inverseFunctional roles
      selector: '.fake-triangle-right',
      style: {
        'background-color': theme.role_dark || 'black',
      }
    },

    {
      selector: '[shape = "hexagon"],[type = "value-domain"], .facet',
      style: {
        'color': theme.node_bg_contrast,
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: ':selected',
      style: {
        'overlay-color': theme.secondary,
        'overlay-opacity': 0.2,
        'z-index': '100'
      }
    },
  ]
}