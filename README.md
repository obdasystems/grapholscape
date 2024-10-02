<h1 align="center">
  <a href="https://obdasystems.github.io/grapholscape/">
    <img height="150" src="media/img/icon.png?raw=true" alt="Grapholscape logo" title="Grapholscape" />
  </a>
  <br>
  Grapholscape
  </br>
</h1>

<h4 align="center">
  Advanced web viewer for ontologies written in GRAPHOL.
</h4>

<p align="center">
  <a href="https://obdasystems.github.io/grapholscape/public/"><strong>Web App</strong></a> •
  <a href="#features">Features</a> •
  <a href="#what-is-graphol">What is Graphol?</a> •
  <a href="https://obdasystems.github.io/grapholscape/"><strong>Documentation</strong></a> •
  <a href="#quick-start"><strong>Quick Start</strong></a> •
  <a href="#credits">Credits</a>
</p>

<h3 align="center" style="position: relative">
<pre style="margin:0"><code><img style="position: relative; top: 2px; float: left;" height="21px" src="https://avatars.githubusercontent.com/u/6078720?s=200&v=4" />npm install grapholscape</code></pre>
</h3>

<a align="center" href="https://obdasystems.github.io/grapholscape/public/">
  <img src="media/img/demo.gif?raw=true" />
</a>

## Features
Grapholscape provides advanced and interactive tools to visually inspect all components of the ontology: you can search for predicates, filter elements on the diagram and get information about each element on the screen.

* `new` **Path rendering mode**: explore your custom **path** in the ontology graph, start from a single class and explore **incrementally** step by step.
* Simplify your ontology:
  * **Graphol-lite**: summarized view avoiding too complex expressions
  * **Floaty Mode**: simplify further obtaining an extremely easy representation of the ontology
* Search for entities and their instances through all diagrams contained in the ontology
* Get detailed information about selected element
* Get the OWL2 translation for selected element
* Filter elements that are not necessary for your analysis
* Multi-diagrammatic inspection that allows you to navigate through all diagrams that builds up the ontology

## What is Graphol?
GRAPHOL is a visual language for developing ontologies and offers a completely graphical representation of ontologies to users, in order to be easy understood by people who are not skilled in logic. [Read more](https://github.com/obdasystems/eddy/wiki/Introduction#graphol)\
For building ontologies in Graphol please check our visual editor: [Eddy](https://github.com/obdasystems/eddy).

## [WebApp](https://obdasystems.github.io/grapholscape/public/)
You can try it [here](https://obdasystems.github.io/grapholscape/public/) or [build it locally](#build-it-locally), then select an example or drop your custom `.graphol` file in the box on the right side.

## Quick Start
For a more detailed explanation please check the [documentation](https://obdasystems.github.io/grapholscape/) and the [getting started guide](https://obdasystems.github.io/grapholscape/stable/pages/getting-started.html).

### Install it via **npm**: 
```cmd
npm install grapholscape
```


### Basic initialisation with UI widgets.
```js
import { fullGrapholscape } from 'grapholscape'

const grapholscape = await Grapholscape.fullGrapholscape(file, container)
grapholscape.showDiagram(0)
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

Once the initialization phase is done, the promise will return a `Grapholscape` object that can be used to perform actions on the tool.
In the example we saw the method `showDiagram(0)`. **For the complete api please check [Grapholscape Class API](https://obdasystems.github.io/grapholscape/stable/classes/core.Grapholscape.html).**

Information about **entities**, **namesapaces** and **diagrams** are stored in [Grapholscape.ontology](https://obdasystems.github.io/grapholscape/stable/classes/core.Grapholscape.html). Read More in [Ontology](https://obdasystems.github.io/grapholscape/stable/classes/model.Ontology.html).

It is possible to pass also a config object to define custom default settings. Read more: [configuration](https://obdasystems.github.io/grapholscape/stable/pages/configuration.html).

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
- `doc`: generate documentation at `docs/generated` and copy static demo inside it
- `deploy` : publish whole generated documentation in `docs/generated` folder to `gh-pages` branch from which the github page of the project is served
- `test`: run all test suites
- `clean`: clean `dist` and `temp` folder

## Release Instructions
1. Use `npm version [ver]`
    *Please review built files and try out demo*
2. Push the release: `git push && git push --tags`
3. Publish to npm: `npm publish`
4. Create a release on Github from the latest tag
5. Run `PUBLISH_DOC` github action to deploy the updated documentation

## Release a snapshot test version
1. Use `npm run snapshot`
2. Publish using *snapshot* tag: `npm publish --tag snapshot`
> To install latest snapshot version use `npm i grapholscape@snapshot`

## Credits
Based on [cytoscape.js](http://js.cytoscape.org).
