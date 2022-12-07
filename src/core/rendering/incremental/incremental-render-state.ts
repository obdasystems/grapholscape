import { NodeSingular, SingularElementReturnValue, Stylesheet } from "cytoscape"
import FloatyRendererState from "../floaty/floaty-renderer-state"
import { floatyOptions } from "../../../config"
import { Diagram, DiagramRepresentation, GrapholscapeTheme, GrapholTypesEnum, iFilterManager, Ontology, RendererStatesEnum } from "../../../model"
import IncrementalDiagram from "../../../model/diagrams/incremental-diagram"
import FloatyTransformer from "../floaty/floaty-transformer"
import computeHierarchies from "./compute-hierarchies"
import incrementalStyle from "./incremental-style"
import Renderer from "../renderer"
import IncrementalFilterManager from "./filter-manager"

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
  protected activeClass?: SingularElementReturnValue

  private entityExpansionCallback: (selectedElement: SingularElementReturnValue) => void
  onContextClickCallback: (target: any) => void

  render() {
    this.overrideDiagram()

    if (this.popperContainer) {
      this.renderer.cy?.container()?.appendChild(this.popperContainer)
    }
  }

  stopRendering(): void {
    super.stopRendering()
    this.renderer.diagram = this.previousDiagram
  }

  transformOntology(ontology: Ontology): void {
    // Perform floaty transformation if it has not been done yet
    if (!ontology.diagrams[0].representations.get(RendererStatesEnum.FLOATY)) {
      ontology.diagrams.forEach(diagram => {
        const floatyTransformer = new FloatyTransformer()
        diagram.representations.set(RendererStatesEnum.FLOATY, floatyTransformer.transform(diagram))
      })

      computeHierarchies(ontology)
    }
  }

  onEntityExpansion(callback: (selectedElement: SingularElementReturnValue) => void) {
    this.entityExpansionCallback = callback
  }

  handleClassExpansion(classElement: SingularElementReturnValue) {
    if (!this.activeClass || this.activeClass.data().iri !== classElement.data().iri) {
      this.activeClass = classElement
      this.pinNode(classElement)
      this.entityExpansionCallback(classElement)
      this.floatyLayoutOptions.fit = false
      this.runLayout()
    }
  }


  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return incrementalStyle(theme)
  }

  protected overrideDiagram() {
    if (this.renderer.diagram && this.renderer.diagram?.id !== this.incrementalDiagram.id) {
      this.previousDiagram = this.renderer.diagram
    }

    this.renderer.stopRendering()

    this.renderer.diagram = this.incrementalDiagram
    this.renderer.cy = this.diagramRepresentation?.cy
    this.renderer.mount()
  }

  createNewDiagram() {
    this.unpinAll()
    if (!this.incrementalDiagram)
      this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram()
    else {
      this.incrementalDiagram.representation?.cy.destroy()
      this.incrementalDiagram.representations.set(this.id, new DiagramRepresentation(floatyOptions))
    }
    this.activeClass = undefined
    this.floatyLayoutOptions.fit = true
    this.overrideDiagram()
    this.diagramRepresentation?.cy.on('dblclick', `node[type = "${GrapholTypesEnum.CLASS}"]`, (evt) => this.handleClassExpansion(evt.target))

    this.diagramRepresentation?.cy.on('cxttap', `node`, evt => {
      this.onContextClickCallback(evt.target)
    })

    if (this.renderer.diagram?.id)
      this.popperContainers.set(this.renderer.diagram?.id, document.createElement('div'))
    this.setDragAndPinEventHandlers()
    this.render()
  }

  onContextClick(callback: (target: NodeSingular) => void) {
    this.onContextClickCallback = callback
  }

  get diagramRepresentation() {
    return this.incrementalDiagram.representations.get(this.id)
  }

  get incrementalDiagram(): IncrementalDiagram { return this.renderer.renderStateData[this.id].diagram }

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
    }

    if (!newRenderer.renderStateData[this.id].diagram)
      this.createNewDiagram()
  }

  get renderer(): Renderer {
    return super.renderer
  }

}