import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'
import klay from 'cytoscape-klay'
import popper from 'cytoscape-popper'
import { GrapholscapeConfig, loadConfig, ThemeConfig } from './config'
import { Core, Grapholscape, OntologyColorManager } from './core'
import setGraphEventHandlers from './core/set-graph-event-handlers'
import { IncrementalController } from './incremental'
import { moveUpLeft } from './incremental/ui'
import { ColoursNames, DefaultThemes, GrapholscapeTheme, Ontology, RendererStatesEnum } from './model'
import { RDFGraph, RDFGraphModelTypeEnum } from './model/rdf-graph/swagger'
import GrapholParser from './parsing/parser'
import parseRDFGraph, * as RDFGraphParser from './parsing/rdf-graph-parser'
import * as UI from './ui'


cytoscape.use(popper)
cytoscape.use(cola)
cytoscape.warnings(process.env.NODE_ENV !== 'production')
cytoscape.use(edgehandles)
cytoscape.use(klay)

export * from './config'
export * from './core'
export { default as setGraphEventHandlers } from './core/set-graph-event-handlers'
export * from './exporter'
/** @internal */
export * from './incremental'
export * from './model'
/** @internal */
export { default as rdfgraphSerializer } from './rdfgraph-serializer'
export * as ui from './ui'
export * as util from './util'
/** @internal */
export { parseRDFGraph, RDFGraphParser }
export { default as incrementalGraphStyle } from './core/rendering/incremental/incremental-style'
export { default as floatyGraphStyle } from './core/rendering/floaty/floaty-style'
export { default as liteGraphStyle } from './core/rendering/lite/lite-style'
export { default as grapholGraphStyle } from './core/rendering/graphol/graphol-style'

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
 * @see [Getting started](../pages/getting-started.html)
 * @see [Configuration](../pages/configuration.html)
 */
export async function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)
  if (grapholscape) {
    UI.initUI(grapholscape)

    if (config?.initialRendererSelection === false) {
      (grapholscape.widgets.get(UI.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any)?.hide()
    }

    if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && !config?.useCustomIncrementalController) {
      grapholscape.incremental = new IncrementalController(grapholscape)
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
 * @see [Getting started](../pages/getting-started.html)
 * @see [Configuration](../pages/configuration.html)
 */
export async function bareGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)

  // if (grapholscape?.renderers.includes(RendererStatesEnum.INCREMENTAL)) {
  //   initIncremental(grapholscape)
  // }
  return grapholscape
}

export async function incrementalGrapholscape(ontology: string | File | RDFGraph, container: HTMLElement, rdfGraphToResume?: RDFGraph, config?: GrapholscapeConfig) {
  let _config: GrapholscapeConfig = {}
  let grapholscape: Grapholscape | undefined

  if (rdfGraphToResume?.config) {
    _config = RDFGraphParser.getConfig(rdfGraphToResume)
  } else {
    if (config) {
      _config = Object.assign(config, loadConfig())
    }
  }
  _config.renderers = [RendererStatesEnum.INCREMENTAL]
  _config.initialRendererSelection = false

  if ((ontology as RDFGraph).metadata) {
    grapholscape = new Core(parseRDFGraph((ontology as RDFGraph)), container, _config)
  } else {
    grapholscape = await getGrapholscape((ontology as string | File), container, _config)
  }

  if (!grapholscape)
    return

  UI.initUI(grapholscape)
  if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && !_config.useCustomIncrementalController) {
    grapholscape.incremental = new IncrementalController(grapholscape)
  }
  if (!rdfGraphToResume) {
    return grapholscape
  }
  initFromResume(grapholscape, rdfGraphToResume, false)

  return grapholscape
}

/** @internal */
export function resume(rdfGraph: RDFGraph, container: HTMLElement, config?: GrapholscapeConfig) {
  const loadingSpinner = showLoadingSpinner(container, { selectedTheme: rdfGraph.config?.selectedTheme })

  const savedConfig = loadConfig()
  if (config) {
    // copy savedConfig over config
    config = Object.assign(config, savedConfig)
  } else {
    config = RDFGraphParser.getConfig(rdfGraph)
  }
  const grapholscape = new Core(parseRDFGraph(rdfGraph), container, config)
  initFromResume(grapholscape, rdfGraph, true, config.useCustomIncrementalController)

  // if (mastroConnection)
  //   grapholscape.incremental?.setMastroConnection(mastroConnection)

  loadingSpinner.remove()
  return grapholscape
}

/** @internal */
export function initFromResume(grapholscape: Grapholscape, rdfGraph: RDFGraph, forceInit = true, useCustomIncrementalController?: boolean) {
  if (forceInit) {
    UI.initUI(grapholscape)
    if (grapholscape.renderers.includes(RendererStatesEnum.INCREMENTAL) && !useCustomIncrementalController) {
      grapholscape.incremental = new IncrementalController(grapholscape)
    }
  }

  // Stop layout, use positions from rdfGraph, for floaty/incremental
  if (grapholscape.renderer.renderState) {
    grapholscape.renderer.renderState.layoutRunning = false
    grapholscape.renderer.renderState.stopLayout()
  }

  if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY) {
    if (rdfGraph.selectedDiagramId !== undefined) {
      const diagram = grapholscape.ontology.getDiagram(rdfGraph.selectedDiagramId)
      if (diagram) {
        /**
         * showDiagram won't set event handlers on this diagram cause it results already
         * been rendered once, but in previous session, not yet in the current one.
         * Force setting them here.
         */
        setGraphEventHandlers(diagram, grapholscape.lifecycle, grapholscape.ontology)
        const floatyRepr = diagram.representations.get(RendererStatesEnum.FLOATY)
        if (floatyRepr)
          floatyRepr.hasEverBeenRendered = false
        grapholscape.showDiagram(diagram.id, floatyRepr?.lastViewportState)
      }
    }
  } else if (grapholscape.incremental) {
    // grapholscape.incremental.classInstanceEntities = RDFGraphParser.getClassInstances(rdfGraph, grapholscape.ontology.namespaces)

    const allEntities = new Map(
      Array.from(grapholscape.ontology.entities)
      .concat(Array.from(RDFGraphParser.getClassInstances(rdfGraph, grapholscape.ontology.namespaces)))
    )

    const diagramRepr = RDFGraphParser.getDiagrams(
      rdfGraph,
      RendererStatesEnum.INCREMENTAL,
      allEntities,
      grapholscape.ontology.namespaces
    )[0].representations.get(RendererStatesEnum.INCREMENTAL)
    if (diagramRepr) {
      // grapholscape.incremental.diagram = new IncrementalDiagram()
      if (diagramRepr.lastViewportState) {
        grapholscape.incremental.diagram.lastViewportState = diagramRepr.lastViewportState
      }

      grapholscape.incremental.diagram.representations.set(
        RendererStatesEnum.INCREMENTAL,
        diagramRepr
      )
      diagramRepr.hasEverBeenRendered = false

      // Diagram (representation) has been changed, set event handlers again
      grapholscape.incremental.setIncrementalEventHandlers()
      // Diagram representation has been changed, set nodes button event handlers
      // NodeButtonsFactory(grapholscape.incremental)

      if (diagramRepr.grapholElements.size > 0) {
        const initialMenu = grapholscape.widgets.get(UI.WidgetEnum.INCREMENTAL_INITIAL_MENU)
        if (initialMenu)
          moveUpLeft(initialMenu)
      }

      new OntologyColorManager(grapholscape.ontology, diagramRepr).colorEntities(allEntities)

      grapholscape.incremental.showDiagram(rdfGraph.diagrams[0].lastViewportState)
    }
  }
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
        const gscape = new Core(ontology, container, config)
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
        theme = typeof (themeConfig) === 'string' ? DefaultThemes[themeConfig] : themeConfig
      }
    }
  }

  if (!theme) {
    theme = DefaultThemes.grapholscape
  }

  spinner.setColor(theme?.getColour(ColoursNames.accent) || '#000')
  container.appendChild(spinner)
  return spinner
}