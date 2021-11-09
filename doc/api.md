

<!-- Start src/grapholscape-controller.js -->

# GrapholscapeController - API
an object of this class is returned to the promise when reading a graphol file.
It expose a set of methods to set filters, change viewport state etc.

Version: 1.3.0 <!-- don't touch, automatic version injection, see src/doc/doc.js -->

## init()

Initialize controller
 - bind all event listener for the view
 - create all widgets with actual config and ontology infos

## onBackgroundClick()

Event handler for clicks on empty area of the graph.
It collapse all widgets' body.

## filter(type)

Activate one of the defined filters.

### Params:

* **String** *type* - one of `all`, `attributes`, `value-domain`, `individuals`, `universal`, `not`

## showDiagram(diagramModelData)

Display a diagram on the screen.

### Params:

* **JSON|string|number** *diagramModelData* The diagram retrieved from model, its name or it's id

## showDetails(entityModelData, unselect)

Show to the user the details of an entity.

### Params:

* **JSON** *entityModelData* The entity retrieved from model.
* **Boolean** *unselect* - Flag for unselecting elements on graph. Default `false`.

## centerOnNode(nodeModelData, zoom)

Focus on a single node and zoom on it.
If necessary it also display the diagram containing the node.

### Params:

* **JSON** *nodeModelData* - The node retrieved from model
* **Number** *zoom* - The zoom level to apply

## showOwlTranslation(elem)

Get OWL translation from a node and give the result to the view.
To be refactored.

### Params:

* **object** *elem* - Cytoscape representation of a node or a edge

## changeRenderingMode(mode, keep_viewport_state)

Change the rendering mode.

### Params:

* **string** *mode* - the rendering/simplifation mode to activate: `default`, `lite`, or `float`
* **boolean** *keep_viewport_state* - if `false`, viewport will fit on diagram. Set it `true` if you don't want the viewport state to change.
In case of no diagram displayed yet, it will be forced to `false`.
Default: `true`.

> Note: in case of activation or deactivation of the `float` mode, this value will be ignored.

## updateGraphView(state)

Redraw actual diagram and set viewport state. If state is not passed, viewport is not changed.

### Params:

* **object** *state* - object representation of **rendered position** in [cytoscape format](https://js.cytoscape.org/#notation/position). 
> Example: { x: 0, y: 0, zoom: 1} - initial state

## updateEntitiesList()

Update the entities list in the ontology explorer widget

## setConfig(new_config)

Update the actual configuration and apply changes.

### Params:

* **Object** *new_config* - a configuration object. Please read [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)

## exportToPNG(fileName)

Export the current diagram in to a PNG image and save it on user's disk

### Params:

* **String** *fileName* - the name to assign to the file (Default: [ontology name]-[diagram name]-v[ontology version])

## exportToSVG(fileName)

Export the current diagram in to a SVG file and save it on user's disk

### Params:

* **String** *fileName* - the name to assign to the file (Default: [ontology name]-[diagram name]-v[ontology version])

## onWikiClick

Setter.
Set the callback function for wiki redirection given an IRI

### Params:

* **Function** *callback* - the function to call when redirecting to a wiki page. The callback will receive the IRI.

## language

Getter

### Return:

* **string** - selected language

## languagesList

Getter

### Return:

* **Array** - languages defined in the ontology

## actual_diagram

Getter

### Return:

* **Diagram** - the diagram displayed

<!-- End src/grapholscape-controller.js -->

