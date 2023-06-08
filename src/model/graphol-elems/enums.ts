/** 
 * Node types in a Graphol ontology
 */
export enum GrapholTypesEnum {
  CLASS = 'class',
  /** @type {"domain-restriction"} */
  DOMAIN_RESTRICTION = 'domain-restriction',
  /** @type {"range-restriction"} */
  RANGE_RESTRICTION = 'range-restriction',
  /** @type {"role"} */
  OBJECT_PROPERTY = 'object-property',
  /** @type {"data property"} */
  DATA_PROPERTY = 'data-property',
  /** @type {"union"} */
  UNION = 'union',
  /** @type {"disjoint-union"} */
  DISJOINT_UNION = 'disjoint-union',
  /** @type {"complement"} */
  COMPLEMENT = 'complement',
  /** @type {"intersection"} */
  INTERSECTION = 'intersection',
  /** @type {"enumeration"} */
  ENUMERATION = 'enumeration',
  /** @type {"has-key"} */
  KEY = 'has-key',
  /** @type {"role-inverse"} */
  ROLE_INVERSE = 'role-inverse',
  /** @type {"role-chain"} */
  ROLE_CHAIN = 'role-chain',
  /** @type {"datatype-restriction"} */
  DATATYPE_RESTRICTION = 'datatype-restriction',
  /** @type {"value-domain"} */
  VALUE_DOMAIN = 'value-domain',
  /** @type {"property-assertion"} */
  PROPERTY_ASSERTION = 'property-assertion',
  /** @type {"literal"} */
  LITERAL = 'literal',
  /** @type {"individual"} */
  INDIVIDUAL = 'individual',
  /** @type {"facet"} */
  FACET = 'facet',
  /** @type {"neutral"} */
  NEUTRAL = 'neutral',
  /** @type {"value"} */
  VALUE = 'value',
  // EDGES
  /** @type {"inclusion"} */
  INCLUSION = 'inclusion',
  /** @type {"input"} */
  INPUT = 'input',
  /** @type {"equivalence"} */
  EQUIVALENCE = 'equivalence',
  /** @type {"instanceOf"} */
  INSTANCE_OF = 'instanceOf',
  /** @type {"same"} */
  SAME = 'same',
  /** @type {"different"} */
  DIFFERENT = 'different',
  /** @type {"membership"} */
  MEMBERSHIP = 'membership',
  /** @type {"class-instance"} */
  CLASS_INSTANCE = 'class-instance',
  /** @type {"unknown"} */
  UNKNOWN = 'unknown'
}

/**
 * Shapes assigned to Graphol nodes. These are [Cytoscape.js shapes](https =//js.cytoscape.org/#style/node-body)  
 * @enum {string}
 * @property {string} RECTANGLE rectangle
 * @property {string} DIAMOND diamond
 * @property {string} ELLIPSE ellipse
 * @property {string} HEXAGON hexagon
 * @property {string} ROUND_RECTANGLE roundrectangle
 * @property {string} OCTAGON octagon
 * @property {string} POLYGON polygon
 */
export enum Shape {
  /** @type {"rectangle"} */
  RECTANGLE = 'rectangle',
  /** @type {"diamond"} */
  DIAMOND = 'diamond',
  /** @type {"ellipse"} */
  ELLIPSE = 'ellipse',
  /** @type {"hexagon"} */
  HEXAGON = 'hexagon',
  /** @type {"roundrectangle"} */
  ROUND_RECTANGLE = 'roundrectangle',
  /** @type {"octagon"} */
  OCTAGON = 'octagon',
  /** @type {"polygon"} */
  POLYGON = 'polygon'
}

export const POLYGON_POINTS = '-0.9 -1 1 -1 0.9 1 -1 1'

/**
 * Enumeration having `type`, `shape` and `identity` for each Graphol node
 */
export type GrapholNodeInfo =  { TYPE: GrapholTypesEnum, SHAPE: Shape, IDENTITY: GrapholTypesEnum, SHAPE_POINTS?: string }

export const GrapholNodesEnum: { [x in keyof typeof GrapholTypesEnum]?: GrapholNodeInfo } = {
  CLASS: {
    TYPE: GrapholTypesEnum.CLASS,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: GrapholTypesEnum.CLASS
  },
  DOMAIN_RESTRICTION: {
    TYPE: GrapholTypesEnum.DOMAIN_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: GrapholTypesEnum.CLASS,
  },
  RANGE_RESTRICTION: {
    TYPE: GrapholTypesEnum.RANGE_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  OBJECT_PROPERTY: {
    TYPE: GrapholTypesEnum.OBJECT_PROPERTY,
    SHAPE: Shape.DIAMOND,
    IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
  },
  DATA_PROPERTY: {
    TYPE: GrapholTypesEnum.DATA_PROPERTY,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: GrapholTypesEnum.DATA_PROPERTY
  },
  UNION: {
    TYPE: GrapholTypesEnum.UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  DISJOINT_UNION: {
    TYPE: GrapholTypesEnum.DISJOINT_UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  COMPLEMENT: {
    TYPE: GrapholTypesEnum.COMPLEMENT,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  INTERSECTION: {
    TYPE: GrapholTypesEnum.INTERSECTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  ENUMERATION: {
    TYPE: GrapholTypesEnum.ENUMERATION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  KEY: {
    TYPE: GrapholTypesEnum.KEY,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  ROLE_INVERSE: {
    TYPE: GrapholTypesEnum.ROLE_INVERSE,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
  },
  ROLE_CHAIN: {
    TYPE: GrapholTypesEnum.ROLE_CHAIN,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.OBJECT_PROPERTY
  },
  DATATYPE_RESTRICTION: {
    TYPE: GrapholTypesEnum.DATATYPE_RESTRICTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: GrapholTypesEnum.VALUE_DOMAIN
  },
  VALUE_DOMAIN: {
    TYPE: GrapholTypesEnum.VALUE_DOMAIN,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: GrapholTypesEnum.VALUE_DOMAIN
  },
  PROPERTY_ASSERTION: {
    TYPE: GrapholTypesEnum.PROPERTY_ASSERTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: GrapholTypesEnum.NEUTRAL
  },
  LITERAL: {
    TYPE: GrapholTypesEnum.LITERAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: GrapholTypesEnum.VALUE
  },
  INDIVIDUAL: {
    TYPE: GrapholTypesEnum.INDIVIDUAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: GrapholTypesEnum.INDIVIDUAL
  },
  FACET: {
    TYPE: GrapholTypesEnum.FACET,
    SHAPE: Shape.POLYGON,
    SHAPE_POINTS: POLYGON_POINTS,
    IDENTITY: GrapholTypesEnum.FACET
  },
  CLASS_INSTANCE: {
    TYPE: GrapholTypesEnum.CLASS_INSTANCE,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: GrapholTypesEnum.CLASS_INSTANCE,
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
export enum ConstructorLabelsEnum {
  /** @type {"or"} */
  UNION = 'or',
  /** @type {"and"} */
  INTERSECTION = 'and',
  /** @type {"chain"} */
  ROLE_CHAIN = 'chain',
  /** @type {"inv"} */
  ROLE_INVERSE = 'inv',
  /** @type {"not"} */
  COMPLEMENT = 'not',
  /** @type {"data"} */
  DATATYPE_RESTRICTION = 'data',
  /** @type {"oneOf"} */
  ENUMERATION = 'oneOf',
  /** @type {"key"} */
  KEY = 'key',
}