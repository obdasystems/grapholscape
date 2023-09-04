import { EdgeSingular, Stylesheet } from "cytoscape"
import { Diagram, Filter, GrapholscapeTheme, iFilterManager, Ontology, RendererStatesEnum, TypesEnum } from "../../../model"
import IncrementalDiagram from "../../../model/diagrams/incremental-diagram"
import FloatyRendererState from "../floaty/floaty-renderer-state"
import FloatyTransformer from "../floaty/floaty-transformer"
import Renderer from "../renderer"
import computeHierarchies from "./compute-hierarchies"
import IncrementalFilterManager from "./filter-manager"
import incrementalStyle from "./incremental-style"

/**
 * The incremental renderer state is a kind of floaty renderer state in which
 * ontology's diagrams are used only to compute what to show.
 * There is only a single empty diagram and any render() call just render the same diagram
 * no matter what was the input diagram.
 * 
 * This renderer state is logic agnostic, meaning that it does not control what to show and when.
 * You can decide what to show/hide outside, based on lifecycle and/or other custom developed widgets.
 */
export default class IncrementalRendererState extends FloatyRendererState {
  readonly id = RendererStatesEnum.INCREMENTAL
  filterManager: iFilterManager = new IncrementalFilterManager()

  private previousDiagram: Diagram

  render() {
    if (this.renderer.diagram && this.renderer.diagram?.id !== IncrementalDiagram.ID) {
      this.previousDiagram = this.renderer.diagram
    }

    if (!this.renderer.diagram) return

    const incrementalRepresentation = this.renderer.diagram.representations.get(this.id)
    if (!incrementalRepresentation) return

    this.renderer.cy = incrementalRepresentation.cy
    this.renderer.mount()

    if (this.renderer.diagram.lastViewportState) {
      this.renderer.cy?.viewport(this.renderer.diagram.lastViewportState)
    }

    if (!incrementalRepresentation.hasEverBeenRendered) {
      if (this.popperContainer) {
        this.renderer.cy?.container()?.appendChild(this.popperContainer)
      }
    }

    incrementalRepresentation.hasEverBeenRendered = true
  }

  runLayout() {
    super.runLayout()
    if (this.isLayoutInfinite) {
      this.unFreezeGraph()
    } else {
      this.layout.one('layoutstop', (e) => {
        if (this.renderer.diagram?.representations.get(this.id)?.grapholElements.size === 1)
          this.renderer.fit()

        if (e.layout === this._layout)
          this.unFreezeGraph()
      })
    }
  }

  runCustomLayout(cyLayoutOptions: any) {
    Object.assign(this.floatyLayoutOptions, cyLayoutOptions)
    this.runLayout()
    this.floatyLayoutOptions = this.defaultLayoutOptions
  }

  /** lock all nodes */
  freezeGraph() {
    if (!this.layoutRunning)
      this.renderer.cy?.nodes().lock()
  }

  /** unlock all nodes that are not pinned (pinned can be unlocked only with unpin) */
  unFreezeGraph() {
    this.renderer.cy?.$("[!pinned]:locked").unlock()
  }

  stopRendering(): void {
    super.stopRendering()
    this.renderer.diagram = this.previousDiagram
  }

  transformOntology(ontology: Ontology): void {
    // Perform floaty transformation if it has not been done yet
    if (!ontology.diagrams[0]?.representations.get(RendererStatesEnum.FLOATY)) {
      ontology.diagrams.forEach(diagram => {
        const floatyTransformer = new FloatyTransformer()
        diagram.representations.set(RendererStatesEnum.FLOATY, floatyTransformer.transform(diagram))
      })

      computeHierarchies(ontology)
    }
  }

  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return incrementalStyle(theme)
  }

  reset() {
    if (this.renderer.diagram?.id) {
      this.popperContainers.get(this.renderer.diagram.id)?.childNodes.forEach(c => c.remove())
    }
    this.render()
  }

  filter(elementId: string, filter: Filter) {
    if (this.renderer.cy) {
      const element = this.renderer.cy.$id(elementId)

      if (!element.scratch('filterTags')) {
        element.scratch('filterTags', new Set<string>())
      }

      const elemFilterTags = element.scratch('filterTags')
      elemFilterTags.add(filter.filterTag)
      element.addClass('filtered')

      // ARCHI IN USCITA
      element.outgoers('edge').forEach(e => {
        if (e.data('type') === TypesEnum.INPUT) {
          this.filter(e.target().id(), filter)
        }
      })

      // ARCHI IN ENTRATA
      element.incomers('edge').forEach(e => {
        let neighbour = e.source()
        switch (e.data().type) {
          case TypesEnum.UNION:
          case TypesEnum.DISJOINT_UNION:
          case TypesEnum.COMPLETE_UNION:
          case TypesEnum.COMPLETE_DISJOINT_UNION:
            this.filter(neighbour.id(), filter)
        }
      })
    }
  }

  unfilter(elementId: string, filter: Filter) {
    if (!this.renderer.cy)
      return

    const element = this.renderer.cy.$id(elementId)

    let elemFilterTags = element.scratch('filterTags') as Set<string>
    if (element.hasClass('filtered') && elemFilterTags?.has(filter.filterTag)) {
      elemFilterTags.delete(filter.filterTag)

      if (elemFilterTags.size === 0) {
        element.removeClass('filtered')
      }
    }

    this.renderer.cy.nodes().forEach(elem => {
      elemFilterTags = elem.scratch('filterTags') as Set<string>
      if (elemFilterTags?.has(filter.filterTag)) {
        elemFilterTags.delete(filter.filterTag)
        if (elemFilterTags.size === 0) {
          elem.removeClass('filtered')
        }
      }
    })
  }

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
    }

    // this.floatyLayoutOptions = this.defaultLayoutOptions
    // this.floatyLayoutOptions.fit = false
    // this.floatyLayoutOptions.maxSimulationTime = 1000
    // this.floatyLayoutOptions.edgeLength = function (edge: EdgeSingular) {
    //   let crowdnessFactor =
    //     edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
    //     edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length

    //   crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 2 : 0
    //   const nameLength = edge.data('displayedName')?.length * 5 || 0
    //   return 140 + crowdnessFactor + nameLength
    // }
    // this.floatyLayoutOptions.avoidOverlap = true
    // this.floatyLayoutOptions.randomize = true
    // this.floatyLayoutOptions.centerGraph = true

    // this.floatyLayoutOptions.boundingBox = {
    //   x1: 0,
    //   y1: 0,
    //   w: 500,
    //   h: 500
    // }

    // this.floatyLayoutOptions.flow = { axis: 'x', minSeparation: 100 }
  }

  get renderer(): Renderer {
    return super.renderer
  }

  protected get defaultLayoutOptions() {
    return {
      name: 'cola',
      avoidOverlap: true,
      edgeLength: function (edge: EdgeSingular) {
        let crowdnessFactor =
          edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
          edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length

        crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 2 : 0
        const nameLength = edge.data('displayedName')?.length * 5 || 0
        return 140 + crowdnessFactor + nameLength
      },
      fit: false,
      maxSimulationTime: 1000,
      infinite: false,
      handleDisconnected: true, // if true, avoids disconnected components from overlapping
      centerGraph: false,
    }
  }
}