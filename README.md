<p align="center">
  <img width="50%" src="https://github.com/obdasystems/grapholscape/raw/develop/app/assets/logo.png">
</p>

# 
Advanced web viewer for ontologies written in [GRAPHOL](http://www.obdasystems.com/it/node/107). [**Try me**](https://obdasystems.github.io/grapholscape/)

## Features
Grapholscape provides advanced and interactive tools to visually inspect all components of the ontology: you can search for predicates, filter elements on the diagram and get information about each element on the screen.
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

Create an instance of grapholscape providing a `.graphol` ontology file. Then `init` the visualization in an **empty** container
```js
const grapholscape = new Grapholscape(file)
grapholscape.init(container).then( () => {
  grapholscape.showDiagram(0)
})
```
> **Note** : `file` can be an object of the [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) or a `String` representing the `.graphol` file to be displayed.

#### Disabling widgets at initialisation
It is possible to pass a json config object to the init function disabling one of the following widgets:
- Owl Translator : `owl_translator`
- Graphol-lite Mode Button : `lite_mode`
- Entity Details : `details`
- Ontology Explorer : `explorer`
- Filters button : `filters`

**example**: Grapholscape without lite-mode and owl translator:
```js
const config = {
  "owl_translator" : false,
  "lite_mode" : false,
}
const grapholscape = new Grapholscape(file)
grapholscape.init(container, config).then( () => {
  grapholscape.showDiagram(0)
})
```

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

- `build` : do both builds (unminified & minified) for both web and electron app (transpiled with babel)
- `start` : serve demo on `http://localhost:8000/demo` and run electron app from builds
- `watch` : serve demo on `http://localhost:8000/demo` and watch for changes for automatic unminified rebuilding (debug on demo)
- `watch:build` : do only unminified untranspiled build and watch for changes
- `app` : run electron app
- `app:dist` : create electron app packages for all platforms (win32, darwin, linux)
- `dist` : update distribution js for npm etc.
- `deploy` : copy `./build/grapholscape.min.js` to demo folder, publish it to gh-pages and remove it so demo in dev mode keep on using `./build/grapholscape.js`
- `release` : Do builds in production, distribute builds and package electron app for all platforms

### Release Instructions
1. Update `VERSION` environment variable, e.g. `export VERSION=1.1.1` (unix) `set VERSION=1.1.1` (windows)
2. Test (To be defined)
3. Prepare all artifacts for a release: `npm run release`\
    *Please review built files and try out demo and electron app before proceeding*
4. Commit release to git: `git add . && git commit -m "Build $VERSION"`
5. Update package version: `npm version $VERSION`
6. Push the release: `git push && git push --tags`
7. Deploy web version on gh-pages: `npm run deploy`
8. Publish to npm (To be defined)
9. Create a release on Github from the latest tag adding zipped electron packages produced in `./dists`

> **Note** : On windows replace `$VERSION` with `%VERSION%`.
## Disclaimer
Based on [cytoscape.js](http://js.cytoscape.org).
