var create_stylesheet = function() {
	return [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'height' : 'data(height)',
          'width' : 'data(width)',
          'background-color': 'data(fillColor)',
          'shape': 'data(shape)',
          'border-width': 1,
          'border-color': '#000',
          'border-style': 'solid',
          'font-size' : 12,
        }
      },

      {
        selector: '[label]',
        style: {
          'label': 'data(label)',
          'text-margin-x' : 'data(labelXpos)',
          'text-margin-y' : 'data(labelYpos)',
          'text-wrap': 'wrap',
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#000',
          'target-arrow-color': '#000',
          'target-arrow-shape': 'data(target_arrow)',
          'target-arrow-fill': 'data(arrow_fill)',
          'line-style' : 'data(style)',
          'curve-style' : 'bezier',
          'arrow-scale' : 1.3,
        }
      },

      {
        selector: '[segment_distances]',
        style: {
          'curve-style': 'segments',
          "segment-distances": 'data(segment_distances)',
          'segment-weights' : 'data(segment_weights)',
          'edge-distances': 'node-position',
        }
      },

      {
        selector: '[source_arrow]',
        style: {
          'source-arrow-color': '#000',
          'source-arrow-shape': 'data(source_arrow)',
          'source-arrow-fill': 'data(arrow_fill)',
        }

      },

      {
        selector: '[source_endpoint]',
        style: {
          'source-endpoint' : 'data(source_endpoint)',
        }
      },

      {
        selector: '[target_endpoint]',
        style: {
          'target-endpoint' : 'data(target_endpoint)',
        }
      },

      {
        selector: '[?functional][!inverseFunctional]',
        style: {
          'border-width':5,
          'border-color': '#000',
          'border-style': 'double',
        }
      },

      {
        selector: '[?inverseFunctional][!functional]',
        style: {
          'border-width':4,
          'border-color': '#000',
          'border-style': 'solid',
        }
      },

      {
        selector: '[edge_label]',
        style: {
          'label': 'data(edge_label)',
          'font-size' : 10,
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
        }
      },

      {
        selector: '[target_label]',
        style: {
          'target-label': 'data(target_label)',
          'font-size' : 10,
          'target-text-offset': 15,
          'target-text-margin-y': -5,
        }
      },

      {
        selector: '[shape_points]',
        style: {
          'shape-polygon-points': 'data(shape_points)',
        }
      },

      {
        selector: 'edge:selected',
        style: {
          'line-color' : this.highlight_color,
          'source-arrow-color' : this.highlight_color,
          'target-arrow-color' : this.highlight_color,
          'width' : '4',
          'z-index' : '100',
        }
      },

      {
        selector: 'node:selected',
        style: {
          'border-color' : this.highlight_color,
          'border-width' : '4',
          'z-index' : '100',
        }
      },
      {
        selector: '.filtered',
        style: {
          'display':'none',
        },
      },
      {
        selector: '.facet',
        style: {
          'background-opacity':0,
        }
      },

      {
        selector: '.hidden',
        style: {
          'visibility': 'hidden',
        },
      },

      {
        selector: '.no_border',
        style : {
          'border-width' : 0,
        }
      },

      {
        selector: '.no_overlay',
        style : {
          'overlay-opacity' : 0,
          'overlay-padding' : 0,
        }
      }
    ]
}

module.exports = {
	create_stylesheet : create_stylesheet
}