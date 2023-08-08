import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import klay from 'cytoscape-klay'
import edgehandles from 'cytoscape-edgehandles'
import popper from 'cytoscape-popper'
import undoredo from 'cytoscape-undo-redo'
import { GrapholscapeConfig, loadConfig, ThemeConfig } from './config'
import Grapholscape from './core'
import setGraphEventHandlers from './core/set-graph-event-handlers'
import { initIncremental } from './incremental'
import { RequestOptions } from './incremental/api/model'
import { ColoursNames, DefaultThemes, GrapholscapeTheme, Ontology, RendererStatesEnum } from './model'
import { RDFGraph, RDFGraphModelTypeEnum } from './model/rdf-graph/swagger'
import GrapholParser from './parsing/parser'
import parseRDFGraph, { getConfig, getEntities, getOntology } from './parsing/rdf-graph-parser'
import * as UI from './ui'

cytoscape.use(popper)
cytoscape.use(cola)
cytoscape.warnings(process.env.NODE_ENV !== 'production')
cytoscape.use(edgehandles)
cytoscape.use(undoredo)
cytoscape.use(klay)

export * from './config'
export * from './core'
export { default as setGraphEventHandlers } from './core/set-graph-event-handlers'
export * from './exporter'
/** @internal */
export * from './incremental'
export * from './model'
export * as ui from './ui'
export * as util from './util'

/**
 * Create a full instance of Grapholscape with diagrams and widgets
 * 
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 * 
 * @param file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
export async function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)
  if (grapholscape) {
    UI.initUI(grapholscape)

    if (config?.initialRendererSelection === false || grapholscape.renderState) {
      (grapholscape.widgets.get(UI.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).hide()
    }

    if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL)) {
      initIncremental(grapholscape)
    }
  }
  return grapholscape
}

/**
 * Create a bare instance of Grapholscape, only diagrams, no widgets
 * 
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 * 
 * @param file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
export async function bareGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)

  if (grapholscape?.renderers.includes(RendererStatesEnum.INCREMENTAL)) {
    initIncremental(grapholscape)
  }
  return grapholscape
}

export function loadRDFGraph(rdfGraph: RDFGraph, container: HTMLElement, mastroConnection?: RequestOptions) {
  const loadingSpinner = showLoadingSpinner(container, { selectedTheme: rdfGraph.config?.selectedTheme })
  let grapholscape: Grapholscape | undefined

  if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
    grapholscape = parseRDFGraph(rdfGraph, container)
  } else {
    grapholscape = new Grapholscape(getOntology(rdfGraph), container, getConfig(rdfGraph))
    grapholscape.ontology.entities = getEntities(rdfGraph, grapholscape.ontology.namespaces)
  }
  
  if (grapholscape) {
    UI.initUI(grapholscape)

    if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL)) {
      initIncremental(grapholscape)
    }

    if (grapholscape.renderState) {
      (grapholscape.widgets.get(UI.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).hide()
    }

    // Stop layout, use positions from rdfGraph, for floaty/incremental
    if (grapholscape.renderer.renderState) {
      grapholscape.renderer.renderState.layoutRunning = false
      grapholscape.renderer.renderState.stopLayout()
    }

    if (rdfGraph.selectedDiagramId !== undefined && rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
      const diagram = grapholscape.ontology.getDiagram(rdfGraph.selectedDiagramId)
      if (diagram) {
        /**
         * showDiagram won't set event handlers on this diagram cause it results already
         * been rendered once, but in previous session, not yet in the current one.
         * Force setting them here.
         */
        setGraphEventHandlers(diagram, grapholscape.lifecycle, grapholscape.ontology)
        grapholscape.showDiagram(rdfGraph.selectedDiagramId)
      }
    } else {
      if (grapholscape.incremental) {
        if (mastroConnection)
        grapholscape.incremental.setMastroConnection(mastroConnection)
        grapholscape.incremental.showDiagram()
        grapholscape.incremental.addRDFGraph(rdfGraph)
      }
      
    }
  }

  loadingSpinner.remove()
  return grapholscape
}

async function getGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const savedConfig = loadConfig()
  // copy savedConfig over config
  config = Object.assign(config || {}, savedConfig)
  return new Promise<Grapholscape>(async (resolve, reject) => {
    let ontology: Ontology | undefined
    let timeout: NodeJS.Timeout

    const loadingSpinner = showLoadingSpinner(container, config)

    if (typeof (file) === 'object') {
      let reader = new FileReader()

      reader.onloadend = async () => {
        try {
          ontology = await getResult(reader.result)
          init()
        } catch (error) { reject(error) }
      }

      reader.readAsText(file)

      setTimeout(() => {
        reject('Error: timeout expired')
      }, 10000)

    } else if (typeof (file) === 'string') {
      ontology = await getResult(file)
      init()
    } else {
      reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized')
    }

    function init() {
      try {
        if (!ontology) {
          throw new Error("Error in graphol file")
        }
        clearTimeout(timeout)
        loadingSpinner.remove()
        const gscape = new Grapholscape(ontology, container, config)
        resolve(gscape)
      } catch (e) { console.error(e) }
    }
  })

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}

function showLoadingSpinner(container: HTMLElement, config?: GrapholscapeConfig) {
  const spinner = new UI.ContentSpinner()
  spinner.style.position = 'absolute'
  spinner.style.zIndex = '10'
  let themeConfig: ThemeConfig | undefined
  let theme: GrapholscapeTheme | undefined
  if (config?.selectedTheme) {
    if (DefaultThemes[config.selectedTheme] !== undefined) {
      theme = DefaultThemes[config.selectedTheme]
    } else if (config?.themes) {
      themeConfig = config.themes.find(theme => theme === config?.selectedTheme || (theme as GrapholscapeTheme).id === config?.selectedTheme)
      if (themeConfig) {
        theme = typeof(themeConfig) === 'string' ? DefaultThemes[themeConfig] : themeConfig
      }
    }
  }

  if (!theme) {
    theme = DefaultThemes.grapholscape
  }

  spinner.setColor(theme.getColour(ColoursNames.accent) || '#000')
  container.appendChild(spinner)
  return spinner
}