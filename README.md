<p style="margin:auto; max-width:250px" align="center">
  <img width="250px" src="https://github.com/obdasystems/grapholscape/raw/develop/app/assets/logo.png">
</p>

Advanced web viewer for ontologies written in GRAPHOL.[**Try me**](https://obdasystems.github.io/grapholscape/demo/)

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
  <img src="https://github.com/obdasystems/grapholscape/blob/master/docs/static/assets/img/demo.gif" />
</p>

## What is Graphol?
GRAPHOL is a visual language for developing ontologies and offers a completely graphical representation of ontologies to users, in order to be easy understood by people who are not skilled in logic.

## [Demo](https://obdasystems.github.io/grapholscape/demo/)
You can try it [here](https://obdasystems.github.io/grapholscape/demo/) or [build it locally](#build-it-locally), then select an example or drop your custom `.graphol` file in the box on the right side.

## Quick Start
For a more detailed explanation please check the [documentation](https://obdasystems.github.io/grapholscape/) and the [getting started guide](https://obdasystems.github.io/grapholscape/pages/getting-started.html).

Install it via **npm**: `npm install grapholscape`.
Basic initialisation with UI widgets.
```js
import { fullGrapholscape } from 'grapholscape'

const grapholscape = await Grapholscape.fullGrapholscape(file, container)
grapholscape.showDiagram(0)
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

Once the initialization phase is done, the promise will return a `Grapholscape` object that can be used to perform actions on the tool.
In the example we saw the method `showDiagram(0)`. **For the complete api please check [Grapholscape Class API](https://obdasystems.github.io/grapholscape/classes/core.Grapholscape.html).**

Information about **entities**, **namesapaces** and **diagrams** are stored in [Grapholscape.ontology](https://obdasystems.github.io/grapholscape/classes/core.Grapholscape.html). Read More in [Ontology](https://obdasystems.github.io/grapholscape/classes/model.Ontology.html).

It is possible to pass also a config object to define custom default settings. Read more: [configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html).

## Build it locally
Install `Node` and `npm`.

Clone the repository with
```cmd
git clone https://github.com/obdasystems/grapholscape.git
```

Install dependencies:
```cmd
npm run install
```

Build in dev/debug mode:
```cmd
npm run start
```

## Build Instructions
Install `npm` and `Node.js` and run `npm install` before using `npm run`.

Run `npm run <target>` in the console. The main targets are:

- `start` : builds for development (no transpiled), watch for changes and serve demo on `http://localhost:8000`
- `build` : builds for production (minified and transpiled with babel)
- `app` : builds for development and run electron app
- `app:dist` : create electron app packages for all platforms (win32, darwin, linux)
- `doc`: generate documentation at `docs/generated` and copy static demo inside it
- `deploy` : publish whole generated documentation in `docs/generated` folder to `gh-pages` branch from which github page of the project is served
- `test`: run all test suites

## Release Instructions
1. Use `npm version [ver]`
    *Please review built files and try out demo and electron app before proceeding*
2. Push the release: `git push && git push --tags`
3. Deploy web version on gh-pages: `npm run deploy`
4. Publish to npm (To be defined)
5. Create a release on Github from the latest tag adding zipped electron packages produced in `./dists`

## Disclaimer
Based on [cytoscape.js](http://js.cytoscape.org).
