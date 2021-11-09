// functions to transform Objects from Model to plain JSON for the views

/**
 * 
 * @param {CytoscapeNode} entityModelData 
 * @returns {JSON} Entity in JSON representation
 */
export function entityModelToViewData(entityModelData, languages) {
  let language_variant_properties = ["label"]
  for (let property of language_variant_properties) {
    if (entityModelData.data[property]) {
      // select a language, either 'selected language', 'default language' or any language from the list 
      if (entityModelData.data[property][languages.selected])
        language_variant_properties[property] = entityModelData.data[property][languages.selected]
      else if (entityModelData.data[property][languages.default])
        language_variant_properties[property] = entityModelData.data[property][languages.default]
      else {
        for (let lang of languages.list) {
          if (entityModelData.data[property][lang]) {
            language_variant_properties[property] = entityModelData.data[property][lang]
            break
          }
        }
      }
    }
  }

  let entityViewData = {
    id : entityModelData.data.id,
    id_xml : entityModelData.data.id_xml,
    diagram_id : entityModelData.data.diagram_id,
    label : language_variant_properties.label,
    displayed_name : entityModelData.data.displayed_name,
    type : entityModelData.data.type,
    iri : entityModelData.data.iri,
    description : entityModelData.data.description,
    annotations : entityModelData.data.annotations,
    functional : entityModelData.data.functional,
    inverseFunctional : entityModelData.data.inverseFunctional,
    asymmetric : entityModelData.data.asymmetric,
    irreflexive : entityModelData.data.irreflexive,
    reflexive : entityModelData.data.reflexive,
    symmetric : entityModelData.data.symmetric,
    transitive : entityModelData.data.transitive,
  }

  return JSON.parse(JSON.stringify(entityViewData))
}

/**
 * 
 * @param {Diagram} diagramModelData 
 * @returns {JSON} digram in JSON representation
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