import GrapholscapeRenderer from './grapholscape_renderer'
import { getDistanceWeight } from '../parsing/parser_util'

export default class EasyGscapeRenderer extends GrapholscapeRenderer {
  constructor(container, ontology) {
    super(container, ontology)
    setTimeout(() => {
      this.simplifyOntology()
      this.drawDiagram(this.ontology.diagrams[0])
    },2000,this)
  }

  simplifyOntology() {
    let cy = this.ontology.diagrams[0].cy
    let eles = this.ontology.diagrams[0].collection
    // select domain and range restrictions
    // type start with 'domain' or 'range'
    let selector = `[type ^= "domain"],[type ^= "range"]`
    eles.filter(selector).forEach(restriction => {
      let input_edge = getInputEdgeFromPropertyNode(restriction)
      let target_endpoint = input_edge.data('source_endpoint')
      let property_node = input_edge.source()

      if (restriction.data('type') == 'domain-restriction') {
        let target = property_node
        // delete input edges, at most 2 possible edges
        // one from a role or an attribute and another one, keep the first one
        // whose source will be the target of all incoming edges in the domain-restriction
        cy.remove(restriction.incomers('[type = "input"]'))

        // now there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a concept as source and a role/attribute as target
        restriction.connectedEdges().forEach(edge => {
          let new_edge = edge.json()
          let source_endpoint = undefined
          let source = null
          let breakpoints = edge.segmentPoints() || []

          new_edge.data.segment_distances = []
          new_edge.data.segment_weights = []

          // being a domain restriction, the simplified edge must go from a concept to the role/attribute
          // connected in input to the restriction.
          // if the actual edge has the restriction as source, the target is a concept and we consider it
          // as the source of the new edge
          if (restriction.id() === edge.source().id()) {
            source = edge.target()
            source_endpoint = edge.data('target_endpoint')
            // we are reversing the edge, so we must reverse the breakpoints order too
            breakpoints = breakpoints.reverse()
          }
          else {
            source = edge.source()
            source_endpoint = edge.data('source_endpoint')
          }
          new_edge.data.source = source.id()

          /**
           * ---- Processing breakpoints 
           * the new edge is composed by the edge connecting the concept to the restriction
           * and the input edge coming from a role/attribute.
           * Its breakpoints are the union of the breakpoints from these 2 edges.
           * The input edge is the final part of the new edge and the breakpoints must be reversed
           * because the original direction is <role> => <concept> whereas in the simplified version the direction
           * is always <concept> => <role> [this apply for DOMAIN restriction]
           */

          // the restriction node position will be another breakpoint in the new edge
          breakpoints.push(restriction.position())
          // now add the breakpoints coming from the input edge, reversed
          let input_edge_breakpoints = input_edge.segmentPoints() || []
          breakpoints = breakpoints.concat(input_edge_breakpoints.reverse())

          // process breakpoints array and add distances and weights to the new edge
          breakpoints.forEach(breakpoint => {
            let dist_weight = getDistanceWeight(target.position(), source.position(), breakpoint)

            new_edge.data.segment_distances.push(dist_weight[0])
            new_edge.data.segment_weights.push(dist_weight[1])
          })

          new_edge.data.target = target.id()
          new_edge.data.source_endpoint = source_endpoint
          new_edge.data.target_endpoint = target_endpoint
          new_edge.data.type = 'inclusion'
          new_edge.data.source_arrow = 'none'
          new_edge.data.target_arrow = 'triangle'

          cy.remove(edge)
          cy.add(new_edge)
        })
      }

      if (restriction.data('type') == 'range-restriction') {
        let source = property_node
        // delete input edges, at most 2 possible edges
        // one from a role or an attribute and another one, keep the first one
        // whose source will be the target of all incoming edges in the domain-restriction
        cy.remove(restriction.incomers('[type = "input"]'))

        // now there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a concept as source and a role/attribute as target
        restriction.connectedEdges().forEach(edge => {
          let new_edge = edge.json()
          let breakpoints = input_edge.segmentPoints() || []
          let other_breakpoints = edge.segmentPoints() || []
          let target = null
          let target_endpoint = undefined
          new_edge.data.segment_distances = []
          new_edge.data.segment_weights = []

          // being a range restriction, the simplified edge must go from the role/attribute to a concept
          // connected to the restriction.
          // if the actual edge has the restriction as source, the target is a concept and we consider it
          // as the source of the new edge
          if (restriction.id() === edge.source().id()) {
            target = edge.target()
            target_endpoint = edge.data('target_endpoint')
          }
          else {
            target = edge.source()
            target_endpoint = edge.data('source_endpoint')
            // we are reversing the edge, so we must reverse the breakpoints order too
            other_breakpoints = other_breakpoints.reverse()
          }
          
          /**
           * ---- Processing breakpoints 
           * the new edge is composed by the edge connecting the concept to the restriction
           * and the input edge coming from a role/attribute.
           * Its breakpoints are the union of the breakpoints from these 2 edges.
           * The input edge is the final part of the new edge and the breakpoints must be reversed
           * because the original direction is <role> => <concept> whereas in the simplified version the direction
           * is always <concept> => <role> [this apply for DOMAIN restriction]
           */


          // the restriction node position will be another breakpoint in the new edge
          breakpoints.push(restriction.position())
          // now add the breakpoints coming from the edge
          breakpoints = breakpoints.concat(other_breakpoints)

          //  process breakpoints array and add distances and weights to the new edge
          breakpoints.forEach(breakpoint => {
            //console.log(breakpoint)
            let dist_weight = getDistanceWeight(target.position(), source.position(), breakpoint)

            new_edge.data.segment_distances.push(dist_weight[0])
            new_edge.data.segment_weights.push(dist_weight[1])
          })

          new_edge.data.source = source.id()
          new_edge.data.target = target.id()
          new_edge.data.source_endpoint = undefined
          new_edge.data.target_endpoint = target_endpoint
          new_edge.data.type = 'inclusion'
          new_edge.data.source_arrow = 'none'
          new_edge.data.target_arrow = 'triangle'

          cy.remove(edge)
          cy.add(new_edge)
        })
      }
      
      cy.remove(restriction)
    })

    function getInputEdgeFromPropertyNode(restriction_node) {
      let e = null
      restriction_node.incomers('[type = "input"]').forEach(edge => {
        if (edge.source().data('type') == 'role' || edge.source().data('type') == 'attribute') {
          e = edge
        }
      })

      return e
    }

    function getNewEdgeRestriction(old_edge, input_edge, source, target, new_breakpoint) {
      let new_edge = old_edge.json()
      let breakpoints = []
      let other_breakpoints = []

      if (source.data('identity') == 'concept') {
        breakpoints = old_edge.segmentPoints() || []
        // the second part is the input edge going fro role/attribute to restriction node
        // we want to go from restriction to role/attribute => reverse breakpoints
        other_breakpoints = input_edge.segmentPoints() || []
        other_breakpoints = other_breakpoints.reverse()
      }
      else if (source.data('identity') == 'role') {
        breakpoints = input_edge.segmentPoints() || []
        other_breakpoints = old_edge.segmentPoints() || []
      }

      new_edge.data.segment_distances = []
      new_edge.data.segment_weights = []

      /**
       * ---- Processing breakpoints 
       * the new edge is composed by the edge connecting the concept to the restriction
       * and the input edge coming from a role/attribute.
       * Its breakpoints are the union of the breakpoints from these 2 edges.
       * The input edge is the final part of the new edge and the breakpoints must be reversed
       * because the original direction is <role> => <concept> whereas in the simplified version the direction
       * is always <concept> => <role> [this apply for DOMAIN restriction]
       */


      // the restriction node position will be another breakpoint in the new edge
      breakpoints.push(restriction.position())
      // now add the breakpoints coming from the second part of the edge
      breakpoints = breakpoints.concat(other_breakpoints.reverse())

      //  process breakpoints array and add distances and weights to the new edge
      breakpoints.forEach(breakpoint => {
        let dist_weight = getDistanceWeight(target.position(), source.position(), breakpoint)

        new_edge.data.segment_distances.push(dist_weight[0])
        new_edge.data.segment_weights.push(dist_weight[1])
      })

      new_edge.data.target = target.id()
      new_edge.data.target_endpoint = endpoint
      new_edge.data.type = 'inclusion'
      new_edge.data.source_arrow = 'none'
      new_edge.data.target_arrow = 'triangle'
    }

  }
}