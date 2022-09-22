import cytoscape, { Collection, CollectionReturnValue, EdgeSingular, NodeSingular, SingularElementReturnValue } from "cytoscape";
import { Diagram, GrapholEdge, GrapholElement, GrapholNode, GrapholTypesEnum, RendererStatesEnum } from "../../../model";
import DiagramRepresentation from "../../../model/diagrams/diagram-representation";
import { isGrapholEdge } from "../../../model/graphol-elems/edge";
import { isGrapholNode } from "../../../model/graphol-elems/node";
import { cytoscapeFilter } from "../filtering";
import Breakpoint from '../../../model/graphol-elems/breakpoint'
import { liteOptions } from "../../../config/cytoscape-default-config";
import BaseGrapholTransformer from "../base-transformer";

export default class LiteTransformer extends BaseGrapholTransformer {
  protected result: DiagramRepresentation

  transform(diagram: Diagram): DiagramRepresentation {
    this.result = new DiagramRepresentation(liteOptions)
    const grapholRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL)

    if (!grapholRepresentation) {
      return this.result
    }

    this.result.grapholElements = new Map(grapholRepresentation.grapholElements)

    this.newCy.add(grapholRepresentation.cy.elements().clone())
    this.newCy.elements().removeClass('filtered') // make all filtered elements not filtered anymore

    this.filterByCriterion((node) => {
      const grapholNode = this.getGrapholElement(node.id())
      if (!grapholNode) return false
      switch (grapholNode.type) {
        case GrapholTypesEnum.COMPLEMENT:
        case GrapholTypesEnum.VALUE_DOMAIN:
        case GrapholTypesEnum.ROLE_CHAIN:
        case GrapholTypesEnum.ENUMERATION:
        case GrapholTypesEnum.KEY:
          return true

        case GrapholTypesEnum.DOMAIN_RESTRICTION:
        case GrapholTypesEnum.RANGE_RESTRICTION:
          if (grapholNode.displayedName == 'forall')
            return true
          else
            return false

        default:
          return false
      }
    })

    this.filterByCriterion(this.isQualifiedRestriction)
    this.filterByCriterion(this.isCardinalityRestriction)
    this.filterByCriterion(this.inputEdgesBetweenRestrictions)
    this.deleteFilteredElements()
    this.simplifyDomainAndRange()
    this.simplifyComplexHierarchies()
    this.simplifyUnions()
    this.simplifyIntersections()
    this.simplifyRoleInverse()

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
      //let edgeResult: EdgeSingular
      // source is any obj/data property node connected to restriction by input edge
      const edgeResult = restriction.incomers('edge')
        .filter(edge => {
          const grapholEdge = this.getGrapholElement(edge.id())
          const grapholSource = this.getGrapholElement(edge.data().source)

          return grapholEdge.is(GrapholTypesEnum.INPUT) &&
            (grapholSource.is(GrapholTypesEnum.OBJECT_PROPERTY) || grapholSource.is(GrapholTypesEnum.DATA_PROPERTY))
        })

      if (!edgeResult.empty()) {
        return this.getGrapholElement(edgeResult.id()) as GrapholEdge
      }
    }

    /**
     * Given a domain/range restriction, we need each edge on the restriction of type != input
     * to be transformed into a ROLE EDGE going into the object/data property using the 
     * input edge from property -> restriction (here we assume it is already been reversed).
     * @param edgeOnRestriction an edge connected to the restriction node, will be transformed into a role edge
     * @param edgeFromProperty the edge from property to restriction (reversed, so it's going from restriction to property)
     * @param restrictionNode the restriction node, must become a breakpoint
     */
    const transformIntoRoleEdge = (edgeOnRestriction: GrapholEdge, edgeFromProperty: GrapholEdge, restrictionNode: GrapholNode) => {
      // let edges = []
      // let new_edge = null
      let edgeOnRestrictionSourceNode = this.getGrapholElement(edgeOnRestriction.sourceId) as GrapholNode
      let edgeOnRestrictionTargetNode = this.getGrapholElement(edgeOnRestriction.targetId) as GrapholNode
      const propertyNode = this.getGrapholElement(edgeFromProperty.targetId) as GrapholNode

      /**
       * if the edge to restriction is between two existential, remove it and filter the other existential
       */
      if (this.isRestriction(edgeOnRestrictionSourceNode) && this.isRestriction(edgeOnRestrictionTargetNode)) {
        this.newCy.remove(`#${edgeOnRestriction.id}`)
        this.result.grapholElements.delete(edgeOnRestriction.id)
        return
      }

      if (edgeOnRestriction.targetId !== restrictionNode.id) {
        this.reverseEdge(edgeOnRestriction)
        edgeOnRestrictionSourceNode = this.getGrapholElement(edgeOnRestriction.sourceId) as GrapholNode
      }

      edgeOnRestriction.targetId = propertyNode.id

      // move attribute on restriction node position
      if (propertyNode.is(GrapholTypesEnum.DATA_PROPERTY)) {
        edgeOnRestriction.type = 'attribute-edge' as GrapholTypesEnum
        propertyNode.x = restrictionNode.position.x
        propertyNode.y = restrictionNode.position.y
        this.result.updateElement(propertyNode)
        //new_edge = edges[0]
      }

      if (propertyNode.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
        edgeOnRestriction.type = restrictionNode.type
        // restriction node must become a new breakpoint
        edgeOnRestriction.addBreakPoint(new Breakpoint(restrictionNode.x, restrictionNode.y))

        // each breakpoint from restriction to property must become a breakpoint for the result edge
        edgeFromProperty.breakpoints.forEach(breakpoint => {
          edgeOnRestriction.addBreakPoint(breakpoint)
        })
      }

      edgeOnRestriction.computeBreakpointsDistancesWeights(edgeOnRestrictionSourceNode.position, propertyNode.position)
      this.result.updateElement(edgeOnRestriction)
    }


    //let eles = cy.$('*')
    let grapholRestrictionNode: GrapholElement
    // select domain and range restrictions
    this.result.cy.nodes().forEach(restriction => {
      grapholRestrictionNode = this.getGrapholElement(restriction.id())
      if (!this.isRestriction(grapholRestrictionNode)) return

      const inputGrapholEdge = getInputEdgeFromPropertyToRestriction(restriction)
      if (!inputGrapholEdge) return
      // Final role edge will be concatenated with this one, 
      // so we need to revert it to make it point to the obj/data property
      this.reverseEdge(inputGrapholEdge)
      // create a new role edge concatenating each edge different from inputs
      // to the input edge from object/data property to restriction node
      restriction.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
        .forEach((edgeToRestriction, i) => {
          const grapholEdgeToRestriction = this.getGrapholElement(edgeToRestriction.id())
          if (!isGrapholEdge(grapholEdgeToRestriction) || !isGrapholNode(grapholRestrictionNode))
            return

          transformIntoRoleEdge(grapholEdgeToRestriction, inputGrapholEdge, grapholRestrictionNode)
        })

      cytoscapeFilter(restriction.id(), '', this.newCy)
      this.deleteFilteredElements()
    })

    this.deleteFilteredElements()
  }

  private reverseEdge(edge: GrapholEdge) {
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

  private simplifyComplexHierarchies() {
    this.newCy.nodes().forEach(node => {
      if (this.isComplexHierarchy(node)) {
        this.replicateAttributes(node)
        cytoscapeFilter(node.id(), '', this.newCy)
      }
    })

    this.deleteFilteredElements()
  }

  private isComplexHierarchy(node: NodeSingular) {
    const grapholNode = this.getGrapholElement(node.id())
    if (!grapholNode || (!grapholNode.is(GrapholTypesEnum.UNION) &&
      !grapholNode.is(GrapholTypesEnum.DISJOINT_UNION) &&
      !grapholNode.is(GrapholTypesEnum.INTERSECTION))
    )
      return false

    // Complex hierarchy if it has something different from a class as input
    const inputNodesNotConcepts = node.incomers(`edge`)
      .filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
      .sources()
      .filter(node => !this.getGrapholElement(node.id()).is(GrapholTypesEnum.CLASS))

    return !inputNodesNotConcepts.empty()
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
      allInputClasses = allInputClasses.union(inputEdges.sources().filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.CLASS)))

      inputEdges.sources().difference(allInputClasses).forEach(constructor => {
        allInputClasses = allInputClasses.union(getAllInputClasses(constructor))
      })

      return allInputClasses
    }

    /**
     * 
     * @param concept 
     * @param attribute 
     * @param i 
     */
    const addAttribute = (concept: NodeSingular, attribute: NodeSingular, edgeType: GrapholTypesEnum | string, i: number) => {
      const newAttribute = new GrapholNode(`duplicate-${attribute.id()}-${i}`)
      const newAttributeEdge = new GrapholEdge(`e-${concept.id()}-${attribute.id()}`)

      newAttribute.originalId = attribute.id()
      newAttribute.x = concept.position().x
      newAttribute.y = concept.position().y
      Object.entries(attribute.data()).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'originalId')
          newAttribute[key] = value
      })

      newAttributeEdge.sourceId = concept.id()
      newAttributeEdge.targetId = newAttribute.id
      newAttributeEdge.type = edgeType as GrapholTypesEnum
      this.result.addElement(newAttribute)
      this.result.addElement(newAttributeEdge)
      this.newCy.$id(newAttribute.id).addClass('repositioned')

      // recursively add new attributes connected to replicated attributes by inclusions
      if (!attribute.hasClass('repositioned')) {
        attribute.neighborhood('node').filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.DATA_PROPERTY)).forEach((inclusion_attribute, j) => {
          if (allAttributes.contains(inclusion_attribute)) {
            return
          }

          const edgeBetweenAttributes = attribute.edgesTo(inclusion_attribute)[0]
          if (edgeBetweenAttributes) {
            addAttribute(this.newCy.$id(newAttribute.id), inclusion_attribute, edgeBetweenAttributes.data().type, i)
            inclusion_attribute.addClass('repositioned')
            allInclusionAttributes = allInclusionAttributes.union(inclusion_attribute)
          }
        })
      }
    }

    let allClasses = getAllInputClasses(node)
    let allAttributes = node.neighborhood(`node`).filter(node => this.getGrapholElement(node.id()).is(GrapholTypesEnum.DATA_PROPERTY))
    let allInclusionAttributes = this.newCy.collection()

    allAttributes.forEach((attribute) => {
      allClasses.forEach((concept, j) => {
        addAttribute(concept, attribute, 'attribute-edge', j)
      })
      attribute.addClass('repositioned')
      allInclusionAttributes.addClass('repositioned')
    })

    this.deleteElements(allAttributes)
    this.deleteElements(allInclusionAttributes)
  }

  private simplifyUnions() {
    this.newCy.nodes().forEach(union => {
      const grapholUnion = this.getGrapholElement(union.id())
      if (!grapholUnion || !isGrapholNode(grapholUnion) ||
        (!grapholUnion.is(GrapholTypesEnum.UNION) && !grapholUnion.is(GrapholTypesEnum.DISJOINT_UNION)))
        return

      //grapholUnion.height = grapholUnion.width = 0.1
      //makeDummyPoint(union)

      //union.incomers('edge[type = "input"]').data('type', 'easy_input')
      // delete incoming inclusions
      union.incomers('edge').forEach(edge => {
        const grapholEdge = this.getGrapholElement(edge.id())
        if (grapholEdge.is(GrapholTypesEnum.INCLUSION)) {
          this.deleteElement(edge)
        }
      })

      // process equivalence edges
      union.connectedEdges('edge').forEach(edge => {
        const grapholEdge = this.getGrapholElement(edge.id()) as GrapholEdge

        // if it's equivalence add 'C' and reverse if needed
        if (grapholEdge.is(GrapholTypesEnum.EQUIVALENCE)) {
          grapholEdge.type = grapholUnion.type
          grapholEdge.targetLabel = 'C'

          // the edge must have as source the union node
          if (grapholEdge.sourceId != grapholUnion.id) {
            this.reverseEdge(grapholEdge)
          }

          this.result.updateElement(grapholEdge)
          return
        }

        // if it's outgoing and of type inclusion
        if (grapholEdge.sourceId === grapholUnion.id && grapholEdge.is(GrapholTypesEnum.INCLUSION)) {
          grapholEdge.type = grapholUnion.type
          this.result.updateElement(grapholEdge)
        }
      })

      // process inclusion edges
      // union.outgoers('edge').forEach(inclusion => {
      //   inclusion.addClass('hierarchy')
      //   if (union.data('type') == GrapholTypesEnum.DISJOINT_UNION)
      //     inclusion.addClass('disjoint')
      // })

      // if (union.data('label'))
      //   union.data('label', '')
      //grapholUnion.displayedName = undefined

      this.replicateAttributes(union)

      // replicate role tipization on input classes
      this.replicateRoleTypizations(union)

      this.result.updateElement(grapholUnion)

      const numberEdgesNotInput = union.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT)).size()

      if (numberEdgesNotInput <= 0) {
        this.deleteElement(union)
      }
      // if the union has not any connected non-input edges, then remove it
      // if (union.connectedEdges('[type !*= "input"]').size() == 0)
      //   cy.remove(union)
    })
  }

  private simplifyIntersections() {
    this.newCy.nodes().forEach(and => {
      const grapholAndNode = this.getGrapholElement(and.id())
      if (!grapholAndNode || !grapholAndNode.is(GrapholTypesEnum.INTERSECTION))
        return

      this.replicateAttributes(and)
      this.replicateRoleTypizations(and)

      // if there are no incoming inclusions or equivalence and no equivalences connected,
      // remove the intersection
      const incomingInclusions = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INCLUSION))
      const connectedEquivalences = and.connectedEdges().filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.EQUIVALENCE))
      const incomingUnionEdges = and.incomers('edge').filter(edge => {
        const grapholEdge = this.getGrapholElement(edge.id())
        return grapholEdge.is(GrapholTypesEnum.UNION) || grapholEdge.is(GrapholTypesEnum.DISJOINT_UNION)
      })

      const edgesToBeReplicated = incomingInclusions.union(connectedEquivalences).union(incomingUnionEdges)

      if (edgesToBeReplicated.empty()) {
        cytoscapeFilter(grapholAndNode.id, '', this.newCy)
      } else {
        const incomingInputs = and.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
        // process incoming inclusion && connected equivalences
        edgesToBeReplicated.forEach(edge => {
          const edgeToBeReplicated = this.getGrapholElement(edge.id()) as GrapholEdge
          /**
           * create a new ISA edge for each input class
           * the new edge will be a concatenation:
           *  - ISA towards the 'and' node + input edge
           *
           * the input edge must be reversed
           * In case of equivalence edge, we only consider the
           * isa towards the 'and' node and discard the other direction
           */
          incomingInputs.forEach((input, i) => {
            /**
             * if the edge is an equivalence, we must consider it as an
             * incoming edge in any case and ignore the opposite direction.
             * so if the edge is outgoing from the intersection, we reverse it
             */
            if (edgeToBeReplicated.is(GrapholTypesEnum.EQUIVALENCE) &&
              edgeToBeReplicated.sourceId === grapholAndNode.id) {
              this.reverseEdge(edgeToBeReplicated)
            }

            // Edge concatenation: isa/equilvance + reversed input
            const grapholInputEdge = this.getGrapholElement(input.id()) as GrapholEdge
            this.reverseEdge(grapholInputEdge)

            grapholInputEdge.sourceId = edgeToBeReplicated.sourceId
            grapholInputEdge.controlpoints.unshift(...edgeToBeReplicated.controlpoints)

            const source = this.getGrapholElement(grapholInputEdge.sourceId) as GrapholNode
            const target = this.getGrapholElement(grapholInputEdge.targetId) as GrapholNode
            grapholInputEdge.computeBreakpointsDistancesWeights(source.position, target.position)
            grapholInputEdge.targetLabel = edgeToBeReplicated.targetLabel
            grapholInputEdge.type = edgeToBeReplicated.type
            this.result.updateElement(grapholInputEdge)
          })
        })

        cytoscapeFilter(grapholAndNode.id, '', this.newCy)
      }
      this.deleteFilteredElements()
      this.deleteElements(edgesToBeReplicated)
    })
  }

  private replicateRoleTypizations(constructorNode: NodeSingular) {
    // replicate role tipization on input classes
    const restrictionEdges = constructorNode.connectedEdges().filter(edge => this.isRestriction(this.getGrapholElement(edge.id())))
    const inputEdges = constructorNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))

    restrictionEdges.forEach((restrictionEdge, i) => {
      const grapholRestrictionEdge = this.getGrapholElement(restrictionEdge.id()) as GrapholEdge

      inputEdges.forEach((inputEdge) => {
        const grapholInputEdge = this.getGrapholElement(inputEdge.id()) as GrapholEdge
        if (!grapholInputEdge) return
        const newRestrictionEdge = new GrapholEdge(`${grapholRestrictionEdge.id}-${grapholInputEdge.id}`)
        /**
         * if the connected non input edge is only one (the one we are processing)
         * then the new edge will be the concatenation of the input edge + role edge
         */
        if (i === 0) {
          newRestrictionEdge.controlpoints = grapholInputEdge.controlpoints.concat(grapholRestrictionEdge.controlpoints)
        } else {
          newRestrictionEdge.controlpoints = [...grapholRestrictionEdge.controlpoints]
        }

        newRestrictionEdge.type = grapholRestrictionEdge.type
        newRestrictionEdge.sourceId = grapholInputEdge.sourceId

        newRestrictionEdge.sourceEndpoint = grapholInputEdge.sourceEndpoint
          ? { x: grapholInputEdge.sourceEndpoint.x, y: grapholInputEdge.sourceEndpoint.y }
          : undefined

        newRestrictionEdge.targetEndpoint = grapholRestrictionEdge.targetEndpoint
          ? { x: grapholRestrictionEdge.targetEndpoint.x, y: grapholRestrictionEdge.targetEndpoint.y }
          : undefined

        newRestrictionEdge.targetId = grapholRestrictionEdge.targetId
        const sourceNode = this.getGrapholElement(newRestrictionEdge.sourceId) as GrapholNode
        const targetNode = this.getGrapholElement(newRestrictionEdge.targetId) as GrapholNode
        newRestrictionEdge.computeBreakpointsDistancesWeights(sourceNode.position, targetNode.position)
        this.result.addElement(newRestrictionEdge)
      })

      this.deleteElement(restrictionEdge)
    })
  }

  private simplifyRoleInverse() {
    this.newCy.nodes().filter(node => this.getGrapholElement(node.id())?.is(GrapholTypesEnum.ROLE_INVERSE)).forEach(roleInverseNode => {
      let new_edges_count = 0
      // the input role is only one
      const inputEdge = roleInverseNode.incomers('edge').filter(edge => this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
      const grapholInputEdge = this.getGrapholElement(inputEdge.id()) as GrapholEdge
      // the input edge must always be reversed
      this.reverseEdge(grapholInputEdge)
      const grapholRoleInverseNode = this.getGrapholElement(roleInverseNode.id()) as GrapholNode

      // for each other edge connected, create a concatenated edge
      // the edge is directed towards the input_role
      roleInverseNode.connectedEdges().filter(edge => !this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INPUT))
        .forEach((edge) => {

          const roleInverseEdge = this.getGrapholElement(edge.id()) as GrapholEdge
          roleInverseEdge.type = GrapholTypesEnum.ROLE_INVERSE
          roleInverseEdge.controlpoints = roleInverseEdge.controlpoints.concat(grapholInputEdge.controlpoints)
          roleInverseEdge.targetId = grapholInputEdge.targetId

          const source = this.getGrapholElement(roleInverseEdge.sourceId) as GrapholNode
          const target = this.getGrapholElement(roleInverseEdge.targetId) as GrapholNode
          roleInverseEdge.computeBreakpointsDistancesWeights(source.position, target.position)
          roleInverseEdge.displayedName = 'inverse Of'
          this.result.updateElement(roleInverseEdge)
        })

      this.deleteElement(inputEdge)
      this.deleteElement(roleInverseNode)

      // if (new_edges_count > 1) {
      //   cy.remove(inputEdge)
      //   makeDummyPoint(roleInverseNode)
      //   roleInverseNode.data('label', 'inverse Of')
      //   roleInverseNode.data('labelXpos', 0)
      //   roleInverseNode.data('labelYpos', 0)
      //   roleInverseNode.data('text_background', true)
      // } else {
      //   if (inputEdge.source())
      //     inputEdge.source().connectedEdges('edge.inverse-of').data('displayed_name','inverse Of')
      //   cy.remove(roleInverseNode)
      // }
    })
  }

}