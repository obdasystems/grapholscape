import { TypesEnum } from "../rdf-graph/swagger"

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
export type GrapholNodeInfo =  { TYPE: TypesEnum, SHAPE: Shape, IDENTITY: TypesEnum, SHAPE_POINTS?: string }

export const GrapholNodesEnum: { [x in TypesEnum ]?: GrapholNodeInfo } = {
  [TypesEnum.CLASS]: {
    TYPE: TypesEnum.CLASS,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: TypesEnum.CLASS
  },
  [TypesEnum.DOMAIN_RESTRICTION]: {
    TYPE: TypesEnum.DOMAIN_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: TypesEnum.CLASS,
  },
  [TypesEnum.RANGE_RESTRICTION]: {
    TYPE: TypesEnum.RANGE_RESTRICTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.OBJECT_PROPERTY]: {
    TYPE: TypesEnum.OBJECT_PROPERTY,
    SHAPE: Shape.DIAMOND,
    IDENTITY: TypesEnum.OBJECT_PROPERTY
  },
  [TypesEnum.DATA_PROPERTY]: {
    TYPE: TypesEnum.DATA_PROPERTY,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: TypesEnum.DATA_PROPERTY
  },
  [TypesEnum.UNION]: {
    TYPE: TypesEnum.UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.DISJOINT_UNION]: {
    TYPE: TypesEnum.DISJOINT_UNION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.COMPLEMENT]: {
    TYPE: TypesEnum.COMPLEMENT,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.INTERSECTION]: {
    TYPE: TypesEnum.INTERSECTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.ENUMERATION]: {
    TYPE: TypesEnum.ENUMERATION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.HAS_KEY]: {
    TYPE: TypesEnum.HAS_KEY,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.ROLE_INVERSE]: {
    TYPE: TypesEnum.ROLE_INVERSE,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.OBJECT_PROPERTY
  },
  [TypesEnum.ROLE_CHAIN]: {
    TYPE: TypesEnum.ROLE_CHAIN,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.OBJECT_PROPERTY
  },
  [TypesEnum.DATATYPE_RESTRICTION]: {
    TYPE: TypesEnum.DATATYPE_RESTRICTION,
    SHAPE: Shape.HEXAGON,
    IDENTITY: TypesEnum.VALUE_DOMAIN
  },
  [TypesEnum.VALUE_DOMAIN]: {
    TYPE: TypesEnum.VALUE_DOMAIN,
    SHAPE: Shape.ROUND_RECTANGLE,
    IDENTITY: TypesEnum.VALUE_DOMAIN
  },
  [TypesEnum.PROPERTY_ASSERTION]: {
    TYPE: TypesEnum.PROPERTY_ASSERTION,
    SHAPE: Shape.RECTANGLE,
    IDENTITY: TypesEnum.NEUTRAL
  },
  [TypesEnum.LITERAL]: {
    TYPE: TypesEnum.LITERAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: TypesEnum.VALUE
  },
  [TypesEnum.INDIVIDUAL]: {
    TYPE: TypesEnum.INDIVIDUAL,
    SHAPE: Shape.OCTAGON,
    IDENTITY: TypesEnum.INDIVIDUAL
  },
  [TypesEnum.FACET]: {
    TYPE: TypesEnum.FACET,
    SHAPE: Shape.POLYGON,
    SHAPE_POINTS: POLYGON_POINTS,
    IDENTITY: TypesEnum.FACET
  },
  [TypesEnum.CLASS_INSTANCE]: {
    TYPE: TypesEnum.CLASS_INSTANCE,
    SHAPE: Shape.ELLIPSE,
    IDENTITY: TypesEnum.CLASS_INSTANCE,
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