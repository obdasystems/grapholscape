import Renderer from "../../core/rendering"
import Diagram from '../diagrams/diagram'
import Filter from './filter'
import { GrapholTypesEnum } from "../graphol-elems/node-enums"
import FilterManager from "./i-filter-manager"

export enum RenderStatesEnum {
  GRAPHOL = 'graphol',
  GRAPHOL_LITE = 'lite',
  FLOATY = 'floaty'
}

export default interface RenderState {
  id: RenderStatesEnum
  renderer: Renderer
  filterManager: FilterManager
  cyConfig: cytoscape.CytoscapeOptions
  render(): void
  filter(elementId: string, filter: Filter): void
  unfilter(elementId: string, filter: Filter): void
  layoutRun(): void
  layoutStop(): void
}

export abstract class BaseRenderer implements RenderState {
  protected _renderer: Renderer;
  abstract id: RenderStatesEnum
  abstract filterManager: FilterManager;
  abstract cyConfig: cytoscape.CytoscapeOptions;
  abstract render(): void;
  abstract layoutRun(): void;
  abstract layoutStop(): void;

  constructor(renderer?: Renderer) {
    if (renderer) this.renderer = renderer
  }

  set renderer(newRenderer: Renderer) {
    this._renderer = newRenderer
    this.filterManager.filters = newRenderer.filters
  }

  get renderer() {
    return this._renderer
  }
  
  filter(elementId: string, filter: Filter) {
    const element = this.renderer.cy.$id(elementId)
    const classesToAdd = ['filtered', filter.filterTag]
    element.addClass(classesToAdd.join(' '))
    // Filter fake nodes!
    this.renderer.cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass(classesToAdd.join(' '))

    // ARCHI IN USCITA
    //var selector = `[source = "${element.data('id')}"]`
    element.outgoers('edge').forEach(e => {
      let neighbour = e.target()

      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.target().hasClass(classesToAdd[0]) && (number_edges_in_out <= 0 || e.data('type') === GrapholTypesEnum.INPUT)) {
        this.filter(e.target().id(), filter)
      }
    })

    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
      let neighbour = e.source()
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.source().hasClass(classesToAdd[0]) && number_edges_in_out === 0) {
        this.filter(e.source().id(), filter)
      }
    })

    function getNumberEdgesInOut(neighbour: cytoscape.NodeSingular) {
      let count = neighbour.outgoers('edge').size() + neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).size()

      neighbour.outgoers('node').forEach(node => {
        if (node.hasClass(classesToAdd[0])) {
          count--
        }
      })

      neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).forEach(e => {
        if (e.source().hasClass(classesToAdd[0])) {
          count--
        }
      })

      return count
    }
  }

  unfilter(elementId: string, filter: Filter) {
    const classToRemove = ['filtered', filter.filterTag]
    this.renderer.cy.$id(elementId).removeClass(classToRemove.join(' '))
    this.renderer.cy.$(`.${filter.filterTag}`).removeClass(classToRemove.join(' '))
  }
}


// export abstract class StaticRenderer extends BaseRenderer {
//   abstract filterManager: FilterManager
//   abstract cyConfig: cytoscape.CytoscapeOptions

//   render(diagram: Diagram) {
//     // this.renderer.cy.mount(this.renderer.container)

//     // if (!diagram.hasEverBeenRendered) {
//     //   this.renderer.cy.fit()
//     // }

//     // this.renderer.unselect()
//     // diagram.hasEverBeenRendered = true
//   }

//   layoutRun(): void { }
//   layoutStop(): void { }
// }