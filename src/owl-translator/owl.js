import { entityIriTemplate } from "./iri-template"
import { Type } from "../model/node-enums"

const malformed = '<span class="owl_error">Malformed Axiom</span>'
const missing_operand = '<span class="owl_error">Missing Operand</span>'

export function edgeToOwlString (edge) {
  var source = edge.source()
  var target = edge.target()

  switch (edge.data('type')) {
    case 'inclusion':
      if (source.data('identity') == Type.CONCEPT && target.data('identity') == Type.CONCEPT) {
        if (source.data('type') == Type.DOMAIN_RESTRICTION && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
          return propertyDomain(edge)
        } else if (source.data('type') == Type.RANGE_RESTRICTION && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
          return propertyRange(edge)
        } else if (target.data('type') == Type.COMPLEMENT || source.data('type') == Type.COMPLEMENT) {
          return disjointClassesFromEdge(edge.connectedNodes())
        }

        return subClassOf(edge)
      } else if (source.data('identity') == Type.OBJECT_PROPERTY && target.data('identity') == Type.OBJECT_PROPERTY) {
        if (target.data('type') == Type.COMPLEMENT) {
          return disjointTypeProperties(edge)
        }
        return subTypePropertyOf(edge)
      } else if (source.data('identity') == Type.VALUE_DOMAIN && target.data('identity') == Type.VALUE_DOMAIN) {
        return propertyRange(edge)
      } else if (source.data('identity') == Type.DATA_PROPERTY && target.data('identity') == Type.DATA_PROPERTY) {
        if (target.data('type') == Type.COMPLEMENT) {
          return disjointTypeProperties(edge)
        } else { return subTypePropertyOf(edge) }
      } else { return malformed }

      break

    case 'equivalence':
      if (source.data('identity') == Type.CONCEPT && target.data('identity') == Type.CONCEPT) {
        return equivalentClasses(edge)
      } else if (source.data('identity') == Type.OBJECT_PROPERTY && target.data('identity') == Type.OBJECT_PROPERTY) {
        if (source.data('type') == Type.ROLE_INVERSE || target.data('type') == Type.ROLE_INVERSE) { return inverseObjectProperties(edge) } else { return equivalentTypeProperties(edge) }
      } else if (source.data('identity') == Type.DATA_PROPERTY && target.data('identity') == Type.DATA_PROPERTY) {
        return equivalentTypeProperties(edge)
      } else { return malformed }

      break

    case 'membership':
      if (target.data('identity') == Type.CONCEPT) { return classAssertion(edge) } else { return propertyAssertion(edge) }
      break
  }
}

function propertyAssertion (edge) {
  var axiom_type = 'Object'
  var owl_string

  if (edge.target().data('identity') == Type.DATA_PROPERTY) {
    axiom_type = 'Data'
  }

  owl_string = axiom_type + 'PropertyAssertion(' + nodeToOwlString(edge.target()) + ' '

  if (edge.source().data('type') == Type.PROPERTY_ASSERTION) {
    var property_node = edge.source()

    property_node.incomers('[type = "input"]').sources().forEach( input => {
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
  if (edge.source().data('type') == Type.ROLE_INVERSE) {
    input = edge.target()
    complement_input = edge.source().incomers('[type = "input"]').sources().first()
  } else {
    input = edge.source()
    complement_input = edge.target().incomers('[type = "input"]').sources().first()
  }

  if (!complement_input.length) { return missing_operand }

  return 'InverseObjectProperties(' + nodeToOwlString(input) + ' ' + nodeToOwlString(complement_input) + ')'
}

function equivalentClasses (edge) {
  return 'EquivalentClasses(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function equivalentTypeProperties (edge) {
  var axiom_type
  if (edge.source().data('idenity') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' } else { axiom_type = 'Data' }

  return 'Equivalent' + axiom_type + 'Properties(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subClassOf (edge) {
  return 'SubClassOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function subTypePropertyOf (edge) {
  var axiom_type

  if (edge.target().data('identity') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' } else if (edge.target().data('type') == Type.DATA_PROPERTY) { axiom_type = 'Data' } else { return null }

  return 'Sub' + axiom_type + 'PropertyOf(' + nodeToOwlString(edge.source()) + ' ' + nodeToOwlString(edge.target()) + ')'
}

function propertyDomain (edge) {
  var node = edge.source().incomers('[type = "input"]').sources()

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == Type.OBJECT_PROPERTY) { return 'ObjectPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == Type.DATA_PROPERTY) { return 'DataPropertyDomain(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function propertyRange (edge) {
  var node = edge.source().incomers('[type = "input"]').sources()

  if (node.size() > 1) { return subClassOf(edge) }

  if (node.data('type') == Type.OBJECT_PROPERTY) { return 'ObjectPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' } else if (node.data('type') == Type.DATA_PROPERTY) { return 'DataPropertyRange(' + nodeToOwlString(node) + ' ' + nodeToOwlString(edge.target()) + ')' }
}

function disjointClassesFromEdge (inputs) {
  var owl_string = 'DisjointClasses('

  inputs.forEach(function (input) {
    if (input.data('type') == Type.COMPLEMENT) {
      input = input.incomers('[type = "input"]').source()
    }
    owl_string += nodeToOwlString(input) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  owl_string += ')'
  return owl_string
}

function disjointTypeProperties (edge) {
  var axiom_type, owl_string

  if (edge.target().data('identity') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' } else if (edge.target().data('identity') == Type.DATA_PROPERTY) { axiom_type = 'Data' } else { return null }

  owl_string = 'Disjoint' + axiom_type + 'Properties('

  edge.connectedNodes().forEach(function (node) {
    if (node.data('type') == Type.COMPLEMENT) {
      node = node.incomers('[type = "input"]').source()
    }
    owl_string += nodeToOwlString(node) + ' '
  })

  owl_string = owl_string.slice(0, owl_string.length - 1)
  return owl_string + ')'
}

const owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>'
const rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>'
const not_defined = 'Undefined'

export function nodeToOwlString (node, from_node) {
  
  var from_node_flag = from_node || null

  if (from_node_flag && (node.hasClass('predicate') || node.data('type') == Type.VALUE_DOMAIN)) {
    var owl_predicate = entityIriTemplate(node.data('iri'), node.data('type'))
    var owl_type

    switch (node.data('type')) {
      case Type.CONCEPT:
        owl_type = 'Class'
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
        break

      case Type.OBJECT_PROPERTY:
        owl_type = 'ObjectProperty'
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))'

        if (node.data('functional')) { owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('inverseFunctional')) { owl_string += '<br/>InverseFunctional' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('asymmetric')) { owl_string += '<br />Asymmetric' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('irreflexive')) { owl_string += '<br/>Irreflexive' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('reflexive')) { owl_string += '<br/>Reflexive' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('symmetric')) { owl_string += '<br/>Symmetric' + owl_type + '(' + owl_predicate + ')' }

        if (node.data('transitive')) { owl_string += '<br/>Transitive' + owl_type + '(' + owl_predicate + ')' }

        return owl_string
        break

      case Type.DATA_PROPERTY:
        owl_type = 'DataProperty'
        var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))'

        if (node.data('functional')) { owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + '))' }

        return owl_string
        break

      case Type.INDIVIDUAL:
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

      case Type.VALUE_DOMAIN:
        owl_type = 'Datatype'
        return 'Declaration(' + owl_type + '(' + owl_predicate + '))'
        break
    }
  }

  switch (node.data('type')) {
    case Type.INDIVIDUAL:
      if (node.data('iri').remainingChars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
        var value = node.data('iri').remainingChars.split('^^')[0]
        var datatype = node.data('iri').remainingChars.split(':')[1]

        return '<span class="owl_value">' + value + '</span>^^' +
        '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' +
        '<span class="owl_value-domain">' + datatype + '</span>'
      }

    case Type.CONCEPT:
    case Type.OBJECT_PROPERTY:
    case Type.VALUE_DOMAIN:
    case Type.DATA_PROPERTY:
    case Type.INDIVIDUAL:
      return entityIriTemplate(node.data('iri'), node.data('type'))
      break

    case Type.FACET:
      var rem_chars = node.data('displayed_name').replace(/\n/g, '^').split('^^')
      rem_chars[0] = rem_chars[0].slice(4)
      return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + rem_chars[0] + '</span><span class="owl_value">' + rem_chars[1] + '</span>'
      break

    case Type.DOMAIN_RESTRICTION:
    case Type.RANGE_RESTRICTION:
      var input_edges = node.connectedEdges('edge[target = "' + node.id() + '"][type = "input"]')
      var input_first; var input_other; var input_attribute = null

      if (!input_edges.length) { return missing_operand }

      input_edges.forEach(function (e) {
        if (e.source().data('type') == Type.OBJECT_PROPERTY || e.source().data('type') == Type.DATA_PROPERTY) {
          input_first = e.source()
        }

        if (e.source().data('type') != Type.OBJECT_PROPERTY && e.source().data('type') != Type.DATA_PROPERTY) {
          input_other = e.source()
        }
      })

      if (input_first) {
        if (input_first.data('type') == Type.DATA_PROPERTY && node.data('type') == Type.RANGE_RESTRICTION) { return not_defined }

        if (node.data('displayed_name') == 'exists') { return someValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayed_name') == 'forall') { return allValuesFrom(input_first, input_other, node.data('type')) } else if (node.data('displayed_name').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('displayed_name').replace(/\(|\)/g, '').split(/,/)
          return minMaxExactCardinality(input_first, input_other, cardinality, node.data('type'))
        } else if (node.data('displayed_name') == 'self') {
          return hasSelf(input_first, node.data('type'))
        }
      } else return missing_operand

    case Type.ROLE_INVERSE:
      var input = node.incomers('[type = "input"]').sources()

      if (!input.length) { return missing_operand }

      return objectInverseOf(input)
      break

    case Type.ROLE_CHAIN:
      if (!node.data('inputs')) { return missing_operand }

      return objectPropertyChain(node.incomers('[type = "input"]').sources())
      break

    case Type.UNION:
    case Type.INTERSECTION:
    case Type.COMPLEMENT:
    case Type.ENUMERATION:
    case Type.DISJOINT_UNION:
      var inputs = node.incomers('[type = "input"]').sources()
      if (!inputs.length) { return missing_operand }

      var axiom_type = 'Object'

      if (node.data('identity') != Type.CONCEPT && node.data('identity') != Type.OBJECT_PROPERTY) { axiom_type = 'Data' }

      if (node.data('type') == Type.DISJOINT_UNION) {
        if (!from_node_flag) {
          return logicalConstructors(inputs, Type.UNION, axiom_type)
        } else {
          return logicalConstructors(inputs, Type.UNION, axiom_type) + '<br />' + disjointClassesFromNode(inputs)
        }
      }

      return logicalConstructors(inputs, node.data('type'), axiom_type)
      break

    case Type.DATATYPE_RESTRICTION:
      inputs = node.incomers('[type = "input"]').sources()
      if (!inputs.length) { return missing_operand }

      return datatypeRestriction(inputs)
      break

    case Type.PROPERTY_ASSERTION:
      return not_defined

    case Type.KEY:
      inputs = node.incomers('[type = "input"]')
      if (!inputs.length || inputs.length < 2)
        return missing_operand

      return hasKey(inputs.sources())
      break
  }
}


function someValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == Type.DATA_PROPERTY) { axiom_type = 'Data' }

  owl_string = axiom_type + 'SomeValuesFrom('

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == Type.RANGE_RESTRICTION) { owl_string += objectInverseOf(first) } else { owl_string += nodeToOwlString(first) }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function allValuesFrom (first, other, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == Type.DATA_PROPERTY) { axiom_type = 'Data' }

  owl_string = axiom_type + 'AllValuesFrom('

  // if the node is a range-restriction, put the inverse of the role
  if (restr_type == Type.RANGE_RESTRICTION) { owl_string += objectInverseOf(first) } else { owl_string += nodeToOwlString(first) }

  if (!other && axiom_type == 'Object') { return owl_string += ' ' + owl_thing + ')' }

  if (!other && axiom_type == 'Data') { return owl_string += ' ' + rdfs_literal + ')' }

  return owl_string += ' ' + nodeToOwlString(other) + ')'
}

function minMaxExactCardinality (first, other, cardinality, restr_type) {
  var axiom_type, owl_string
  if (first.data('type') == Type.OBJECT_PROPERTY) { axiom_type = 'Object' }

  if (first.data('type') == Type.DATA_PROPERTY) { axiom_type = 'Data' }

  if (cardinality[0] == '-') {
    if (restr_type == Type.RANGE_RESTRICTION) {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[1] == '-') {
    if (restr_type == Type.RANGE_RESTRICTION) {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(first) + ' ' + nodeToOwlString(other) + ')' }
    } else {
      if (!other) { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ')' } else { return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + nodeToOwlString(first) + ' ' + nodeToOwlString(other) + ')' }
    }
  }

  if (cardinality[0] != '-' && cardinality[1] != '-') {
    var min = []; var max = []

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
  
  let class_node = inputs.filter('[identity = "concept"]')
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

  if (constructor_name == Type.ENUMERATION) { constructor_name = 'One' } else // Capitalize first char
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
    if (input.data('type') == Type.FACET) {
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
  if (restr_type == Type.RANGE_RESTRICTION) { return 'ObjectHasSelf(' + objectInverseOf(input) + ')' }

  return 'ObjectHasSelf(' + nodeToOwlString(input) + ')'
}