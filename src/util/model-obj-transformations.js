/** @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue */

import { Type } from '../model/node-enums'
// functions to transform Objects from Model to plain JSON for the views

/**
 * 
 * @param {CollectionReturnValue} cyEntity 
 * @returns {object} Entity for view
 */
export function entityModelToViewData(cyEntity) {
  let entity = cyToGrapholElem(cyEntity)

  let entityViewData = {
    id : entity.data.id,
    id_xml : entity.data.id_xml,
    diagram_id : entity.data.diagram_id,
    displayed_name : entity.data.displayed_name,
    type : entity.data.type,
    iri : entity.data.iri,
    annotations : entity.data.annotations,
    functional : entity.data.functional,
    inverseFunctional : entity.data.inverseFunctional,
    asymmetric : entity.data.asymmetric,
    irreflexive : entity.data.irreflexive,
    reflexive : entity.data.reflexive,
    symmetric : entity.data.symmetric,
    transitive : entity.data.transitive,
  }

  return JSON.parse(JSON.stringify(entityViewData))
}

/**
 * 
 * @param {Diagram} diagramModelData 
 * @returns {object} digram for view
 */
export function diagramModelToViewData(diagramModelData) {
  let diagramViewData =  {
    name : diagramModelData.name,
    id : diagramModelData.id,
    nodes : diagramModelData.nodes,
    edges : diagramModelData.edges,
  }

  return JSON.parse(JSON.stringify(diagramViewData))
}

/**
 * 
 * @param {Ontology} ontologyModelData 
 * @returns {object} ontology for view
 */
export function ontologyModelToViewData(ontologyModelData) {
  let ontologyViewData = {
    name : ontologyModelData.name,
    version : ontologyModelData.version,
    namespaces : ontologyModelData.namespaces,
    annotations : ontologyModelData.annotations,
    description : ontologyModelData.description
  }
  return JSON.parse(JSON.stringify(ontologyViewData))
}

export function rendererModelToViewData(rendererModelData) {
  let rendererViewData = {
    label : rendererModelData.label,
  }
  return JSON.parse(JSON.stringify(rendererViewData))
}

/**
 * 
 * @param {CollectionReturnValue} cytoscapeObj 
 * @returns {import('../model/ontology').GrapholElem}
 */
export function cyToGrapholElem(cytoscapeObj) {
  const result = cytoscapeObj?.json()
  if (result) {
    result.isEntity = function() {
      switch (this.data.type) {
        case Type.CONCEPT:
        case Type.DATA_PROPERTY:
        case Type.OBJECT_PROPERTY:
        case Type.INDIVIDUAL:
          return true
      }
    
      return false
    }

    return result
  }
}