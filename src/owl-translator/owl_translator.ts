import { CollectionReturnValue, NodeCollection, NodeSingular } from 'cytoscape'
import Grapholscape from '../core/grapholscape'
import { GrapholEdge, GrapholNode, GrapholTypesEnum, GrapholTypesEnum as Types, Iri } from '../model'
import { isGrapholNode } from '../model/graphol-elems/node'
import capitalizeFirstChar from '../util/capitalize-first-char'
import { entityIriTemplate } from './iri-template'


export default class GrapholToOwlTranslator {
  private _grapholscape: Grapholscape
  private readonly malformed = '<span class="owl_error">Malformed Axiom</span>'
  private readonly missingOperand = '<span class="owl_error">Missing Operand</span>'
  private readonly owlThing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>'
  private readonly rdfsLiteral = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>'

  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }

  edgeToOwlString(edge: CollectionReturnValue): string | undefined {
    const grapholEdge = this._grapholscape.ontology.getGrapholEdge(edge.id(), this._grapholscape.diagramId)
    if (!grapholEdge) return

    const source = edge.source()
    const grapholSource = this._grapholscape.ontology.getGrapholNode(source.id(), this._grapholscape.diagramId)
    const target = edge.target()
    const grapholTarget = this._grapholscape.ontology.getGrapholNode(target.id(), this._grapholscape.diagramId)

    if (!grapholSource || !grapholTarget) return

    switch (grapholEdge.type) {
      case Types.INCLUSION:
        if (grapholSource.identity !== grapholTarget.identity) return

        switch (grapholSource.identity) {
          case Types.CLASS:
            if (grapholSource.is(Types.DOMAIN_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
              return this.propertyDomain(edge)
            }
            else if (grapholSource.is(Types.RANGE_RESTRICTION) && grapholSource.displayedName != 'self' && grapholTarget.displayedName != 'self') {
              return this.propertyRange(edge)
            }
            else if (grapholTarget.is(Types.COMPLEMENT) || grapholSource.is(Types.COMPLEMENT)) {
              return this.disjointClassesFromEdge(edge.connectedNodes())
            }

            return this.subClassOf(edge)

          case Types.OBJECT_PROPERTY:
            if (grapholTarget.is(Types.COMPLEMENT))
              return this.disjointTypeProperties(edge)
            else
              return this.subTypePropertyOf(edge)

          case Types.VALUE_DOMAIN:
            return this.propertyRange(edge)

          case Types.DATATYPE_RESTRICTION:
            if (grapholTarget.is(Types.COMPLEMENT))
              return this.disjointTypeProperties(edge)
            else
              return this.subTypePropertyOf(edge)

          default: return this.malformed
        }

      case Types.EQUIVALENCE:
        if (grapholSource.identity !== grapholTarget.identity) return

        switch (grapholSource.identity) {
          case Types.CLASS:
            return this.equivalentClasses(edge)

          case Types.OBJECT_PROPERTY:
            if (grapholSource.is(Types.ROLE_INVERSE) || grapholTarget.is(Types.ROLE_INVERSE)) {
              return this.inverseObjectProperties(edge)
            }
            else {
              return this.equivalentTypeProperties(edge)
            }

          case Types.DATA_PROPERTY:
            return this.equivalentTypeProperties(edge)

          default:
            return this.malformed
        }

      case Types.MEMBERSHIP:
        if (grapholTarget.identity == Types.CLASS)
          return this.classAssertion(edge)
        else
          return this.propertyAssertion(edge)
    }
  }

  private subClassOf(inclusionEdge: CollectionReturnValue) {
    return `SubClassOf(${this.nodeToOwlString(inclusionEdge.source())} ${this.nodeToOwlString(inclusionEdge.target())})`
  }

  private propertyDomain(edgeOutFromDomain: CollectionReturnValue): string | undefined {
    const nodes = edgeOutFromDomain.source().incomers(`[type = "${Types.INPUT}"]`).sources()

    if (nodes.size() > 1)
      return this.subClassOf(edgeOutFromDomain)

    const sourceNode = nodes[0]
    const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(sourceNode.id(), this._grapholscape.diagramId)
    if (!sourceGrapholNode) return

    let axiomType = this.getAxiomPropertyType(sourceGrapholNode)

    return `${axiomType}PropertyDomain(${this.nodeToOwlString(sourceNode)} ${this.nodeToOwlString(edgeOutFromDomain.target())})`
  }

  private propertyRange(edge: CollectionReturnValue) {
    var nodeSources = edge.source().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources()

    if (nodeSources.size() > 1) { return this.subClassOf(edge) }

    const sourceNode = nodeSources[0]
    const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(sourceNode.id(), this._grapholscape.diagramId)
    if (!sourceGrapholNode) return
    const axiomType = this.getAxiomPropertyType(sourceGrapholNode)

    return `${axiomType}PropertyRange(${this.nodeToOwlString(sourceNode)} ${this.nodeToOwlString(edge.target())})`
  }

  private propertyAssertion(edge: CollectionReturnValue) {

    const targetGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId)
    const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.source().id(), this._grapholscape.diagramId)

    if (!targetGrapholNode || !sourceGrapholNode) return

    const axiomType = this.getAxiomPropertyType(targetGrapholNode)

    let owlString = axiomType + 'PropertyAssertion(' + this.nodeToOwlString(edge.target()) + ' '

    if (sourceGrapholNode.type == GrapholTypesEnum.PROPERTY_ASSERTION) {
      var property_node = edge.source()

      property_node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(input => {
        owlString += this.nodeToOwlString(input) + ' '
      })

      owlString = owlString.slice(0, owlString.length - 1)
    } else {
      owlString += this.nodeToOwlString(edge.source())
    }

    return owlString + ')'
  }

  private classAssertion(edge: CollectionReturnValue) {
    return `ClassAssertion(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`
  }

  private inverseObjectProperties(edge: CollectionReturnValue) {
    let complementInput: NodeSingular, input: NodeSingular

    if (edge.source().data('type') == GrapholTypesEnum.ROLE_INVERSE) {
      input = edge.target()
      complementInput = edge.source().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources()[0]
    } else {
      input = edge.source()
      complementInput = edge.target().incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).sources()[0]
    }

    if (complementInput.empty()) { return this.missingOperand }

    return `InverseObjectProperties(${this.nodeToOwlString(input)} ${this.nodeToOwlString(complementInput)})`
  }

  private equivalentClasses(edge: CollectionReturnValue) {
    return `EquivalentClasses(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`
  }

  private equivalentTypeProperties(edge: CollectionReturnValue) {
    const sourceGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.source().id(), this._grapholscape.diagramId)
    if (!sourceGrapholNode) return
    const axiomType = this.getAxiomPropertyType(sourceGrapholNode)

    return `Equivalent${axiomType}Properties(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`
  }

  private subTypePropertyOf(edge: CollectionReturnValue) {
    const targetGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId)
    if (!targetGrapholNode) return
    const axiomType = this.getAxiomPropertyType(targetGrapholNode)

    return `Sub${axiomType}PropertyOf(${this.nodeToOwlString(edge.source())} ${this.nodeToOwlString(edge.target())})`
  }

  private disjointClassesFromEdge(inputs: NodeCollection) {
    var owlString = 'DisjointClasses('

    inputs.forEach((input) => {
      if (input.data('type') == GrapholTypesEnum.COMPLEMENT) {
        input = input.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).source()
      }
      owlString += this.nodeToOwlString(input) + ' '
    })

    owlString = owlString.slice(0, owlString.length - 1)
    owlString += ')'
    return owlString
  }

  private disjointTypeProperties(edge: CollectionReturnValue) {
    const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(edge.target().id(), this._grapholscape.diagramId)
    if (!firstInputGrapholNode) return
    const axiomType = this.getAxiomPropertyType(firstInputGrapholNode)

    let owlString = `Disjoint${axiomType}Properties(`

    edge.connectedNodes().forEach((node) => {
      if (node.data('type') == GrapholTypesEnum.COMPLEMENT) {
        node = node.incomers(`[type = "${GrapholTypesEnum.INPUT}"]`).source()
      }
      owlString += this.nodeToOwlString(node) + ' '
    })

    owlString = owlString.slice(0, owlString.length - 1)
    return owlString + ')'
  }

  // ============================== NODE ==============================
  nodeToOwlString(node: NodeSingular, startingFromNode = false) {

    const grapholNode = this._grapholscape.ontology.getGrapholNode(node.id(), this._grapholscape.diagramId)
    if (!grapholNode) return

    let owl_string: string | undefined

    if (grapholNode.isEntity() || grapholNode.is(Types.VALUE_DOMAIN)) {
      let nodeIri: Iri | { remainder: string; prefix: string }

      const grapholNodeEntity = this._grapholscape.ontology.getEntity(node.data().iri)

      if (grapholNodeEntity?.iri) {
        nodeIri = grapholNodeEntity.iri
      } else if (grapholNode.is(Types.VALUE_DOMAIN)) {
        nodeIri = { 
          prefix: grapholNode.displayedName.split(':')[0], 
          remainder: grapholNode.displayedName.split(':')[1]
        }
      } else
        return

      const iriSpan = entityIriTemplate(nodeIri, grapholNode.type)

      // if startingFromNode, return iri declaration
      if (startingFromNode) {
        owl_string = ''
        const entitiesOwlNames = {}
        entitiesOwlNames[Types.CLASS] = 'Class'
        entitiesOwlNames[Types.OBJECT_PROPERTY] = 'ObjectProperty'
        entitiesOwlNames[Types.DATA_PROPERTY] = 'DataProperty'
        entitiesOwlNames[Types.INDIVIDUAL] = 'NamedIndividual'
        entitiesOwlNames[Types.VALUE_DOMAIN] = 'Datatype'

        if (grapholNode.is(Types.OBJECT_PROPERTY) || grapholNode.is(Types.DATA_PROPERTY)) {
          grapholNodeEntity?.functionalities.forEach(functionality => {
            owl_string += `<br/>${capitalizeFirstChar(functionality)}${entitiesOwlNames[grapholNode.type]}(${iriSpan})`
          })
        }

        return `Declaration(${entitiesOwlNames[grapholNode.type]}(${iriSpan}))` + owl_string
      }
      else {
        return iriSpan
      }
    }

    // node is a constructor
    else {
      let inputs: NodeCollection
      switch (grapholNode.type) {
        case Types.FACET:
          var remainder = grapholNode.displayedName.replace(/\n/g, '^').split('^^')
          remainder[0] = remainder[0].slice(4)
          return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + remainder[0] + '</span><span class="owl_value">' + remainder[1] + '</span>'

        case Types.DOMAIN_RESTRICTION:
        case Types.RANGE_RESTRICTION:
          var input_edges = node.connectedEdges(`edge[target = "${node.id()}"][type = "${Types.INPUT}"]`)
          var input_first; var input_other; var input_attribute = null

          if (!input_edges.length) { return this.missingOperand }

          input_edges.forEach((e) => {
            if (e.source().data('type') == Types.OBJECT_PROPERTY || e.source().data('type') == Types.DATA_PROPERTY) {
              input_first = e.source()
            }

            if (e.source().data('type') != Types.OBJECT_PROPERTY && e.source().data('type') != Types.DATA_PROPERTY) {
              input_other = e.source()
            }
          })

          if (input_first) {
            if (input_first.data('type') == Types.DATA_PROPERTY && grapholNode.type == Types.RANGE_RESTRICTION)
              return

            switch (grapholNode.displayedName) {
              case 'exists':
                return this.valuesFrom(input_first, input_other, grapholNode.type, 'Some')

              case 'forall':
                return this.valuesFrom(input_first, input_other, grapholNode.type, 'All')

              case 'self':
                return this.hasSelf(input_first, grapholNode.type)

              default:
                if (node.data('displayedName').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
                  var cardinality = grapholNode.displayedName.replace(/\(|\)/g, '').split(/,/)
                  return this.minMaxExactCardinality(input_first, input_other, cardinality, grapholNode.type)
                }

                return this.missingOperand
            }
          }
          return

        case Types.ROLE_INVERSE:
          inputs = node.incomers(`[type = "${Types.INPUT}"]`).sources()
          if (inputs.length <= 0)
            return this.missingOperand

          return this.objectInverseOf(inputs[0])

        case Types.ROLE_CHAIN:
          if (!node.data('inputs'))
            return this.missingOperand

          return this.objectPropertyChain(node.incomers(`[type = "${Types.INPUT}"]`).sources())

        case Types.UNION:
        case Types.INTERSECTION:
        case Types.COMPLEMENT:
        case Types.ENUMERATION:
        case Types.DISJOINT_UNION:
          inputs = node.incomers(`[type = "${Types.INPUT}"]`).sources()
          if (inputs.length <= 0)
            return this.missingOperand

          const axiomType = this.getAxiomPropertyType(grapholNode)

          if (node.data('type') == Types.DISJOINT_UNION) {
            if (!startingFromNode) {
              return this.logicalConstructors(inputs, Types.UNION, axiomType)
            } else {
              return this.logicalConstructors(inputs, Types.UNION, axiomType) + '<br />' + this.disjointClassesFromNode(inputs)
            }
          }

          return this.logicalConstructors(inputs, node.data('type'), axiomType)

        case Types.DATATYPE_RESTRICTION:
          inputs = node.incomers(`[type = "${Types.INPUT}"]`).sources()
          if (inputs.length <= 0) { return this.missingOperand }

          return this.datatypeRestriction(inputs)

        case Types.PROPERTY_ASSERTION:
          return

        case Types.KEY:
          inputs = node.incomers(`[type = "${Types.INPUT}"]`).sources()
          if (inputs.length <= 0)
            return this.missingOperand

          return this.hasKey(inputs)
      }
    }
  }

  private valuesFrom(first: NodeSingular, other: NodeSingular, restrictionType: GrapholTypesEnum, cardinality: 'Some' | 'All') {
    let owlString: string | undefined

    const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(first.id(), this._grapholscape.diagramId)
    if (!firstInputGrapholNode) return

    const axiomType = this.getAxiomPropertyType(firstInputGrapholNode)

    owlString = `${axiomType}${cardinality}ValuesFrom(`

    // if the node is a range-restriction, put the inverse of the role
    if (restrictionType == Types.RANGE_RESTRICTION) {
      owlString += this.objectInverseOf(first)
    }
    else {
      owlString += this.nodeToOwlString(first)
    }

    if (!other && axiomType == 'Object') {
      return owlString += ` ${this.owlThing})`
    }

    if (!other && axiomType == 'Data') {
      return owlString += ` ${this.rdfsLiteral})`
    }

    return owlString += ` ${this.nodeToOwlString(other)})`
  }

  private minMaxExactCardinality(first: NodeSingular, other: NodeSingular, cardinality: string[], restrictionType: GrapholTypesEnum) {

    const getCardinalityString = (cardinality: string, cardinalityType: 'Min' | 'Max') => {
      if (restrictionType == GrapholTypesEnum.RANGE_RESTRICTION) {
        if (!other)
          return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.objectInverseOf(first)})`
        else
          return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.objectInverseOf(first)} ${this.nodeToOwlString(other)})`
      } else {
        if (!other)
          return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.nodeToOwlString(first)})`
        else
          return `${axiomType}${cardinalityType}Cardinality(${cardinality} ${this.nodeToOwlString(first)} ${this.nodeToOwlString(other)})`
      }
    }

    const firstInputGrapholNode = this._grapholscape.ontology.getGrapholNode(first.id(), this._grapholscape.diagramId)

    if (!firstInputGrapholNode) return

    const axiomType = this.getAxiomPropertyType(firstInputGrapholNode)

    if (cardinality[0] == '-') {
      return getCardinalityString(cardinality[1], 'Max')
    }

    if (cardinality[1] == '-') {
      return getCardinalityString(cardinality[0], 'Min')
    }

    if (cardinality[0] != '-' && cardinality[1] != '-') {
      var min: string[] = []; var max: string[] = []

      min.push(cardinality[0])
      min.push('-')

      max.push('-')
      max.push(cardinality[1])

      return `${axiomType} IntersectionOf(${this.minMaxExactCardinality(first, other, min, restrictionType)} ${this.minMaxExactCardinality(first, other, max, restrictionType)})`
    }
  }

  private objectInverseOf(node: NodeSingular) {
    return `ObjectInverseOf(${this.nodeToOwlString(node)})`
  }

  private objectPropertyChain(inputs: NodeCollection) {
    let owlString = 'ObjectPropertyChain('
    inputs.forEach(input => {
      owlString += this.nodeToOwlString(input) + ' '
    })

    owlString = owlString.slice(0, owlString.length - 1)
    owlString += ')'
    return owlString
  }

  private hasKey(inputs: NodeCollection) {
    let classNode = inputs.filter(`[identity = "${Types.CLASS}}"]`)
    let owlString = `HasKey(${this.nodeToOwlString(classNode)} `

    inputs.forEach(input => {
      if (input.id() != classNode.id()) {
        owlString += this.nodeToOwlString(input) + ' '
      }
    })

    owlString = owlString.slice(0, owlString.length - 1) + ')'
    return owlString
  }

  private logicalConstructors(inputs: NodeCollection, constructorName: string, axiomType: string) {
    let owlString: string

    if (constructorName == Types.ENUMERATION) { constructorName = 'One' } else // Capitalize first char
    { constructorName = constructorName.charAt(0).toUpperCase() + constructorName.slice(1) }

    owlString = axiomType + constructorName + 'Of('

    inputs.forEach((input) => {
      owlString += this.nodeToOwlString(input) + ' '
    })

    owlString = owlString.slice(0, owlString.length - 1)
    owlString += ')'

    return owlString
  }

  private disjointClassesFromNode(inputs: NodeCollection) {
    let owlString = 'DisjointClasses('

    inputs.forEach((input) => {
      owlString += this.nodeToOwlString(input) + ' '
    })

    owlString = owlString.slice(0, owlString.length - 1)
    owlString += ')'
    return owlString
  }

  private datatypeRestriction(inputs: NodeCollection) {
    let owlString = 'DatatypeRestriction('

    let valueDomain = inputs.filter(`[type = "${Types.VALUE_DOMAIN}"]`)[0]

    owlString += this.nodeToOwlString(valueDomain) + ' '

    inputs.forEach((input) => {
      if (input.data('type') == Types.FACET) {
        owlString += this.nodeToOwlString(input) + '^^'
        owlString += this.nodeToOwlString(valueDomain) + ' '
      }
    })
    owlString = owlString.slice(0, owlString.length - 1)
    owlString += ')'
    return owlString
  }

  private hasSelf(input: NodeSingular, restrictionType: GrapholTypesEnum) {
    // if the restriction is on the range, put the inverse of node
    if (restrictionType == Types.RANGE_RESTRICTION)
      return `ObjectHasSelf(${this.objectInverseOf(input)})`


    return `ObjectHasSelf(${this.nodeToOwlString(input)})`
  }

  private getAxiomPropertyType(node: GrapholNode | GrapholEdge) {
    if (node.is(Types.DATA_PROPERTY))
      return 'Data'
    else if (node.is(Types.OBJECT_PROPERTY))
      return 'Object'


    if (isGrapholNode(node)) {
      if (node.identity === Types.DATA_PROPERTY)
        return 'Data'
      else if (node.identity === Types.OBJECT_PROPERTY)
        return 'Object'
    }

    return ''
  }
}