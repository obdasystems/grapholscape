export const types = {
  CONCEPT: 'concept',
  DOMAIN_RESTRICTION: 'domain-restriction',
  RANGE_RESTRICTION: 'range-restriction',
  OBJECT_PROPERTY: 'role',
  DATA_PROPERTY: 'attribute',
  UNION: 'union',
  DISJOINT_UNION: 'disjoint-union',
  COMPLEMENT: 'complement',
  INTERSECTION: 'intersection',
  ENUMERATION: 'enumeration',
  KEY: 'has-key',
  ROLE_INVERSE: 'role-inverse',
  ROLE_CHAIN: 'role-chain',
  DATATYPE_RESTRICTION: 'datatype-restriction',
  VALUE_DOMAIN: 'value-domain',
  PROPERTY_ASSERTION: 'property-assertion',
  LITERAL: 'literal',
  INDIVIDUAL: 'individual',
  FACET: 'facet',
  NEUTRAL: 'neutral',
  VALUE: 'value'
}

export const shapes = {
  RECTANGLE: 'rectangle',
  DIAMOND: 'diamond',
  ELLIPSE: 'ellipse',
  HEXAGON: 'hexagon',
  ROUND_RECTANGLE: 'roundrectangle',
  OCTAGON: 'octagon',
  POLYGON: 'polygon'
}

export const POLYGON_POINTS = '-0.9 -1 1 -1 0.9 1 -1 1'

export default {
  CONCEPT: {
    TYPE: types.CONCEPT,
    SHAPE: shapes.RECTANGLE,
    IDENTITY: types.CONCEPT
  },
  DOMAIN_RESTRICTION: {
    TYPE: types.DOMAIN_RESTRICTION,
    SHAPE: shapes.RECTANGLE,
    IDENTITY: types.CONCEPT,
  },
  RANGE_RESTRICTION: {
    TYPE: types.RANGE_RESTRICTION,
    SHAPE: shapes.RECTANGLE,
    IDENTITY: types.NEUTRAL
  },
  OBJECT_PROPERTY: {
    TYPE: types.OBJECT_PROPERTY,
    SHAPE: shapes.DIAMOND,
    IDENTITY: types.OBJECT_PROPERTY
  },
  DATA_PROPERTY: {
    TYPE: types.DATA_PROPERTY,
    SHAPE: shapes.ELLIPSE,
    IDENTITY: types.DATA_PROPERTY
  },
  UNION: {
    TYPE: types.UNION,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  DISJOINT_UNION: {
    TYPE: types.DISJOINT_UNION,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  COMPLEMENT: {
    TYPE: types.COMPLEMENT,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  INTERSECTION: {
    TYPE: types.INTERSECTION,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  ENUMERATION: {
    TYPE: types.ENUMERATION,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  KEY: {
    TYPE: types.KEY,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.NEUTRAL
  },
  ROLE_INVERSE: {
    TYPE: types.ROLE_INVERSE,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.OBJECT_PROPERTY
  },
  ROLE_CHAIN: {
    TYPE: types.ROLE_CHAIN,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.OBJECT_PROPERTY
  },
  DATATYPE_RESTRICTION: {
    TYPE: types.DATATYPE_RESTRICTION,
    SHAPE: shapes.HEXAGON,
    IDENTITY: types.VALUE_DOMAIN
  },
  VALUE_DOMAIN: {
    TYPE: types.VALUE_DOMAIN,
    SHAPE: shapes.ROUND_RECTANGLE,
    IDENTITY: types.VALUE_DOMAIN
  },
  PROPERTY_ASSERTION: {
    TYPE: types.PROPERTY_ASSERTION,
    SHAPE: shapes.ROUND_RECTANGLE,
    IDENTITY: types.NEUTRAL
  },
  LITERAL: {
    TYPE: types.LITERAL,
    SHAPE: shapes.OCTAGON,
    IDENTITY: types.VALUE
  },
  INDIVIDUAL: {
    TYPE: types.INDIVIDUAL,
    SHAPE: shapes.OCTAGON,
    IDENTITY: types.INDIVIDUAL
  },
  FACET: {
    TYPE: types.FACET,
    SHAPE: shapes.POLYGON,
    SHAPE_POINTS: POLYGON_POINTS, 
    IDENTITY: types.FACET
  }
}