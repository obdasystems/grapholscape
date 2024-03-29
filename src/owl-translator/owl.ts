import { CollectionReturnValue, NodeCollection } from "cytoscape"
import { TypesEnum, FunctionalityEnum } from "../model"
import { entityIriTemplate } from "./iri-template"

const malformed = '<span class="owl_error">Malformed Axiom</span>'
const missing_operand = '<span class="owl_error">Missing Operand</span>'

export function edgeToOwlString (edge) {
  var source = edge.source()
  var target = edge.target()

  switch (edge.data('type')) {
    case TypesEnum.INCLUSION:
      if (source.data('identity') == TypesEnum.CLASS && target.data('identity') == TypesEnum.CLASS) {
        if (source.data('type') == TypesEnum.DOMAIN_RESTRICTION && source.data('displayedName') != 'self' && target.data('displayedName') != 'self') {
          return propertyDomain(edge)
        } else if (source.data('type') == TypesEnum.RANGE_RESTRICTION && source.data('displayedName') != 'self' && target.data('displayedName') != 'self') {
          return propertyRange(edge)
        } else if (target.data('type') == TypesEnum.COMPLEMENT || source.data('type') == TypesEnum.COMPLEMENT) {
          return disjointClassesFromEdge(edge.connectedNodes())
        }

        return subClassOf(edge)
      } else if (source.data('identity') == TypesEnum.OBJECT_PROPERTY && target.data('identity') == TypesEnum.OBJECT_PROPERTY) {
        if (target.data('type') == TypesEnum.COMPLEMENT) {
          return disjointTypeProperties(edge)
        }
        return subTypePropertyOf(edge)
      } else if (source.data('identity') == TypesEnum.VALUE_DOMAIN && target.data('identity') == TypesEnum.VALUE_DOMAIN) {
        return propertyRange(edge)
      } else if (source.data('identity') == TypesEnum.DATA_PROPERTY && target.data('identity') == TypesEnum.DATA_PROPERTY) {
        if (target.data('type') == TypesEnum.COMPLEMENT) {
          return disjointTypeProperties(edge)
        } else { return subTypePropertyOf(edge) }
      } else { return malformed }

      break

    case TypesEnum.EQUIVALENCE:
      if (source.data('identity') == TypesEnum.CLASS && target.data('identity') == TypesEnum.CLASS) {
        return equivalentClasses(edge)
      } else if (source.data('identity') == TypesEnum.OBJECT_PROPERTY && target.data('identity') == TypesEnum.OBJECT_PROPERTY) {
        if (source.data('type') == TypesEnum.ROLE_INVERSE || target.data('type') == TypesEnum.ROLE_INVERSE) { return inverseObjectProperties(edge) } else { return equivalentTypeProperties(edge) }
      } else if (source.data('identity') == TypesEnum.DATA_PROPERTY && target.data('identity') == TypesEnum.DATA_PROPERTY) {
        return equivalentTypeProperties(edge)
      } else { return malformed }

      break

    case TypesEnum.MEMBERSHIP:
      if (target.data('identity') == TypesEnum.CLASS) { return classAssertion(edge) } else { return propertyAssertion(edge) }
      break
  }
}

function propertyAssertion (edge) {
  var axiom_type = 'Object'
  var owl_string

  if (edge.target().data('identity') == TypesEnum.DATA_PROPERTY) {
    axiom_type = 'Data'
  }

  owl_string = axiom_type + 'PropertyAssertion(' + nodeToOwlString(edge.target()) + ' '

  if (edge.source().data('type') == TypesEnum.PROPERTY_ASSERTION) {
    var property_node = edge.source()

    property_node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources().forEach( input => {
      owl_string += nodeToOwlString(input) + ' '
    })

    owl_string = owl_string.slice(0, owl_string.length - 1)
  } else {
    owl_string += nodeToOwlString(edge.source())
  }

  return owl_string + ')'
}

function classAssertion (edge) {
  return 'ClassAssertion(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function inverseObjectProperties (edge) {
  var complement_input
  var input
  if (edge.source().data('type') == TypesEnum.ROLE_INVERSE) {
    input = edge.target()
    complement_input = edge.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources().first()
  } else {
    input = edge.source()
    complement_input = edge.target().incomers(`[type = "${TypesEnum.INPUT}"]`).sources().first()
  }

  if (!complement_input.length) { return missing_operand }

  return 'InverseObjectProperties(' + nodeToOwlString(input) + ' ' + nodeToOwlString(complement_input) + ')'
}

function equivalentClasses (edge) {
  return 'EquivalentClasses(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function equivalentTypeProperties (edge) {
  var axiom_type
  if (edge.source().data('idenity') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' } else { axiom_type = 'Data' }

  return 'Equivalent' + axiom_type + 'Properties(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subClassOf (edge) {
  return 'SubClassOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subTypePropertyOf (edge) {
  var axiom_type

  if (edge.target().data('identity') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' } else if (edge.target().data('type') == TypesEnum.DATA_PROPERTY) { axiom_type = 'Data' } else { return null }

  return 'Sub' + axiom_type + 'PropertyOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function propertyDomain (edge) {
  var node = edge.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources()

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == TypesEnum.OBJECT_PROPERTY) { return 'ObjectPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == TypesEnum.DATA_PROPERTY) { return 'DataPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function propertyRange (edge) {
  var node = edge.source().incomers(`[type = "${TypesEnum.INPUT}"]`).sources()

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == TypesEnum.OBJECT_PROPERTY) { return 'ObjectPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == TypesEnum.DATA_PROPERTY) { return 'DataPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function disjointClassesFromEdge (inputs) {
  var owl_string = 'DisjointClasses('

  inputs.forEach(function (input) {
    if (input.data('type') == TypesEnum.COMPLEMENT) {
      input = input.incomers(`[type = "${TypesEnum.INPUT}"]`).source()
    }
    owl_string += nodeToOwlString(input) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'
  return owl_string
}

function disjointTypeProperties (edge) {
  var axiom_type, owl_string

  if (edge.target().data('identity') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' } else if (edge.target().data('identity') == TypesEnum.DATA_PROPERTY) { axiom_type = 'Data' } else { return null }

  owl_string = 'Disjoint' + axiom_type + 'Properties('

  edge.connectedNodes().forEach(function (node) {
    if (node.data('type') == TypesEnum.COMPLEMENT) {
      node = node.incomers(`[type = "${TypesEnum.INPUT}"]`).source()
    }
    owl_string += nodeToOwlString(node) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  return owl_string + ')'
}

const owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>'
const rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>'
const not_defined = 'Undefined'

export function nodeToOwlString (node: CollectionReturnValue, from_node = false) {
  
  var from_node_flag = from_node || null

  if (from_node_flag && (node.hasClass('predicate') || node.data('type') == TypesEnum.VALUE_DOMAIN)) {
    var owl_predicate = entityIriTemplate(node.data('iri'), node.data('type'))
    var owl_type

    switch (node.data('type')) {
      case TypesEnum.CLASS:
        owl_type = 'Class'
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
        break

      case TypesEnum.OBJECT_PROPERTY:
        owl_type = 'ObjectProperty'
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))'

        Object.values(FunctionalityEnum).forEach(functionality => {
          if (node.data(functionality)) { 
            owl_string += `<br/>${functionality} ${owl_type} ( ${owl_predicate} )` 
          }
        })

        return owl_string
        break

      case TypesEnum.DATA_PROPERTY:
        owl_type = 'DataProperty'
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))'

        if (node.data(FunctionalityEnum.FUNCTIONAL)) { owl_string += `<br/>${FunctionalityEnum.FUNCTIONAL} ${owl_type} ( ${owl_predicate} ))` }

        return owl_string
        break

      case TypesEnum.INDIVIDUAL:
        if (node.data('iri').remainingChars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
          var value = node.data('iri').remainingChars.split('^^')[0]
          var datatype = node.data('iri').remainingChars.split(':')[1]

          owl_predicate = '<span class="owl_value">' + value + '</span>^^' +
          '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' +
          '<span class="owl_value-domain">' + datatype + '</span>'
        }
        owl_type = 'NamedIndividual'
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
        break

      case TypesEnum.VALUE_DOMAIN:
        owl_type = 'Datatype'
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
        break
    }
  }

  let inputs: NodeCollection

  switch (node.data('type')) {
    case TypesEnum.INDIVIDUAL:
      if (node.data('iri').remainingChars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
        var value = node.data('iri').remainingChars.split('^^')[0]
        var datatype = node.data('iri').remainingChars.split(':')[1]

        return '<span class="owl_value">' + value + '</span>^^' +
        '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' +
        '<span class="owl_value-domain">' + datatype + '</span>'
      }

    case TypesEnum.CLASS:
    case TypesEnum.OBJECT_PROPERTY:
    case TypesEnum.VALUE_DOMAIN:
    case TypesEnum.DATA_PROPERTY:
    case TypesEnum.INDIVIDUAL:
      return entityIriTemplate(node.data('iri'), node.data('type'))
      break

    case TypesEnum.FACET:
      var rem_chars = node.data('displayedName').replace(/\n/g, '^').split('^^')
      rem_chars[0] = rem_chars[0].slice(4)
      return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + rem_chars[0] + '</span><span class="owl_value">' + rem_chars[1] + '</span>'
      break

    case TypesEnum.DOMAIN_RESTRICTION:
    case TypesEnum.RANGE_RESTRICTION:
      var input_edges = node.connectedEdges(`edge[target = "' + node.id() + '"][type = "${TypesEnum.INPUT}"]`)
      var input_first; var input_other; var input_attribute = null

      if (!input_edges.length) { return missing_operand }

      input_edges.forEach(function (e) {
        if (e.source().data('type') == TypesEnum.OBJECT_PROPERTY || e.source().data('type') == TypesEnum.DATA_PROPERTY) {
          input_first = e.source()
        }

        if (e.source().data('type') != TypesEnum.OBJECT_PROPERTY && e.source().data('type') != TypesEnum.DATA_PROPERTY) {
          input_other = e.source()
        }
      })

      if (input_first) {
        if (input_first.data('type') == TypesEnum.DATA_PROPERTY && node.data('type') == TypesEnum.RANGE_RESTRICTION) { return not_defined }

        if (node.data('displayedName') == 'exists') { return someValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayedName') == 'forall') { return allValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayedName').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('displayedName').replace(/\(|\)/g, '').split(/,/)
          return minMaxExactCardinality(input_first, input_other, cardinality, node.data('type'))
        } else if (node.data('displayedName') == 'self') {
          return hasSelf(input_first, node.data('type'))
        }
      } else return missing_operand

    case TypesEnum.ROLE_INVERSE:
      inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources()

      if (inputs.length <= 0) { return missing_operand }

      return objectInverseOf(inputs)
      break

    case TypesEnum.ROLE_CHAIN:
      if (!node.data('inputs')) { return missing_operand }

      return objectPropertyChain(node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources())
      break

    case TypesEnum.UNION:
    case TypesEnum.INTERSECTION:
    case TypesEnum.COMPLEMENT:
    case TypesEnum.ENUMERATION:
    case TypesEnum.DISJOINT_UNION:
      inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources()
      if (inputs.length <= 0) { return missing_operand }

      var axiom_type = 'Object'

      if (node.data('identity') != TypesEnum.CLASS && node.data('identity') != TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Data' }

      if (node.data('type') == TypesEnum.DISJOINT_UNION) {
        if (!from_node_flag) {
          return logicalConstructors(inputs, TypesEnum.UNION, axiom_type)
        } else {
          return logicalConstructors(inputs, TypesEnum.UNION, axiom_type) + '<br />' + disjointClassesFromNode(inputs)
        }
      }

      return logicalConstructors(inputs, node.data('type'), axiom_type)
      break

    case TypesEnum.DATATYPE_RESTRICTION:
      inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources()
      if (inputs.length <= 0) { return missing_operand }

      return datatypeRestriction(inputs)
      break

    case TypesEnum.PROPERTY_ASSERTION:
      return not_defined

    case TypesEnum.HAS_KEY:
      inputs = node.incomers(`[type = "${TypesEnum.INPUT}"]`).sources()
      if (inputs.length <= 0)
        return missing_operand

      return hasKey(inputs)
      break
  }
}


function someValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == TypesEnum.DATA_PROPERTY) { axiom_type = 'Data' }

  owl_string = axiom_type + 'SomeValuesFrom('

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == TypesEnum.RANGE_RESTRICTION) { owl_string += objectInverseOf(first) } else { owl_string += nodeToOwlString(first) }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function allValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == TypesEnum.DATA_PROPERTY) { axiom_type = 'Data' }

  owl_string = axiom_type + 'AllValuesFrom('

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == TypesEnum.RANGE_RESTRICTION) { owl_string += objectInverseOf(first) } else { owl_string += nodeToOwlString(first) }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function minMaxExactCardinality (first, other, cardinality, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == TypesEnum.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == TypesEnum.DATA_PROPERTY) { axiom_type = 'Data' }

  if (cardinality[0] == '-') {
    if (restr_type == TypesEnum.RANGE_RESTRICTION) {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[1] == '-') {
    if (restr_type == TypesEnum.RANGE_RESTRICTION) {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[0] != '-' && cardinality[1] != '-') {
    var min: string[] = []; var max: string[] = []

    min.push(cardinality[0])
    min.push('-')

    max.push('-')
    max.push(cardinality[1])

    return axiom_type + 'IntersectionOf(' + minMaxExactCardinality(first, other, min, restr_type) + ' ' + minMaxExactCardinality(first, other, max, restr_type) + ')'
  }
}

function objectInverseOf (node) {
  return 'ObjectInverseOf(' + nodeToOwlString(node) + ')'
}

function objectPropertyChain (inputs) {
  var owl_string = 'ObjectPropertyChain('
  inputs.forEach( input => {
    owl_string += nodeToOwlString(input) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'
  return owl_string
}

function hasKey(inputs) {
  
  let class_node = inputs.filter('[identity = "CLASS"]')
  let owl_string = 'HasKey(' + nodeToOwlString(class_node) + ' '
  
  inputs.forEach(input => {
    if (input.id() != class_node.id()) {
      owl_string += nodeToOwlString(input) + ' '
    }
  })
  
  owl_string = owl_string.slice(0, owl_string.length - 1) + ')'
  return owl_string
}

function logicalConstructors (inputs, constructor_name, axiom_type) {
  var owl_string

  if (constructor_name == TypesEnum.ENUMERATION) { constructor_name = 'One' } else // Capitalize first char
  { constructor_name = constructor_name.charAt(0).toUpperCase() + constructor_name.slice(1) }

  owl_string = axiom_type + constructor_name + 'Of('

  inputs.forEach(function (input) {
    owl_string += nodeToOwlString(input) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'

  return owl_string
}

function disjointClassesFromNode (inputs) {
  var owl_string = 'DisjointClasses('

  inputs.forEach(function (input) {
    owl_string += nodeToOwlString(input) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'
  return owl_string
}

function datatypeRestriction (inputs) {
  var owl_string = 'DatatypeRestriction('

  var value_domain = inputs.filter('[type = "value-domain"]').first()

  owl_string += nodeToOwlString(value_domain) + ' '

  inputs.forEach(function (input) {
    if (input.data('type') == TypesEnum.FACET) {
      owl_string += nodeToOwlString(input) + '^^'
      owl_string += nodeToOwlString(value_domain) + ' '
    }
  })
  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'
  return owl_string
}

function hasSelf (input, restr_type) {
  // if the restriction is on the range, put the inverse of node
  if (restr_type == TypesEnum.RANGE_RESTRICTION) { return 'ObjectHasSelf(' + objectInverseOf(input) + ')' }

  return 'ObjectHasSelf(' + nodeToOwlString(input) + ')'
}