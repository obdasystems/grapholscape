Embedding Grapholscape in your own website, webapp or any other JS/TS powered project is fairly easy, you only need to [install it](#installation), to import it and to [initialise it](#initialisation) it passing the **ontology** to render and the **container** where to render it.

## Installation
To make Grapholscpae available in your project there are two ways to install it depending on the type of your environment: Plain HTML environment or a build and dependency management system like **npm**.

### NPM
```shell
npm install grapholscape
```

### HTML Environment
If you are using a HTML Environment (without a build system) you can:

- Download one of Grapholscape's dists from [dist](https://github.com/obdasystems/grapholscape/tree/master/dist) folder, place it somewhere in your project and link it in a `<script>` tag. For example assuming to have `grapholscape.min.js` in the same folder of your `.html`:

  ```html
  <script src="./grapholscape.min.js" type="text/javascript" ></script>
  ```
  In this case you only have a global reference to the whole library that is `Grapholscape`.

- Download the `.esm.min` version and place it somewhere in your project to import Grapholscape as an ES6 module. For example assuming to have `grapholscape.esm.min.js` in the same folder of your `.html`:

  ```html
  <script type="module">
    import * as Grapholscape from "./grapholscape.esm.min.js";
  </script>
  ```

## Initialisation
Once Grapholscape is installed correctly either as npm package or as a local ES6 module, you have several ways to import the factory functions to get a Grapholscape instance:
- If you want the standard version with the whole set of widgets shipped within grapholscape:
  ```ts
  import { fullGrapholscape } from 'grapholscape'

  const grapholscape = await fullGrapholscape(ontologyFile, container)
  ```

- If you want a bare instance, with no widgets, just the ontology diagram(s):
  ```ts
  import { bareGrapholscape } from 'grapholscape'

  const grapholscape = await bareGrapholscape(ontologyFile, container)
  ```

- If you want to import the whole library (this is not likely to be the case)
  ```ts
  import * as Grapholscape from 'grapholscape'

  const grapholscape = await Grapholscape.fullGrapholscape(ontologyFile, container) // or .bareGrapholscape
  ```

> **Note** : `ontologyFile` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `string` representing the `.graphol` file to be displayed.

Both factory functions return a Promise that will be resolved, once the parsing of the ontology is finished, with a [Grapholscape](../classes/core.Grapholscape.html) instance that can be used to perform actions on the tool. 

Typically the first action you want is to display a diagram, you can do it with:
```ts
grapholscape.showDiagram(0) // show diagram with id = 0

// if you want to show a diagram with a certain name you can do
const diagram = grapholscape.ontology.getDiagramByName('diagramName')
grapholscape.showDiagram(diagram.id)
```

Information about **entities**, **namesapaces** and **diagrams** are stored in [Grapholscape.ontology](..//classes/core.Grapholscape.html). Read More in [Ontology](../classes/model.Ontology.html).

It is possible to pass also a config object to define custom default settings. Read more: [configuration](../pages/configuration.html).
**For the complete api please check [Grapholscape Class API](../classes/core.Grapholscape.html).**

