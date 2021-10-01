import cytoscape from 'cytoscape'
import Diagram from '../model/diagram'
import GrapholscapeRenderer from '../view/render/default-renderer'
import { getDistanceWeight } from '../parsing/parser_util'
import Ontology from '../model/ontology'

export default function computeSimplifiedOntologies(ontology) {
  let aux_renderer = new GrapholscapeRenderer(null)
  let lite_ontology = new Ontology(ontology.name, ontology.version)
  let float_ontology = new Ontology(ontology.name, ontology.version)
  let new_ontologies = {
    lite : lite_ontology,
    float : float_ontology,
  }

  return new Promise( (resolve, reject) => {
    try {
      window.setTimeout(() => {
        ontology.diagrams.forEach( diagram => {
          let lite_diagram = new Diagram(diagram.name, diagram.id)
          let float_diagram = new Diagram(diagram.name, diagram.id)
          lite_diagram.addElems(simplifyDiagramLite(diagram.nodes, diagram.edges))
          lite_ontology.addDiagram(lite_diagram)
          float_diagram.addElems(simplifyDiagramFloat(lite_diagram.nodes, lite_diagram.edges))
          float_ontology.addDiagram(float_diagram)
        })
        resolve(new_ontologies)
      }, 1)
    } catch (e) {reject(e)}
  })



// ----------------------------------
  function simplifyDiagramLite(nodes, edges) {
    let cy = cytoscape()

    cy.add(nodes)
    cy.add(edges)

    filterByCriterion(cy, (node) => {
      switch(node.data('type')) {
        case 'complement' :
        case 'value-domain':
        case 'role-chain':
        case 'enumeration':
          return true

        case 'domain-restriction':
        case 'range-restriction':
          if (node.data('displayed_name') == 'forall')
            return true
          else
            return false
      }
    })

    filterByCriterion(cy, isQualifiedRestriction)
    filterByCriterion(cy, isExistentialWithCardinality)
    filterByCriterion(cy, inputEdgesBetweenRestrictions)
    cy.remove('.filtered')
    simplifyDomainAndRange(cy)
    simplifyComplexHierarchies(cy)
    simplifyUnions(cy)
    simplifyIntersections(cy)
    simplifyRoleInverse(cy)

    return cy.$('*')
  }

  function simplifyDomainAndRange(cy) {
    let eles = cy.$('*')

    // select domain and range restrictions
    // type start with 'domain' or 'range'
    let selector = `[type ^= "domain"],[type ^= "range"]`
    eles.filter(selector).forEach(restriction => {
      let input_edge = getInputEdgeFromPropertyToRestriction(restriction)
      let new_edge = null
      let type = restriction.data('type') == 'domain-restriction' ? 'domain' : 'range'

      restriction.connectedEdges('[type != "input"]').forEach((edgeToRestriction, i) => {
        new_edge = createRoleEdge(edgeToRestriction, input_edge, type, i)
        if(new_edge) {
          cy.add(new_edge)
          cy.remove(edgeToRestriction)
        }
      })
      aux_renderer.filterElem(restriction, '', cy)
      cy.remove('.filtered')
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

    function createRoleEdge(edgeToRestriction, edgeFromProperty, type, i) {
      let edges = []
      let new_edge = null

      /**
       * if the actual edge is between two existential, remove it and filter the other existential
       */
      if ((edgeToRestriction.source().data('type') == 'domain-restriction' ||
           edgeToRestriction.source().data('type') == 'range-restriction') &&
          (edgeToRestriction.target().data('type') == 'domain-restriction' ||
           edgeToRestriction.target().data('type') == 'range-restriction')) {
        cy.remove(edgeToRestriction)
        return new_edge
      }

      if (edgeToRestriction.target().data('id') !== edgeFromProperty.target().data('id')) {
        edges.push(reverseEdge(edgeToRestriction))
      } else {
        edges.push(edgeToRestriction.json())
      }

      // move attribute on restriction node position
      if (edgeFromProperty.source().data('type') == "attribute") {
        edgeFromProperty.source().position(edgeFromProperty.target().position())
        new_edge = edges[0]
        new_edge.data.target = edgeFromProperty.source().id()
        new_edge.data.id += '_'+i
      } else {
        // concatenation only if the input is not an attribute
        edges.push(reverseEdge(edgeFromProperty))
        new_edge = createConcatenatedEdge(edges, cy, edges[0].data.id+'_'+i)
      }

      // add the type of input to the restriction as a class of the new edge
      // role or attribute, used in the stylesheet to assign different colors
      new_edge.classes += `${edgeFromProperty.source().data('type')} ${type}`
      new_edge.data.type = 'default'

      return new_edge
    }
  }

  function reverseEdge(edge) {
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
  function createConcatenatedEdge(edges, cy, id) {
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
  function filterByCriterion(cy_instance, criterion) {
    let cy = cy_instance
    cy.$('*').forEach(node => {
      if (criterion(node)) {
        aux_renderer.filterElem(node, '', cy)
      }
    })
  }

  function isQualifiedRestriction(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && (node.data('displayed_name') == 'exists')) {
      return node.incomers('edge[type = "input"]').size() > 1 ? true : false
    }

    return false
  }

  function inputEdgesBetweenRestrictions(node) {
    let outcome = false

    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')) {
      node.incomers('edge[type = "input"]').forEach(edge => {
        if (edge.source().data('type').endsWith('restriction')){
          outcome = true
        }
      })
    }
    return outcome
  }

  function isExistentialWithCardinality(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction')
        && node.data('displayed_name').search(/[0-9]/g) >= 0) {
      return true
    }

    return false
  }

  function isComplexHierarchy(node) {
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

  function simplifyUnions(cy) {
    let eles = cy.$('*')

    eles.filter('[type $= "union"]').forEach( union => {
      makeDummyPoint(union)

      union.incomers('edge[type = "input"]').data('type', 'easy_input')
      cy.remove(union.incomers('edge[type = "inclusion"]'))

      // process equivalence edges
      union.connectedEdges('edge[type = "equivalence"]').forEach(edge => {
        edge.data('type','inclusion')
        edge.data('target_label', 'C')

        if (edge.source().id() != union.id()) {
          let reversed_edge =  reverseEdge(edge)
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

      replicateAttributes(union)

      // replicate role tipization on input classes
      replicateRoleTypizations(union)

      // if the union has not any connected non-input edges, then remove it
      if (union.connectedEdges('[type !*= "input"]').size() == 0)
        cy.remove(union)
    })
  }

  function makeDummyPoint(node) {
    node.data('width', 0.1)
    node.data('height', 0.1)
    node.addClass('dummy')
  }

  function simplifyIntersections(cytoscape_instance) {
    let cy = cytoscape_instance

    cy.$('node[type = "intersection"]').forEach( and => {
      replicateAttributes(and)
      replicateRoleTypizations(and)

      // if there are no incoming inclusions or equivalence and no equivalences connected,
      // remove the intersection
      if (and.incomers('edge[type !*= "input"]').size() == 0 &&
          and.connectedEdges('edge[type = "equivalence"]').size() == 0) {
         aux_renderer.filterElem(and, '', cy)
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
              edges.push( reverseEdge(edge))
            } else edges.push(edge.json())

            let new_id = `${edge.id()}_${i}`
            edges.push( reverseEdge(input))
            let new_isa = createConcatenatedEdge(edges, cy, new_id)

            cy.remove(edge)
            cy.add(new_isa)
          })
        })

        cy.remove(and)
      }
    })
  }

  function replicateRoleTypizations(constructor) {
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
        if(constructor.connectedEdges('[type !*= "input"]').size() <= 1) {
          edges.push(input.json())
          edges.push(role_edge.json())
          new_edge = createConcatenatedEdge(edges, cy, new_id)
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
          target = role_edge.target()
          source = input.source()
          new_edge.data.source = input.source().id()

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

  function simplifyComplexHierarchies(cytoscape_instance) {
    let cy = cytoscape_instance

    cy.nodes('[type = "intersection"],[type = "union"],[type = "disjoint-union"]').forEach(node => {
      if(isComplexHierarchy(node)) {
        replicateAttributes(node)
        aux_renderer.filterElem(node, '', cy)
      }
    })

    cy.remove('.filtered')
  }

  function replicateAttributes(node) {
    let cy = node.cy()
    let all_classes = getAllInputs(node)
    let all_attributes = node.neighborhood('[type = "attribute"]')
    let all_inclusion_attributes = cy.collection()

    all_classes.forEach( (concept,i) => {
      all_attributes.forEach((attribute, j) => {
        addAttribute(concept, i, attribute, 'attribute')
      })
    })

    cy.remove(all_attributes)
    aux_renderer.filterElem(all_inclusion_attributes, '', cy)

    function addAttribute(target, i, attribute, edge_classes) {
      let new_attribute = attribute.json()
      new_attribute.position = target.position()
      new_attribute.data.id += '_'+i+'_'+target.id()
      new_attribute.classes += ' repositioned'
      //attribute.addClass('repositioned')
      cy.add(new_attribute)
      let edge = {
        data: {
          id: new_attribute.data.id + '_edge',
          target: new_attribute.data.id,
          source: target.id(),
        },
        classes: edge_classes,
      }
      cy.add(edge)

      // recursively add new attributes connected to replicated attributes by inclusions
      if (!target.hasClass('repositioned')) {
        attribute.neighborhood('[type = "attribute"]').forEach( (inclusion_attribute, j) => {
          if(all_attributes.contains(inclusion_attribute)) {
            return
          }

          addAttribute(cy.$id(new_attribute.data.id), j, inclusion_attribute, 'inclusion')
          all_inclusion_attributes = all_inclusion_attributes.union(inclusion_attribute)
        })
      }
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

  function simplifyRoleInverse(cytoscape_instance) {
    let cy = cytoscape_instance

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
          edges.push( reverseEdge(edge))
        } else {
          edges.push(edge.json())
        }

        // the input edge must always be reversed
        edges.push( reverseEdge(input_edge))
        let new_id = input_edge.id() + '_' + i
        let new_edge = createConcatenatedEdge(edges, cy, new_id)
        new_edge.data.type = 'inclusion'
        new_edge.classes = 'inverse-of'
        cy.add(new_edge)
        cy.remove(edge)
        new_edges_count += 1
      })

      if (new_edges_count > 1) {
        cy.remove(input_edge)
        makeDummyPoint(role_inverse)
        role_inverse.data('label', 'inverse Of')
        role_inverse.data('labelXpos', 0)
        role_inverse.data('labelYpos', 0)
        role_inverse.data('text_background', true)
      } else {
        if (input_edge.source())
          input_edge.source().connectedEdges('edge.inverse-of').data('displayed_name','inverse Of')
        cy.remove(role_inverse)
      }
    })
  }

  // -------- FLOAT ----------
  function simplifyDiagramFloat(nodes, edges) {
    let cy = cytoscape()
    cy.add(nodes)
    cy.add(edges)

    simplifyRolesFloat(cy)
    simplifyHierarchiesFloat(cy)
    simplifyAttributesFloat(cy)
    cy.edges().removeData('segment_distances')
    cy.edges().removeData('segment_weights')
    cy.edges().removeData('target_endpoint')
    cy.edges().removeData('source_endpoint')
    cy.$('[type = "concept"]').addClass('bubble')
    return cy.$('*')
  }

  function simplifyRolesFloat(cy) {
    let eles = cy.$('[type = "role"]')

    eles.forEach(role => {
      let edges = role.incomers('edge.role')
      let domains = edges.filter('.domain')
      let range_nodes = edges.filter('.range').sources()

      domains.forEach(domain => {
        range_nodes.forEach((target,i) => {

          let new_edge = {
            data : {
              id : domain.id() + '-' + i,
              id_xml : domain.target().data('id_xml'),
              diagram_id : domain.target().data('diagram_id'),
              source : domain.source().id(),
              target : target.id(),
              type : domain.target().data('type'),
              iri : domain.target().data('iri'),
              displayed_name : domain.target().data('displayed_name').replace(/\r?\n|\r/g, ''),
              label : domain.target().data('label'),
              description : domain.target().data('description'),
              functional : domain.target().data('functional'),
              inverseFunctional : domain.target().data('inverseFunctional'),
              asymmetric : domain.target().data('asymmetric'),
              irreflexive : domain.target().data('irreflexive'),
              reflexive : domain.target().data('reflexive'),
              symmetric : domain.target().data('symmetric'),
              transitive : domain.target().data('transitive')
            },
            classes : 'role predicate'
          }

          cy.add(new_edge)
          if(cy.getElementById(new_edge.data.id).isLoop()) {
            let loop_edge = cy.getElementById(new_edge.data.id)
            loop_edge.data('control_point_step_size', target.data('width'))
          }
        })
      })
      cy.remove(role)
    })
  }

  function simplifyHierarchiesFloat(cy) {
    cy.$('.dummy').forEach(dummy => {
      dummy.neighborhood('node').forEach(neighbor => {
        neighbor.position(dummy.position())
      })
      dummy.data('width', 35)
      dummy.addClass('bubble')
    })
  }

  function simplifyAttributesFloat(cy) {
    cy.$('[type = "attribute"]').forEach(attribute => {
      attribute.neighborhood('node').forEach(neighbor => {
        attribute.position(neighbor.position())
      })
    })
  }
}