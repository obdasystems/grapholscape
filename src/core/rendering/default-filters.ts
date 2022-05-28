import { Filter } from '../../model'
import { GrapholTypesEnum } from '../../model/graphol-elems/node-enums'


export enum DefaultFilterKeyEnum {
  ALL = 'all',
  DATA_PROPERTY = 'data-property',
  VALUE_DOMAIN = 'value-domain',
  INDIVIDUAL = 'individual',
  UNIVERSAL_QUANTIFIER = 'for-all',
  COMPLEMENT = 'complement',
  HAS_KEY = 'has-key'
}

const dataPropertyFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.DATA_PROPERTY,
    (element) => element.is(GrapholTypesEnum.DATA_PROPERTY)
  )
}

const valueDomainFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    (element) => element.is(GrapholTypesEnum.VALUE_DOMAIN)
  )
}

const individualsFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.INDIVIDUAL,
    (element) => element.is(GrapholTypesEnum.INDIVIDUAL)
  )
}

const universalQuantifierFilter = () => new Filter(
  DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
  (element) => {
    return (element.is(GrapholTypesEnum.DOMAIN_RESTRICTION) || element.is(GrapholTypesEnum.RANGE_RESTRICTION)) &&
      element.displayedName === 'forall'
  }
)

const complementFilter = () => new Filter(
  DefaultFilterKeyEnum.COMPLEMENT,
  (element) => element.is(GrapholTypesEnum.COMPLEMENT)
)

const hasKeyFilter = () => new Filter(
  DefaultFilterKeyEnum.HAS_KEY,
  (element) => element.is(GrapholTypesEnum.KEY)
)

export const getDefaultFilters = () => {
  return {
    DATA_PROPERTY: dataPropertyFilter(),
    VALUE_DOMAIN: valueDomainFilter(),
    INDIVIDUAL: individualsFilter(),
    UNIVERSAL_QUANTIFIER: universalQuantifierFilter(),
    COMPLEMENT: complementFilter(),
    HAS_KEY: hasKeyFilter(),
  } as const
}

function getFilterByString(key: string, filters: Map<string, Filter>) {
  const filter = filters.get(key)

  if (!filter) {
    console.warn(`Can't find any filter with key = "${key}"`)
  }

  return filter
}