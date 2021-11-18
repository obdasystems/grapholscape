/** 
 * @param {import("../model/ontology").Iri} iri 
 * @param {import("../model/node-enums").ElemType} entityType
 */
export function entityIriTemplate(iri, entityType) {
  return `<span class="axiom_predicate_prefix">${iri.prefix}</span>:<span class="owl_${entityType}">${iri.remainingChars}</span>`
}