import { Iri, TypesEnum } from "../model";



export function entityIriTemplate(iri: Iri | { remainder: string, prefix: string }, entityType: TypesEnum){

  if (entityType === TypesEnum.FACET) {
    if (iri.remainder.search(/"[\w]+"\^\^[\w]+:/) != -1) {
      var value = iri.remainder.split('^^')[0]
      var datatype = iri.remainder.split(':')[1]

      return '<span class="owl_value">' + value + '</span>^^' +
        '<span class="axiom_predicate_prefix">' + iri.prefix + '</span>' +
        '<span class="owl_value-domain">' + datatype + '</span>'
    }
    return
  }

  return `<span class="axiom_predicate_prefix">${iri.prefix}</span>:<span class="owl_${entityType}">${iri.remainder}</span>`
}