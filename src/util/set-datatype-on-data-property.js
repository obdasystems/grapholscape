import { Type } from "../model/node-enums"
/**
 * Set `datatype` field on a data property node
 * @param {import('cytoscape').CollectionReturnValue} cyDataProperty 
 */
export default function (cyDataProperty) {
  if(!cyDataProperty) return

  // retrieve datatype for dataproperties
  if(cyDataProperty.data().type === Type.DATA_PROPERTY) {
    let datatype = cyDataProperty
      .neighborhood(`node[type = "${Type.RANGE_RESTRICTION}"]`)
      .neighborhood(`node[type = "${Type.VALUE_DOMAIN}"]`)

    if(datatype.nonempty()) {
      cyDataProperty.data('datatype', datatype[0].data().iri)
    }
  }
}