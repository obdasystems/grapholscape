import GrapholscapeRenderer from './grapholscape_renderer'
import { getDistanceWeight } from '../parsing/parser_util'

export default class EasyGscapeRenderer extends GrapholscapeRenderer {
  constructor(container, ontology) {
    super(container, ontology)
    setTimeout(() => {
      /** Use filters to mark nodes that must be removed and then remove them
       *  NOTE: filtering = hiding | removing = hiding + deleting
       * 
       *  To be removed:
       *  - DataTypes
       *  - ForAll
       *  - Individuals (?)
       *  - Qualified Existential
       *  - role chains (?)
       *  - not (?)
       */
      this.ontology.diagrams.forEach(diagram => {
        let cy = diagram.cy

        Object.keys(this.filters).map(key => {
          if (key != 'all' &&
              key != 'attributes') {
            this.filter(this.filters[key] , cy)
          }
        })

        this.filterQualifiedExistentials(diagram)

        cy.remove('.filtered')
        this.simplifyDomainAndRange(diagram)
      })

      
      this.drawDiagram(this.ontology.diagrams[0])
    },2000,this)
  }

  simplifyDomainAndRange(diagram) {
    let cy = diagram.cy
    let eles = diagram.collection

    // select domain and range restrictions
    // type start with 'domain' or 'range'
    let selector = `[type ^= "domain"],[type ^= "range"]`
    eles.filter(selector).forEach(restriction => {
      let input_edge = getInputEdgeFromPropertyToRestriction(restriction)
      let new_edge = null

      // delete input edges
      //cy.remove(restriction.incomers('edge[type = "input"]'))

      if (restriction.data('type') == 'domain-restriction') {
        // there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a concept as source and a role/attribute as target
        restriction.connectedEdges('[type != "input"]').forEach(edge => {
          let edges = []
          // being a domain restriction, the simplified edge must go from a concept to the role/attribute
          // connected in input to the restriction.
          // if the actual edge has the restriction as source, the target is a concept and we consider it
          // as the source of the new edge          
          if (restriction.id() === edge.source().id()) {
            edges.push(this.reverseEdge(edge))
          }
          else
            edges.push(edge.json())

          edges.push(this.reverseEdge(input_edge))
          new_edge = this.createConcatenatedEdge(edges, cy)
          // add the type of input to the restriction as a class of the new edge
          // role or attribute, used in the stylesheet to assign a different color
          new_edge.classes += input_edge.source().data('type')

          cy.add(new_edge)
          cy.remove(edge)
        })
      }

      if (restriction.data('type') == 'range-restriction') {
        // there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a role/attribute as source and a concept as target
        restriction.connectedEdges('[type != "input"]').forEach(edge => {
          let edges = []

          edges.push(input_edge.json())
          // being a range restriction, the simplified edge must go from a role/attribute to the concept
          // if the actual edge has the concept as source, the target is a role/attribute and we need to
          // revert the edge
          if (restriction.id() === edge.source().id()) {
            edges.push(edge.json())
          }
          else edges.push(this.reverseEdge(edge))

          new_edge = this.createConcatenatedEdge(edges, cy)
          // add the type of input to the restriction as a class of the new edge
          // role or attribute, used in the stylesheet to assign a different color
          new_edge.classes += input_edge.source().data('type')

          cy.add(new_edge)
          cy.remove(edge)
        })
      }
      
      this.filterElem(restriction, cy)
    })
    
    cy.remove('.filtered')

    function getInputEdgeFromPropertyToRestriction(restriction_node) {
      let e = null
      restriction_node.incomers('[type = "input"]').forEach(edge => {
        if (edge.source().data('type') == 'role' || edge.source().data('type') == 'attribute') {
          e = edge
        }
      })

      return e
    }
  }

  reverseEdge(edge) {
    let new_edge = edge.json()
    let source_aux = edge.source().id()
    new_edge.data.source = edge.target().id()
    new_edge.data.target = source_aux

    let endpoint_aux = edge.data('source_endpoint')
    new_edge.data.source_endpoint = edge.data('target_endpoint')
    new_edge.data.target_endpoint = endpoint_aux

    new_edge.data.breakpoints = edge.data('breakpoints').reverse()
    return new_edge
  }

  createConcatenatedEdge(edges, cy) {
    let source = edges[0].data.source
    let target = edges[edges.length - 1].data.target
    let segment_distances = []
    let segment_weights = []
    let breakpoints = []

    edges.forEach( (edge, i, array) => {
      breakpoints = breakpoints.concat(edge.data.breakpoints)
      edge.data.breakpoints.forEach(breakpoint => {
        let aux = getDistanceWeight(cy.getElementById(target).position(), cy.getElementById(source).position(), breakpoint)

        segment_distances.push(aux[0])
        segment_weights.push(aux[1])
      })

      // add target position as new breakpoint
      if ( i < array.length - 1 ) {
        let aux = getDistanceWeight(cy.getElementById(target).position(), 
                                    cy.getElementById(source).position(), 
                                    cy.getElementById(edge.data.target).position())
        segment_distances.push(aux[0])
        segment_weights.push(aux[1])
      }
    })

    let new_edge = edges[0]
    new_edge.data.id += '_simple'
    new_edge.data.source = source
    new_edge.data.target = target
    new_edge.data.target_endpoint = edges[edges.length-1].data.target_endpoint
    new_edge.data.type = 'inclusion'
    new_edge.data.source_arrow = 'none'
    new_edge.data.target_arrow = 'triangle'
    new_edge.data.segment_distances = segment_distances
    new_edge.data.segment_weights = segment_weights
    new_edge.data.breakpoints = breakpoints

    return new_edge
  }

  filterQualifiedExistentials(diagram) {
    let eles = diagram.collection

    // select existential restrictions
    let selector = '[type $= "-restriction"][label = "exists"]'
    eles.filter(selector).forEach(existential => {
      if (isQualified(existential)) {
        this.filterElem(existential, diagram.cy)
      }
    })

    function isQualified(node) {
      if( (node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
      && (node.data('label') == 'exists')) {
        return node.incomers('edge[type = "input"]').size() > 1 ? true : false  
      }

      return false
    }
  }
}