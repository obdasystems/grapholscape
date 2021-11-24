<p style="margin:auto; max-width:250px" align="center">
  <img width="250px" src="https://github.com/obdasystems/grapholscape/raw/develop/app/assets/logo.png">
</p>

Advanced web viewer for ontologies written in [GRAPHOL](http://www.obdasystems.com/it/node/107). [**Try me**](https://obdasystems.github.io/grapholscape/)

## Features
Grapholscape provides advanced and interactive tools to visually inspect all components of the ontology: you can search for predicates, filter elements on the diagram and get information about each element on the screen.

* Simplify your ontology:
  * **Graphol-lite**: get to the point with a summarized view avoiding too complex expression
  * **Floaty Mode**: simplify further obtaining an extremely easy representation of the ontology
* Search for predicates and their instances through all diagrams contained in the ontology
* Re-arrange GUI's modules floating above the diagram
* Get detailed information about selected element
* Get the OWL2 translation for selected element
* Filter elements that are not necessary for your analysis
* Multi-diagrammatic inspection that allows you to navigate through all diagrams that builds up the ontology

<p align="center">
  <img src="https://github.com/obdasystems/grapholscape/raw/master/resources/demo.gif" />
</p>

## What is Graphol?
GRAPHOL is a visual language for developing ontologies and offers a completely graphical representation of ontologies to users, in order to be easy understood by people who are not skilled in logic.\
Further information [here](https://www.obdasystems.com/it/node/107).

## Usage | [Demo](https://obdasystems.github.io/grapholscape/)
You can try it [here](https://obdasystems.github.io/grapholscape/) or just clone the repository, `build` and open `./demo/index.html`, then select an example or drop your custom .graphol file in the box on the right side.

### Embed in your project

#### HTML Environment
If you are using a HTML Environment (without a build system) you can:

- link `grapholscape.min.js` in a `<script>` tag:

  ```html
  <script src="https://obdasystems.github.io/grapholscape/dist/grapholscape.min.js" type="text/javascript" ></script>
  ```

- import Grapholscape as an ES6 module:

  ```html
  <script type="module">
    import * as Grapholscape from "./grapholscape.esm.min.js";
  </script>
  ```

#### Via NPM
If you want to nstall it via **npm**: `npm install grapholscape`.
Then you can choose what to import depending on your needs:
```js
// import everything
import * as Grapholscape from "grapholscape";

// import only core features for basic usage
import { fullGrapholscape } from "grapholscape"; // with UI widgets
// or
import { bareGrapholscape } from "grapholscape; // without UI widgets
```

### Initialisation
Basic initialisation with UI widgets.
```js
const grapholscape = await Grapholscape.fullGrapholscape(file, container)
grapholscape.showDiagram(0)
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

Once the initialization phase is done, the promise will return a `Grapholscape` object that can be used to perform actions on the tool.
In the example we saw the method `showDiagram(0)`, for the complete API please read [`doc/api.md`](doc/api.md).

Information about entities, namesapaces and diagrams are stored in `Grapholscape.ontology`. Read More in [`doc/ontology.md`](doc/ontology.md).

It is possible to pass also a json config object to define custom default settings. Read more: [default settings customization](https://github.com/obdasystems/grapholscape/wiki/Settings#default-settings-customization).

### Build it locally
Install `Node` and `npm`.

Clone the repository with
```cmd
git clone https://github.com/obdasystems/grapholscape.git
```

Install dependencies:
```cmd
npm run install
```

Build and start:
```cmd
npm run build
```
And open `doc/static/demo/index.html`.

### Build Instructions
Install `npm` and `Node.js` and run `npm install` before using `npm run`.

Run `npm run <target>` in the console. The main targets are:

- `start` : builds for development (no transpiled), watch for changes and serve demo on `http://localhost:8000`
- `build` : builds for production (minified and transpiled with babel)
- `app` : builds for development and run electron app
- `app:dist` : create electron app packages for all platforms (win32, darwin, linux)
- `deploy` : publish whole generated documentation in `doc/output` folder to `gh-pages` branch from which github page of the project is served
- `test`: run all test suites

### Release Instructions
1. Use `npm version [ver]`
    *Please review built files and try out demo and electron app before proceeding*
2. Push the release: `git push && git push --tags`
3. Deploy web version on gh-pages: `npm run deploy`
4. Publish to npm (To be defined)
5. Create a release on Github from the latest tag adding zipped electron packages produced in `./dists`

## Disclaimer
Based on [cytoscape.js](http://js.cytoscape.org).
