<p align="center">
  <img width="50%" src="https://github.com/obdasystems/grapholscape/raw/develop/app/assets/logo.png">
</p>

#
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

<img src="https://github.com/obdasystems/grapholscape/raw/master/resources/demo.gif" />

## What is Graphol?
GRAPHOL is a visual language for developing ontologies and offers a completely graphical representation of ontologies to users, in order to be easy understood by people who are not skilled in logic.\
Further information [here](http://www.dis.uniroma1.it/~graphol/).

## Usage | [Demo](https://obdasystems.github.io/grapholscape/)
You can try it [here](https://obdasystems.github.io/grapholscape/) or just clone the repository `build` and open `./demo/index.html`, then select an example or drop your custom .graphol file in the box on the right side.

### Embed in your project
Import GrapholScape
```html
<script src="https://obdasystems.github.io/grapholscape/dist/grapholscape.min.js" type="text/javascript" ></script>
```

Create an instance of grapholscape providing a `.graphol` ontology file and an empty container.
```js
const grapholscape = new Grapholscape(file, container)
grapholscape.then( gscape_controller => {
  gscape_controller.showDiagram(0)
})
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

Once the initialization phase is done, `gscape_controller` will be returned and can be used to perform actions on the tool.
In the example we saw the method `showDiagram(0)`, for the complete API please read [`doc/api.md`](doc/api.md).

Information about entities, namesapaces and diagrams are stored in `gscape_controller.ontology`. Read More in [`doc/ontology.md`](doc/ontology.md).

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
npm run start
```

This will launch the electron app and serve a web demo on `http://localhost:8000/demo`.

### Build Instructions
Install `npm` and `Node.js` and run `npm install` before using `npm run`.

Run `npm run <target>` in the console. The main targets are:

- `start` : builds for development (no transpiled), watch for changes and serve demo on `http://localhost:8000`
- `build` : builds for production (minified and transpiled with babel)
- `app` : build for development and run electron app
- `app:dist` : create electron app packages for all platforms (win32, darwin, linux)
- `dist` : builds for production and package electron app for all platforms
- `deploy` : publish whole `demo` folder to gh-pages
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
