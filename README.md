<p align="center">
  <img width="50%" src="https://github.com/obdasystems/grapholscape/raw/develop/app/assets/logo.png">
</p>

# 
Advanced web viewer for ontologies written in [GRAPHOL](http://www.dis.uniroma1.it/~graphol/).

## Features
Grapholscape provides advanced and interactive tools to visually inspect all components of the ontology: you can search for predicates, filter elements on the diagram and get information about each element on the screen.
* Search for predicates and their instances through all diagrams contained in the ontology
* Re-arrange GUI's modules floating above the diagram
* Get detailed information about selected element
* Get the OWL2 translation for selected element
* Filter elements that are not necessary for your analysis
* Multi-diagrammatic inspection that allows you to navigate through all diagrams that builds up the ontology

<img src="https://obdasystems.github.io/grapholscape/resources/demo.gif" />

## What is Graphol?
GRAPHOL is a visual language for developing ontologies and offers a completely graphical representation of ontologies to users, in order to be easy understood by people who are not skilled in logic.\
Further information [here](http://www.dis.uniroma1.it/~graphol/).

## Usage | [Demo](https://obdasystems.github.io/grapholscape/)
You can try it [here](https://obdasystems.github.io/grapholscape/) or just clone the repository `build` and open the index.html, then select an example or drop your custom .graphol file in the box on the right side.
### Try it locally
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

### Embed in your project
Import GrapholScape
```html
<script src="https://obdasystems.github.io/grapholscape/dist/grapholscape.min.js" type="text/javascript" ></script>
```

Create an instance of grapholscape providing a `.graphol` ontology file. Then `init` the visualization in an **empty** container
```js
const grapholscape = new Grapholscape(file)
grapholscape.init(container).then( () => {
  grapholscape.showDiagram(0);
});
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

### Build Instructions
Install `npm` and `Node.js` and run `npm install` before using `npm run`.

Run `npm run <target>` in the console. The main targets are:

- `build` : do both builds (unminified & minified) for both web and electron app
- `start` : serve demo on `http://localhost:8000/demo` and run electron app from builds
- `watch` : serve demo on `http://localhost:8000/demo` and watch for changes for automatic unminified rebuilding (debug on demo)
- `watch:build` : do only unminified build and watch for changes
- `app` : run electron app
- `app:dist` : create electron app packages for all platforms (win32, darwin, linux)
- `dist` : update distribution js for npm etc.


## Disclaimer
Based on [cytoscape.js](http://js.cytoscape.org).
