

<!-- Start src\model\diagram.js -->

## Diagram

### Properties:

* **string** *name* - diagram's name
* **string|number** *id* - diagram's identifier
* **cytoscape** *cy* - cytoscape headless instance for managing elements

## constructor

### Params:

* **string** *name* 
* **string|number** *id* 
* **JSON** *elements* - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)

## addElems(elems)

Add a collection of nodes and edges to the diagram

### Params:

* **JSON** *elems* - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)

## getElems()

### Return:

* **any** - A cytoscape collection with nodes and edges

## nodes

Getter

### Return:

* **JSON** - nodes in JSON

## edges

Getter

### Return:

* **JSON** - edges in JSON

## elems

Getter

### Return:

* **any** - nodes and edges in JSON

<!-- End src\model\diagram.js -->

