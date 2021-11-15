/** 
 * @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue
 * @typedef {import('../model/ontology').GrapholElem} GrapholElem
*/
// functions to transform Objects from Model to plain JSON for the views

/**
 * 
 * @param {CollectionReturnValue} cyEntity 
 * @returns {object} Entity for view
 */
export function entityModelToViewData(cyEntity, languages) {
  let entity = cyToGrapholElem(cyEntity)
  let language_variant_properties = {label: ''}
  for (let property in language_variant_properties) {
    if (entity.data[property]) {
      // select a language, either 'selected language', 'default language' or any language from the list 
      if (entity.data[property][languages.selected])
        language_variant_properties[property] = entity.data[property][languages.selected]
      else if (entity.data[property][languages.default])
        language_variant_properties[property] = entity.data[property][languages.default]
      else {
        for (let lang of languages.list) {
          if (entity.data[property][lang]) {
            language_variant_properties[property] = entity.data[property][lang]
            break
          }
        }
      }
    }
  }

  let entityViewData = {
    id : entity.data.id,
    id_xml : entity.data.id_xml,
    diagram_id : entity.data.diagram_id,
    label : language_variant_properties.label,
    displayed_name : entity.data.displayed_name,
    type : entity.data.type,
    iri : entity.data.iri,
    description : entity.data.description,
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
 * @returns {GrapholElem}
 */
export function cyToGrapholElem(cytoscapeObj) {
  return cytoscapeObj.json()
}