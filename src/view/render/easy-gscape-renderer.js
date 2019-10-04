import GrapholscapeRenderer from './grapholscape_renderer'
import { getDistanceWeight } from '../../parsing/parser_util'
import cola from 'cytoscape-cola'
import cytoscape from 'cytoscape'

export default class EasyGscapeRenderer extends GrapholscapeRenderer {
  constructor(container, ontology, ui_controller) {
    super(container, ontology, ui_controller)
    cytoscape.use(cola)

    /** Use filters to mark nodes that must be removed and then remove them
     *  NOTE: filtering = hiding | removing = hiding + deleting
     * 
     *  To be removed:
     *  - DataTypes
     *  - ForAll
     *  - Qualified Existential
     *  - role chains
     *  - not (?)
     
    this.ontology.diagrams.forEach(diagram => {
      let cy = diagram.cy

      Object.keys(this.filters).map(key => {
        if (key != 'all' &&
            key != 'attributes' &&
            key != 'individuals') {
          this.filter(this.filters[key] , cy)

          // disable all unnecessary filters
          this.filters[key].disabled = true
        }
      })

      this.filterByCriterion(diagram.cy, this.isQualifiedExistential)
      this.filterByCriterion(diagram.cy, this.isExistentialWithCardinality)
      this.filterByCriterion(diagram.cy, this.isRoleChain)
      this.filterByCriterion(diagram.cy, this.isEnumeration)
      cy.remove('.filtered')
      this.simplifyDomainAndRange(diagram)
      this.simplifyComplexHierarchies(diagram)
      this.simplifyUnions(diagram)
      this.simplifyIntersections(diagram)
      this.simplifyRoleInverse(diagram)
    })
    */
  }

  simplifyDiagram(diagram) {
    let cy = cytoscape()
    cy.add(diagram.nodes)
    cy.add(diagram.edges)

    Object.keys(this.filters).map(key => {
      if (key != 'all' &&
          key != 'attributes' &&
          key != 'individuals') {
        this.filter(this.filters[key] , cy)

        // disable all unnecessary filters
        this.filters[key].disabled = true
      }
    })

    this.filterByCriterion(cy, this.isQualifiedExistential)
    this.filterByCriterion(cy, this.isExistentialWithCardinality)
    this.filterByCriterion(cy, this.isRoleChain)
    this.filterByCriterion(cy, this.isEnumeration)
    cy.remove('.filtered')
    this.simplifyDomainAndRange(cy)
    this.simplifyComplexHierarchies(cy)
    this.simplifyUnions(cy)
    this.simplifyIntersections(cy)
    this.simplifyRoleInverse(cy)

    return cy.$('*')
  }

  drawDiagram(diagram) {
    let simplified_eles = this.simplifyDiagram(diagram)
    diagram.nodes = simplified_eles.nodes().jsons()
    diagram.edges = simplified_eles.edges().jsons()

    super.drawDiagram(diagram)
    this.cy.autoungrabify(false)
    this.cy.nodes().lock()
    this.cy.nodes('.repositioned').unlock()

    let layout = this.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
      name: 'cola',
      randomize:false,
      fit: false,
      refresh:3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001
    })
    layout.run()
  }

  simplifyDomainAndRange(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy
    let eles = cy.$('*')

    // select domain and range restrictions
    // type start with 'domain' or 'range'
    let selector = `[type ^= "domain"],[type ^= "range"]`
    eles.filter(selector).forEach(restriction => {
      let input_edge = getInputEdgeFromPropertyToRestriction(restriction)
      let new_edge = null

      if (restriction.data('type') == 'domain-restriction') {
        // there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a concept as source and a role/attribute as target
        restriction.connectedEdges('[type != "input"]').forEach((edge, i) => {
          let edges = []

          /**
           * if the actual edge is between two existential, remove it and filter the other existential 
           */ 
          if ((edge.source().data('type') == 'domain-restriction' || edge.source().data('type') == 'range-restriction') &&
              (edge.target().data('type') == 'domain-restriction' || edge.target().data('type') == 'range-restriction')) {
            cy.remove(edge)
            return
          }

          // being a domain restriction, the simplified edge must go from a concept to the role/attribute
          // connected in input to the restriction.
          // if the actual edge has the restriction as source, the target is a concept and we consider it
          // as the source of the new edge          
          if (restriction.id() === edge.source().id()) {
            edges.push(this.reverseEdge(edge))
          }
          else
            edges.push(edge.json())

          // move attribute on restriction node position
          if (input_edge.source().data('type') == "attribute") {
            input_edge.source().position(restriction.position())
            new_edge = edges[0]
            new_edge.data.target = input_edge.source().id()
            new_edge.data.id += '_'+i
          } else {
            // concatenation only if the input is not an attribute
            edges.push(this.reverseEdge(input_edge))
            new_edge = this.createConcatenatedEdge(edges, cy, edges[0].data.id+'_'+i)
          }
          
          // add the type of input to the restriction as a class of the new edge
          // role or attribute, used in the stylesheet to assign different colors
          new_edge.classes += `${input_edge.source().data('type')} domain`
          new_edge.data.type = 'default' 

          cy.add(new_edge)
          cy.remove(edge)
        })
      }

      if (restriction.data('type') == 'range-restriction') {
        // there can be only inclusion and equivalence edges, for each of them we 
        // create a new edge that will have a role/attribute as source and a concept as target
        restriction.connectedEdges('[type != "input"]').forEach((edge, i) => {
          let edges = []

          /**
           * if the actual edge is between two existential, remove it and filter the other existential 
           */ 
          if ((edge.source().data('type') == 'domain-restriction' || edge.source().data('type') == 'range-restriction') &&
              (edge.target().data('type') == 'domain-restriction' || edge.target().data('type') == 'range-restriction')) {
            cy.remove(edge)
            return
          }

          edges.push(input_edge.json())
          // being a range restriction, the simplified edge must go from a role/attribute to the concept
          // if the actual edge has the concept as source, the target is a role/attribute and we need to
          // revert the edge
          if (restriction.id() === edge.source().id()) {
            edges.push(edge.json())
          }
          else edges.push(this.reverseEdge(edge))

          new_edge = this.createConcatenatedEdge(edges, cy, edges[0].data.id+'_'+i)
          // add the type of input to the restriction as a class of the new edge
          // role or attribute, used in the stylesheet to assign a different color
          new_edge.classes += `${input_edge.source().data('type')} range`
          new_edge.data.type = 'default' 

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

  simplifyAttributes(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy
    let eles = cy.$('*')

    eles.filter('[type = "attribute"]').forEach(attribute => {
      let owner = attribute.neighborhood('node')[0]
      let edges = attribute.connectedEdges()
      cy.remove(attribute)

      /* this may be not necessary
      let clone = attribute.json()
      clone.position = owner.position()     
      cy.add(clone)
      */
      attribute.position(owner.position()) // TO BE TESTED

      edges.forEach(edge => { 
        let new_edge = this.straightifyEdge(edge)
                
        cy.add(new_edge)
        cy.remove(edge)
      })

      
    })
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
    if (edge.data('segment_distances')) {
      new_edge.data.segment_distances = []
      new_edge.data.segment_weights = []
      new_edge.data.breakpoints.forEach( breakpoint => {
        let aux = getDistanceWeight(edge.source().position(), edge.target().position(), breakpoint)
        new_edge.data.segment_distances.push(aux[0])
        new_edge.data.segment_weights.push(aux[1])
      })    
    }

    return new_edge
  }
  /**
   * @param {array} edges - array of edges in json format
   * @param {cytoscape} cy
   * @param {string} id - the id to assign to the new edge
   */
  createConcatenatedEdge(edges, cy, id) {
    let source = edges[0].data.source
    let target = edges[edges.length - 1].data.target
    let segment_distances = []
    let segment_weights = []
    let breakpoints = []
    let aux = undefined

    edges.forEach( (edge, i, array) => {
      if (edge.data.breakpoints) {
        breakpoints = breakpoints.concat(edge.data.breakpoints)
        edge.data.breakpoints.forEach(breakpoint => {
          aux = getDistanceWeight(cy.getElementById(target).position(), cy.getElementById(source).position(), breakpoint)

          segment_distances.push(aux[0])
          segment_weights.push(aux[1])
        })
      }

      // add target position as new breakpoint
      if ( i < array.length - 1 ) {
        aux = getDistanceWeight(cy.getElementById(target).position(), 
                                    cy.getElementById(source).position(), 
                                    cy.getElementById(edge.data.target).position())
        segment_distances.push(aux[0])
        segment_weights.push(aux[1])
        breakpoints.push(cy.getElementById(edge.data.target).position())
      }
    })

    let new_edge = edges[0]
    new_edge.data.id = id
    new_edge.data.source = source
    new_edge.data.target = target
    new_edge.data.target_endpoint = edges[edges.length-1].data.target_endpoint
    new_edge.data.type = 'inclusion'
    new_edge.data.segment_distances = segment_distances
    new_edge.data.segment_weights = segment_weights
    new_edge.data.breakpoints = breakpoints

    return new_edge
  }

  // filter nodes if the criterion function return true
  // criterion must be a function returning a boolean value for a given a node
  filterByCriterion(cy_instance, criterion) {
    let cy = cy_instance || this.cy
    cy.$('*').forEach(node => {
      if (criterion(node)) {
        this.filterElem(node, cy)
      }
    })
  }

  isQualifiedExistential(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && (node.data('label') == 'exists')) {
      return node.incomers('edge[type = "input"]').size() > 1 ? true : false
    }

    return false
  }

  isExistentialWithCardinality(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && node.data('label').search(/[0-9]/g) >= 0) {
      return true
    }

    return false
  }

  isRoleChain(node) {
    if (node.data('type') == 'role-chain')
      return true
    else
      return false
  }

  isComplexHierarchy(node) {
    if (node.data('type') != 'union' &&
        node.data('type') != 'disjoint-union' &&
        node.data('type') != 'intersection')
      return false

    let outcome = false
    node.incomers('[type *= "input"]').forEach(input => {
      if (input.source().data('type') != 'concept') {
        outcome = true
      }
    })

    return outcome
  }

  isEnumeration(node) {
    return node.data('type') == 'enumeration' ? true : false
  }

  simplifyUnions(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy
    let eles = cy.$('*')

    eles.filter('[type $= "union"]').forEach( union => {
      this.makeDummyPoint(union)

      union.incomers('edge[type = "input"]').data('type', 'easy_input')
      cy.remove(union.incomers('edge[type = "inclusion"]'))

      // process equivalence edges
      union.connectedEdges('edge[type = "equivalence"]').forEach(edge => {
        edge.data('type','inclusion')
        edge.data('target_label', 'C')

        if (edge.source().id() != union.id()) {
          let reversed_edge = this.reverseEdge(edge)
          cy.remove(edge)
          cy.add(reversed_edge)
        }
      })

      // process inclusion edges
      union.outgoers('edge[type = "inclusion"]').forEach(inclusion => {
        inclusion.addClass('hierarchy')
        if (union.data('type') == 'disjoint-union')
          inclusion.addClass('disjoint')
      })

      if (union.data('label'))
        union.data('label', '')

      this.replicateAttributes(union)

      // replicate attributes on input classes
      /*
      let input_classes = union.incomers('[type *= "input"]').sources()
      union.neighborhood('[type = "attribute"]').forEach(attribute => {
        
        input_classes.forEach( (concept,i) => {
          let new_attribute = attribute.json()
          new_attribute.position = concept.position()
          new_attribute.data.id += '_clone'+i
          new_attribute.classes += ' repositioned'
          cy.add(new_attribute)
          let edge = {
            data: {
              id: new_attribute.data.id + '_edge',
              source: new_attribute.data.id,
              target: concept.id(),
            },
            classes: 'attribute',
          }

          cy.add(edge)
        })

        cy.remove(attribute)
      })
      */


      // replicate role tipization on input classes
      this.replicateRoleTypizations(union)
      
      // if the union has not any connected non-input edges, then remove it
      if (union.connectedEdges('[type !*= "input"]').size() == 0)
        cy.remove(union)
    })
  }

  makeDummyPoint(node) {
    node.data('width', 0.1)
    node.data('height', 0.1)
  }

  straightifyEdge(edge) {
    let new_edge = edge.json()
    delete new_edge.data.breakpoints
    delete new_edge.data.segment_distances
    delete new_edge.data.segment_weights
    delete new_edge.data.source_endpoint
    delete new_edge.data.target_endpoint

    return new_edge
  }

  simplifyIntersections(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy

    cy.$('node[type = "intersection"]').forEach( and => {
      this.replicateAttributes(and)
      this.replicateRoleTypizations(and)

      // if there are no incoming inclusions or equivalence and no equivalences connected,
      // remove the intersection
      if (and.incomers('edge[type !*= "input"]').size() == 0 && 
          and.connectedEdges('edge[type = "equivalence"]').size() == 0) {
        this.filterElem(and, cy)
      } else {
        // process incoming inclusion
        and.incomers('edge[type !*= "input"]').forEach(edge => {
          /**
           * create a new ISA edge for each input class
           * the new edge will be a concatenation:
           *  - ISA towards the 'and' node + input edge
           * 
           * the input edge must be reversed
           * In case of equivalence edge, we only consider the
           * isa towards the 'and' node and discard the other direction
           */        
          and.incomers('edge[type = "input"]').forEach( (input, i) => {
            /**
             * if the edge is an equivalence, we must consider it as an
             * incoming edge in any case and ignore the opposite direction.
             * so if the edge is outgoing from the intersection, we reverse it
             */
            let edges = []
            if (edge.source().id() == and.id()) {
              edges.push(this.reverseEdge(edge))
            } else edges.push(edge.json())

            let new_id = `${edge.id()}_${i}`
            edges.push(this.reverseEdge(input))
            let new_isa = this.createConcatenatedEdge(edges, cy, new_id)

            cy.remove(edge)
            cy.add(new_isa)
          })
        })
        
        cy.remove(and)
      }
    })
  }

  replicateRoleTypizations(constructor) {
    let cy = constructor.cy()
    // replicate role tipization on input classes
    constructor.connectedEdges('edge.role').forEach(role_edge => {
      constructor.incomers('[type *= "input"]').forEach( (input,i) => {
        let new_id = `${role_edge.id()}_${i}`
        let new_edge = {}
        let edges = []
        /**
         * if the connected non input edge is only one (the one we are processing)
         * then the new edge will be the concatenation of the input edge + role edge
         */
        if(constructor.connectedEdges('[type !*= "input"]').size() == 1) {
          if(role_edge.hasClass('range')) {
            edges.push(role_edge.json())
            edges.push(this.reverseEdge(input))
          } else{
            edges.push(input.json())
            edges.push(role_edge.json())
          }
          
          new_edge = this.createConcatenatedEdge(edges, cy, new_id)
          new_edge.data.type = 'default'
          new_edge.classes = role_edge.json().classes
        } else {
          /**
           * Otherwise the constructor node will not be deleted and the new role edges can't
           * pass over the constructor node. We then just properly change the source/target
           * of the role edge. In this way the resulting edges will go from the last
           * breakpoint of the original role edge towards the input classes of the constructor  
          */
          new_edge = role_edge.json()
          new_edge.data.id = new_id
          
          let target = undefined
          let source = undefined
          if(role_edge.hasClass('range')) {
            target = input.source()
            source = role_edge.source()
            new_edge.data.target = input.source().id() 
          }
          else {
            target = role_edge.target()
            source = input.source()
            new_edge.data.source = input.source().id()
          }

          // Keep the original role edge breakpoints
          let segment_distances = []
          let segment_weights = []
          new_edge.data.breakpoints.forEach( breakpoint => {
            let aux = getDistanceWeight(target.position(), source.position(), breakpoint)
            segment_distances.push(aux[0])
            segment_weights.push(aux[1])
          })

          new_edge.data.segment_distances = segment_distances
          new_edge.data.segment_weights = segment_weights
        }
        cy.add(new_edge)
      })

      cy.remove(role_edge)
    })
  }

  simplifyComplexHierarchies(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy

    cy.nodes('[type = "intersection"],[type = "union"],[type = "disjoint-union"]').forEach(node => {
      if(this.isComplexHierarchy(node)) {
        this.replicateAttributes(node)
        this.filterElem(node)
      }
    })

    cy.remove('.filtered')
  }

  replicateAttributes(node) {
    let cy = node.cy()
    let all_classes = getAllInputs(node)
    let all_attributes = node.neighborhood('[type = "attribute"]')
    all_classes.forEach( (concept,i) => {
      all_attributes.forEach((attribute, j) => {
        addAttribute(concept, i, attribute)
      })
    })

    cy.remove(all_attributes)

    function addAttribute(concept, i, attribute) {
      let new_attribute = attribute.json()
      new_attribute.position = concept.position()
      new_attribute.data.id += '_'+i+'_'+concept.id()
      new_attribute.classes += ' repositioned'
      cy.add(new_attribute)
      let edge = {
        data: {
          id: new_attribute.data.id + '_edge',
          target: new_attribute.data.id,
          source: concept.id(),
        },
        classes: 'attribute',
      }

      cy.add(edge)
    }

    function getAllInputs(node) {
      let all_classes = node.cy().collection()

      let input_edges = node.incomers('edge[type *= "input"]')
      all_classes = all_classes.union(input_edges.sources('[type = "concept"]'))

      input_edges.sources('[type != "concept"]').forEach(constructor => {
        all_classes = all_classes.union(getAllInputs(constructor))
        constructor.addClass('attr_replicated')
      })

      return all_classes
    }
  }

  simplifyRoleInverse(cytoscape_instance) {
    let cy = cytoscape_instance || this.cy

    cy.nodes('[type = "role-inverse"]').forEach(role_inverse => {
      let new_edges_count = 0
      // the input role is only one
      let input_edge = role_inverse.incomers('[type *= "input"]')
      
      // for each other edge connected, create a concatenated edge
      // the edge is directed towards the input_role
      role_inverse.connectedEdges('[type !*= "input"]').forEach((edge, i) => {
        let edges = []
        // if the edge is outgoing from the role-inverse node, then we need to reverse it
        if (edge.source().id() == role_inverse.id()) {
          edges.push(this.reverseEdge(edge))
        } else {
          edges.push(edge.json())
        }

        // the input edge must always be reversed 
        edges.push(this.reverseEdge(input_edge))
        let new_id = input_edge.id() + '_' + i
        let new_edge = this.createConcatenatedEdge(edges, cy, new_id)
        new_edge.data.type = 'inclusion'
        new_edge.classes = 'inverse-of'
        cy.add(new_edge)
        cy.remove(edge)
        new_edges_count += 1
      })

      if (new_edges_count > 1) {
        cy.remove(input_edge)
        this.makeDummyPoint(role_inverse)
        role_inverse.data('label', 'inverse Of')
        role_inverse.data('labelXpos', 0)
        role_inverse.data('labelYpos', 0)
        role_inverse.data('text_background', true)
      } else {
        input_edge.source().connectedEdges('edge.inverse-of').data('edge_label','inverse Of')
        cy.remove(role_inverse)
      }
    })
  }

  filter(filter, cy_instance) {
    super.filter(filter, cy_instance)

    /**
     * force the value_domain filter to stay disabled
     * (activating the attributes filter may able the value_domain filter
     *  which must stay always disabled in simplified visualization)
     */ 
    this.filters.value_domain.disabled = true
  }

  unfilter(filter, cy_instance) {
    super.unfilter(filter, cy_instance)

    /**
     * force the value_domain filter to stay disabled
     * (activating the attributes filter may able the value_domain filter
     *  which must stay always disabled in simplified visualization)
     */ 
    this.filters.value_domain.disabled = true
  }
}