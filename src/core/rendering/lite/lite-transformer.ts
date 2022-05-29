import cytoscape, { Collection, CollectionReturnValue, EdgeSingular, NodeSingular, SingularElementReturnValue } from "cytoscape";
import { Diagram, GrapholEdge, GrapholElement, GrapholNode, GrapholTypesEnum, RenderStatesEnum } from "../../../model";
import DiagramRepresentation from "../../../model/diagrams/diagram-representation";
import { isGrapholEdge } from "../../../model/graphol-elems/edge";
import { isGrapholNode } from "../../../model/graphol-elems/node";
import { cytoscapeFilter } from "../filtering";
import Breakpoint from '../../../model/graphol-elems/breakpoint'

interface Transformer {
  transform(diagram: Diagram): DiagramRepresentation
}

export default class LiteTransformer implements Transformer {
  private result: DiagramRepresentation

  get newCy() { return this.result.cy }

  transform(diagram: Diagram): DiagramRepresentation {
    this.result = new DiagramRepresentation()
    this.result.grapholElements = new Map(diagram.representations.get(RenderStatesEnum.GRAPHOL).grapholElements)

    this.newCy.add(diagram.representations.get(RenderStatesEnum.GRAPHOL).cy.elements())
    this.newCy.elements().removeClass('filtered') // make all filtered elements not filtered anymore

    this.filterByCriterion((node) => {
      switch (node.data('type')) {
        case GrapholTypesEnum.COMPLEMENT:
        case GrapholTypesEnum.VALUE_DOMAIN:
        case GrapholTypesEnum.ROLE_CHAIN:
        case GrapholTypesEnum.ENUMERATION:
        case GrapholTypesEnum.KEY:
          return true

        case GrapholTypesEnum.DOMAIN_RESTRICTION:
        case GrapholTypesEnum.RANGE_RESTRICTION:
          if (node.data('displayed_name') == 'forall')
            return true
          else
            return false
      }
    })

    this.filterByCriterion(this.isQualifiedRestriction)
    this.filterByCriterion(this.isCardinalityRestriction)
    this.filterByCriterion(this.inputEdgesBetweenRestrictions)
    this.deleteFilteredElements()
    this.simplifyDomainAndRange()
    this.simplifyComplexHierarchies(cy)
    // simplifyUnions(cy)
    // simplifyIntersections(cy)
    // simplifyRoleInverse(cy)

    // return cy.$('*')
    console.log(this.result)
    return this.result
  }

  private isQualifiedRestriction = (node: cytoscape.SingularElementReturnValue) => {
    const grapholElement = this.getGrapholElement(node.id())
    if (this.isRestriction(grapholElement)) {
      return node.incomers(`edge[type = "${GrapholTypesEnum.INPUT}"]`).size() > 1 ? true : false
    }

    return false
  }

  private isCardinalityRestriction = (node: cytoscape.SingularElementReturnValue) => {
    const grapholElement = this.getGrapholElement(node.id())
    if (this.isRestriction(grapholElement) && grapholElement.displayedName.search(/[0-9]/g) >= 0) {
      return true
    }

    return false
  }

  private inputEdgesBetweenRestrictions = (node: cytoscape.SingularElementReturnValue) => {
    const grapholElement = this.getGrapholElement(node.id())
    let outcome = false

    if (this.isRestriction(grapholElement)) {
      node.incomers(`edge[type = "${GrapholTypesEnum.INPUT}"]`).forEach(edge => {
        const sourceGrapholElement = this.getGrapholElement(edge.source().id())
        if (this.isRestriction(sourceGrapholElement)) {
          outcome = true
        }
      })
    }
    return outcome
  }

  private simplifyDomainAndRange() {
    /**
     * Get all input incomers and pick the one coming from a object/data property
     * @param restriction 
     * @returns the input from object/data property to the given restriction
     */
    const getInputEdgeFromPropertyToRestriction = (restriction: NodeSingular) => {
      let edgeResult: EdgeSingular
      const sources = restriction.incomers(`edge[type = "${GrapholTypesEnum.INPUT}"]`).sources()
      const source = sources.filter(node => {
        const grapholNode = this.getGrapholElement(node.id())
        return grapholNode.is(GrapholTypesEnum.OBJECT_PROPERTY) || grapholNode.is(GrapholTypesEnum.DATA_PROPERTY)
      })

      edgeResult = source[0].edgesTo(restriction)[0]

      if (edgeResult) {
        return this.getGrapholElement(edgeResult.id()) as GrapholEdge
      }
    }

    /**
     * Given a domain/range restriction, we need each edge on the restriction of type != input
     * to be transformed into a ROLE EDGE going into the object/data property using the 
     * input edge from property -> restriction (here we assume it is already been reversed).
     * @param edgeToRestriction an edge connected to the restriction node, will be transformed into a role edge
     * @param edgeFromProperty the edge from property to restriction (reversed, so it's going from restriction to property)
     * @param restrictionNode the restriction node, must become a breakpoint
     */
    const transformIntoRoleEdge = (edgeToRestriction: GrapholEdge, edgeFromProperty: GrapholEdge, restrictionNode: GrapholNode, i) => {
      // let edges = []
      // let new_edge = null

      /**
       * if the actual edge is between two existential, remove it and filter the other existential
       */
      // if ((edgeToRestriction.source().data('type') == GrapholTypesEnum.DOMAIN_RESTRICTION ||
      //      edgeToRestriction.source().data('type') == GrapholTypesEnum.RANGE_RESTRICTION) &&
      //     (edgeToRestriction.target().data('type') == GrapholTypesEnum.DOMAIN_RESTRICTION ||
      //      edgeToRestriction.target().data('type') == GrapholTypesEnum.RANGE_RESTRICTION)) {
      //   cy.remove(edgeToRestriction)
      //   return new_edge
      // }

      if (edgeToRestriction.targetId !== restrictionNode.id) {
        this.reverseEdge(edgeToRestriction)
      }

      const sourceNode = this.getGrapholElement(edgeToRestriction.sourceId) as GrapholNode
      const propertyNode = this.getGrapholElement(edgeFromProperty.targetId) as GrapholNode
      edgeToRestriction.targetId = propertyNode.id
      // move attribute on restriction node position
      if (propertyNode.is(GrapholTypesEnum.DATA_PROPERTY)) {
        edgeToRestriction.type = GrapholTypesEnum.DATA_PROPERTY
        propertyNode.x = restrictionNode.position.x
        propertyNode.y = restrictionNode.position.y
        this.result.updateElement(propertyNode)
        //new_edge = edges[0]
      }

      if (propertyNode.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
        edgeToRestriction.type = restrictionNode.type
        // restriction node must become a new breakpoint
        edgeToRestriction.addBreakPoint(new Breakpoint(restrictionNode.x, restrictionNode.y))

        // each breakpoint from restriction to property must become a breakpoint for the result edge
        edgeFromProperty.breakpoints.forEach(breakpoint => {
          edgeToRestriction.addBreakPoint(breakpoint)
        })
      }

      edgeToRestriction.computeBreakpointsDistancesWeights(sourceNode.position, propertyNode.position)
      this.result.updateElement(edgeToRestriction)
    }


    //let eles = cy.$('*')
    let grapholRestrictionNode: GrapholElement
    // select domain and range restrictions
    this.result.cy.nodes().forEach(restriction => {
      grapholRestrictionNode = this.getGrapholElement(restriction.id())
      if (!this.isRestriction(grapholRestrictionNode)) return

      const inputGrapholEdge = getInputEdgeFromPropertyToRestriction(restriction)
      // Final role edge will be concatenated with this one, 
      // so we need to revert it to make it point to the obj/data property
      this.reverseEdge(inputGrapholEdge)
      // create a new role edge concatenating each edge different from inputs
      // to the input edge from object/data property to restriction node
      restriction.connectedEdges('[type != "input"]').forEach((edgeToRestriction, i) => {
        const grapholEdgeToRestriction = this.getGrapholElement(edgeToRestriction.id())
        if (!isGrapholEdge(grapholEdgeToRestriction) || !isGrapholNode(grapholRestrictionNode)) return

        transformIntoRoleEdge(grapholEdgeToRestriction, inputGrapholEdge, grapholRestrictionNode, i)
      })

      restriction.addClass('filtered')
      this.deleteFilteredElements()
    })

    // this.deleteFilteredElements()
  }

  reverseEdge(edge: GrapholEdge) {
    //let new_edge = edge.json()
    let sourceIdAux = edge.sourceId
    edge.sourceId = edge.targetId
    edge.targetId = sourceIdAux

    let sourceEndpointAux = edge.sourceEndpoint
    edge.sourceEndpoint = edge.targetEndpoint
    edge.targetEndpoint = sourceEndpointAux

    edge.controlpoints = edge.controlpoints.reverse()
    edge.breakpoints.forEach(breakpoint => {
      const source = this.newCy.$id(edge.sourceId)
      const target = this.newCy.$id(edge.targetId)
      // update distances and weights
      breakpoint.setSourceTarget(source.position(), target.position())
    })

    // new_edge.data.breakpoints = edge.data('breakpoints').reverse()
    // if (edge.data('segment_distances')) {
    //   new_edge.data.segment_distances = []
    //   new_edge.data.segment_weights = []
    //   new_edge.data.breakpoints.forEach( breakpoint => {
    //     let aux = getDistanceWeight(edge.source().position(), edge.target().position(), breakpoint)
    //     new_edge.data.segment_distances.push(aux[0])
    //     new_edge.data.segment_weights.push(aux[1])
    //   })
    // }
  }

  simplifyComplexHierarchies() {
    this.newCy.nodes().forEach(node => {
      if (this.isComplexHierarchy(node)) {
        this.replicateAttributes(node)
        //aux_renderer.filterElem(node, '', cy)
      }
    })

    this.deleteFilteredElements()
  }

  private isComplexHierarchy(node: NodeSingular) {
    const grapholNode = this.getGrapholElement(node.id())
    if (!grapholNode.is(GrapholTypesEnum.UNION) ||
      !grapholNode.is(GrapholTypesEnum.DISJOINT_UNION) ||
      !grapholNode.is(GrapholTypesEnum.INTERSECTION)
    )
      return false

    // Complex hierarchy if it has something different from a class as input
    const inputNodesNotConcepts = node.incomers(`edge`)
      .filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
      .sources()
      .filter(node => !this.getGrapholElement(node.id()).is(GrapholTypesEnum.CONCEPT))

    return inputNodesNotConcepts.empty()
  }

  private replicateAttributes(node: NodeSingular) {
    /**
     * Given a hierarchy node, recursively retrieve all input classes nodes
     * @param node the hierearchy node
     * @returns a collection of classes nodes
     */
     const getAllInputClasses = (node: NodeSingular): CollectionReturnValue => {
      let allInputClasses = node.cy().collection()

      let inputEdges = node.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
      allInputClasses = allInputClasses.union(inputEdges.sources().filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.CONCEPT)))

      inputEdges.sources().difference(allInputClasses).forEach(constructor => {
        allInputClasses = allInputClasses.union(getAllInputClasses(constructor))
      })

      return allInputClasses
    }
    
    let allClasses = getAllInputClasses(node)
    let allAttributes = node.neighborhood(`node`).filter(node => node.is(GrapholTypesEnum.DATA_PROPERTY))
    let all_inclusion_attributes = this.newCy.collection()

    allClasses.forEach((concept, i) => {
      allAttributes.forEach((attribute, j) => {
        const newAttribute = new GrapholNode(`duplicate-${attribute.id()}-${i}`)
        const newAttributeEdge = new GrapholEdge(`e-${concept.id()}-${attribute.id()}`)

        newAttribute.position = concept.position()
        newAttribute.type = GrapholTypesEnum.DATA_PROPERTY
        //addAttribute(concept, i, attribute, GrapholTypesEnum.DATA_PROPERTY)
      })
    })

    this.newCy.remove(allAttributes)
    aux_renderer.filterElem(all_inclusion_attributes, '', cy)

    function addAttribute(target, i, attribute, edge_classes) {
      let new_attribute = attribute.json()
      new_attribute.position = target.position()
      new_attribute.data.id += '_' + i + '_' + target.id()
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
        attribute.neighborhood(`[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).forEach((inclusion_attribute, j) => {
          if (allAttributes.contains(inclusion_attribute)) {
            return
          }

          addAttribute(cy.$id(new_attribute.data.id), j, inclusion_attribute, 'inclusion')
          all_inclusion_attributes = all_inclusion_attributes.union(inclusion_attribute)
        })
      }
    }
  }


  // filter nodes if the criterion function returns true
  // criterion must be a function returning a boolean value for a given a node
  private filterByCriterion(criterion: (element: cytoscape.SingularElementReturnValue) => boolean) {
    let count = 0
    this.newCy.$('*').forEach(node => {
      if (criterion(node)) {
        count += 1
        cytoscapeFilter(node.id(), '', this.newCy)
      }
    })
    console.log(count)
  }

  private deleteFilteredElements() {
    const deletedElements = this.newCy.remove('.filtered')
    console.log('deleted')
    deletedElements.forEach(elem => {
      console.log(elem)
      this.result.grapholElements.delete(elem.id())
    })
  }


  private isRestriction(grapholElement: GrapholElement) {
    if (!grapholElement) return false
    return grapholElement.is(GrapholTypesEnum.DOMAIN_RESTRICTION) ||
      grapholElement.is(GrapholTypesEnum.RANGE_RESTRICTION)
  }

  private getGrapholElement(id: string) {
    return this.result.grapholElements.get(id)
  }
}