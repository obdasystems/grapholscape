

<!-- Start src\model\ontology.js -->

# Ontology
Class used as the Model of the whole app.

### Properties:

* **string** *name* 
* **string** *version* 
* **Array.\<Namespace>** *namespaces* 
* **Array.\<Diagram>** *diagrams* 

## constructor

### Params:

* **string** *name* 
* **string** *version* 
* **Array.\<Namespace>** *namespaces* 
* **Array.\<Diagram>** *diagrams* 

## getDiagram(index)

### Params:

* **string|number** *index* the id or the name of the diagram

### Return:

* **Diagram** The diagram object

## getElem(elem_id, json)

Get an element in the ontology by id, searching in every diagram

### Params:

* **string** *elem_id* - The `id` of the elem to retrieve
* **boolean** *json* - if `true` return plain json, if `false` return cytoscape node. Default `true`

### Return:

* **any** The cytoscape object or the plain json representation depending on `json` parameter.

## getEntity(iri)

Retrieve an entity by its IRI.

### Params:

* **string** *iri* - The IRI in full or prefixed form. i.e. : `grapholscape:world` or `https://examples/grapholscape/world`

### Return:

* **JSON** The plain json representation of the entity.

## getElemByDiagramAndId(elem_id, diagram_id, json)

Get an element in the ontology by its id and its diagram id

### Params:

* **string** *elem_id* - The id of the element to retrieve
* **string** *diagram_id* - the id of the diagram containing the element
* **boolean** *json* - if true return plain json, if false return cytoscape node. Default true.

## getEntities(json)

Get the entities in the ontology

### Params:

* **boolean** *json* - if true return plain json, if false return cytoscape collection. Default true.

### Return:

* **JSON|any**    - if `json` = `true` : array of JSONs with entities
   - if `json` = `false` : [cytoscape collection](https://js.cytoscape.org/#collection)

<!-- End src\model\ontology.js -->

