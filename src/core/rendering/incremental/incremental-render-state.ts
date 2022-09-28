import { CollectionReturnValue, Layouts, SingularElementReturnValue, Stylesheet } from "cytoscape"
import { FloatyRenderState, Renderer } from ".."
import { Diagram, GrapholscapeTheme, GrapholTypesEnum, iFilterManager, Ontology, RendererStatesEnum } from "../../../model"
import IncrementalDiagram from "../../../model/diagrams/incremental-diagram"
import FloatyTransformer from "../floaty/floaty-transformer"
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
export default class IncrementalRendererState extends FloatyRenderState {
  readonly id = RendererStatesEnum.INCREMENTAL
  filterManager: iFilterManager
  layout: Layouts

  private previousDiagram: Diagram
  protected actualElements?: CollectionReturnValue
  protected activeClass?: SingularElementReturnValue

  private entityExpansionCallback: (selectedElement: SingularElementReturnValue) => void

  render() {
    this.overrideDiagram()
    this.renderer.mount()
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
    }
  }

  onEntityExpansion(callback: (selectedElement: SingularElementReturnValue) => void) {
    this.entityExpansionCallback = callback
  }

  handleClassExpansion(classElement: SingularElementReturnValue) {
    this.actualElements = this.renderer.cy.elements()

    if (!this.activeClass || this.activeClass.data().iri !== classElement.data().iri) {
      this.activeClass = classElement
      this.entityExpansionCallback(classElement)
      this.runLayout()
    }
  }


  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return incrementalStyle(theme)
  }

  private overrideDiagram() {
    if (this.renderer.diagram?.id !== this.incrementalDiagram.id) {
      this.previousDiagram = this.renderer.diagram
    }

    this.renderer.stopRendering()
    
    this.renderer.diagram = this.incrementalDiagram
    this.renderer.cy = this.diagramRepresentation.cy
  }

  createNewDiagram() {
    this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram()
    this.overrideDiagram()
    this.diagramRepresentation.cy.on('dblclick', `node[type = "${GrapholTypesEnum.CLASS}"]`, (evt) => this.handleClassExpansion(evt.target))
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