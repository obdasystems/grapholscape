/** 
 * Node types in a Graphol ontology
 * @enum {string}
 * @property {string} CONCEPT concept
 * @property {string} DOMAIN_RESTRICTION domain-restriction
 * @property {string} RANGE_RESTRICTION range-restriction
 * @property {string} OBJECT_PROPERTY role
 * @property {string} DATA_PROPERTY attribute
 * @property {string} UNION union
 * @property {string} DISJOINT_UNION disjoint-union
 * @property {string} COMPLEMENT complement
 * @property {string} INTERSECTION intersection
 * @property {string} ENUMERATION enumeration
 * @property {string} KEY has-key
 * @property {string} ROLE_INVERSE role-inverse
 * @property {string} ROLE_CHAIN role-chain
 * @property {string} DATATYPE_RESTRICTION datatype-restriction
 * @property {string} VALUE_DOMAIN value-domain
 * @property {string} PROPERTY_ASSERTION property-assertion
 * @property {string} LITERAL literal
 * @property {string} INDIVIDUAL individual
 * @property {string} FACET facet
 * @property {string} NEUTRAL neutral
 * @property {string} VALUE value
 */
export const Type = {
  /** @type {"concept"} */
  CONCEPT: 'concept',
  /** @type {"domain-restriction"} */
  DOMAIN_RESTRICTION: 'domain-restriction',
  /** @type {"range-restriction"} */
  RANGE_RESTRICTION: 'range-restriction',
  /** @type {"role"} */
  OBJECT_PROPERTY: 'role',
  /** @type {"attribute"} */
  DATA_PROPERTY: 'attribute',
  /** @type {"union"} */
  UNION: 'union',
  /** @type {"disjoint-union"} */
  DISJOINT_UNION: 'disjoint-union',
  /** @type {"complement"} */
  COMPLEMENT: 'complement',
  /** @type {"intersection"} */
  INTERSECTION: 'intersection',
  /** @type {"enumeration"} */
  ENUMERATION: 'enumeration',
  /** @type {"has-key"} */
  KEY: 'has-key',
  /** @type {"role-inverse"} */
  ROLE_INVERSE: 'role-inverse',
  /** @type {"role-chain"} */
  ROLE_CHAIN: 'role-chain',
  /** @type {"datatype-restriction"} */
  DATATYPE_RESTRICTION: 'datatype-restriction',
  /** @type {"value-domain"} */
  VALUE_DOMAIN: 'value-domain',
  /** @type {"property-assertion"} */
  PROPERTY_ASSERTION: 'property-assertion',
  /** @type {"literal"} */
  LITERAL: 'literal',
  /** @type {"individual"} */
  INDIVIDUAL: 'individual',
  /** @type {"facet"} */
  FACET: 'facet',
  /** @type {"neutral"} */
  NEUTRAL: 'neutral',
  /** @type {"value"} */
  VALUE: 'value'
}

/**
 * Shapes assigned to Graphol nodes. These are [Cytoscape.js shapes](https://js.cytoscape.org/#style/node-body)  
 * @enum {string}
 * @property {string} RECTANGLE rectangle
 * @property {string} DIAMOND diamond
 * @property {string} ELLIPSE ellipse
 * @property {string} HEXAGON hexagon
 * @property {string} ROUND_RECTANGLE roundrectangle
 * @property {string} OCTAGON octagon
 * @property {string} POLYGON polygon
 */
export const Shape = {
  /** @type {"rectangle"} */
  RECTANGLE: 'rectangle',
  /** @type {"diamond"} */
  DIAMOND: 'diamond',
  /** @type {"ellipse"} */
  ELLIPSE: 'ellipse',
  /** @type {"hexagon"} */
  HEXAGON: 'hexagon',
  /** @type {"roundrectangle"} */
  ROUND_RECTANGLE: 'roundrectangle',
  /** @type {"octagon"} */
  OCTAGON: 'octagon',
  /** @type {"polygon"} */
  POLYGON: 'polygon'
}

export const POLYGON_POINTS = '-0.9 -1 1 -1 0.9 1 -1 1'

/**
 * Enumeration having `type`, `shape` and `identity` for each Graphol node
 * @type {object} 
 */
export default {
  CONCEPT: {
    TYPE: Type.CONCEPT,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.CONCEPT
  },
  DOMAIN_RESTRICTION: {
    TYPE: Type.DOMAIN_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.CONCEPT,
  },
  RANGE_RESTRICTION: {
    TYPE: Type.RANGE_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: Type.NEUTRAL
  },
  OBJECT_PROPERTY: {
    TYPE: Type.OBJECT_PROPERTY,
    SHAPE: Shape.DIAMOND,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  DATA_PROPERTY: {
    TYPE: Type.DATA_PROPERTY,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: Type.DATA_PROPERTY
  },
  UNION: {
    TYPE: Type.UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  DISJOINT_UNION: {
    TYPE: Type.DISJOINT_UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  COMPLEMENT: {
    TYPE: Type.COMPLEMENT,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  INTERSECTION: {
    TYPE: Type.INTERSECTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  ENUMERATION: {
    TYPE: Type.ENUMERATION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  KEY: {
    TYPE: Type.KEY,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.NEUTRAL
  },
  ROLE_INVERSE: {
    TYPE: Type.ROLE_INVERSE,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  ROLE_CHAIN: {
    TYPE: Type.ROLE_CHAIN,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.OBJECT_PROPERTY
  },
  DATATYPE_RESTRICTION: {
    TYPE: Type.DATATYPE_RESTRICTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: Type.VALUE_DOMAIN
  },
  VALUE_DOMAIN: {
    TYPE: Type.VALUE_DOMAIN,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: Type.VALUE_DOMAIN
  },
  PROPERTY_ASSERTION: {
    TYPE: Type.PROPERTY_ASSERTION,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: Type.NEUTRAL
  },
  LITERAL: {
    TYPE: Type.LITERAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: Type.VALUE
  },
  INDIVIDUAL: {
    TYPE: Type.INDIVIDUAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: Type.INDIVIDUAL
  },
  FACET: {
    TYPE: Type.FACET,
    SHAPE: Shape.POLYGON,
    SHAPE_POINTS: POLYGON_POINTS, 
    IDENTITY: Type.FACET
  }
}

/**
 * Labels to apply to constructor nodes in Graphol
 * @enum {string}
 * @property {string} UNION or
 * @property {string} INTERSECTION and
 * @property {string} ROLE_CHAIN inv
 * @property {string} COMPLEMENT not
 * @property {string} DATATYPE_RESTRICTION data
 * @property {string} ENUMERATION oneOf
 * @property {string} KEY key
 */
export const constructorLabels = {
  /** @type {"or"} */
  UNION: 'or',
  /** @type {"and"} */
  INTERSECTION : 'and',
  /** @type {"chain"} */
  ROLE_CHAIN : 'chain',
  /** @type {"inv"} */
  ROLE_INVERSE : 'inv',
  /** @type {"not"} */
  COMPLEMENT: 'not',
  /** @type {"data"} */
  DATATYPE_RESTRICTION : 'data',
  /** @type {"oneOf"} */
  ENUMERATION : 'oneOf',
  /** @type {"key"} */
  KEY : 'key',
}