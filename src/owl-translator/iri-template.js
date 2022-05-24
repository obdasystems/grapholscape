/** 
 * @param {import("../model/ontology").Iri} iri 
 * @param {import("../model/graphol-elems/node-enums").ElemType} entityType
 */
export function entityIriTemplate(iri, entityType) {
  return `<span class="axiom_predicate_prefix">${iri.prefix}</span>:<span class="owl_${entityType}">${iri.remainingChars}</span>`
}