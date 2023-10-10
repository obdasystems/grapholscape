import cytoscape, { ElementDefinition } from "cytoscape";
import { LitElement, css, html } from "lit";
import incrementalStyle from "../../core/rendering/incremental/incremental-style";
import { Entity, EntityTypeEnum, OntologyPath } from "../../incremental/api/swagger";
import { ColoursNames, GrapholscapeTheme, TypesEnum } from "../../model";
import { SizeEnum } from "../common/button";
import { BaseMixin, ModalMixin } from "../common/mixins";
import baseStyle from '../style';

export default class GscapePathSelector extends ModalMixin(BaseMixin(LitElement)) {

  private _paths: OntologyPath[] = []
  selectedPathID: number = 0
  canShowMore: boolean = false

  private cy?: cytoscape.Core = cytoscape()

  static properties = {
    getMorePaths: { type: Boolean },
    paths: { type: Array },
    selectedPathID: { type: Number },
    canShowMore: { type: Boolean }
  }

  static styles = [
    baseStyle,
    css`
      .gscape-panel {
        position: absolute;
        overflow: hidden;
        top: 100px;
        left: 50%;
        transform: translate(-50%);
        max-width: 80%;
        min-width: 60%;
        min-height: 50%;
        display: flex;
        flex-direction: column;
      }

      .header {
        margin: 8px;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
      }

      .path {
        display: flex;
        align-items: center;
        overflow: auto;
        gap: 4px;
        border: solid 1px var(--gscape-color-border-subtle);
      }

      .path[selected] {
        border: solid 2px var(--gscape-color-accent);
        background: var(--gscape-color-neutral-subtle);
      }

      gscape-entity-list-item {
        max-width: 200px;
        pointer-events: none;
      }

      .path-list {
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      #cy {
        position: relative;
        flex-grow: 2;
      }
    `
  ]

  constructor(private theme: GrapholscapeTheme) {
    super()
  }

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">Select a path over the ontology</div>
      
        <!-- <div class="path-list">
                      ${this.paths.map((path, i) => {
            return html`
                          <div id=${i} class="path actionable" ?selected=${this.selectedPathID === i} @click=${this.handlePathClick}>
                            ${i === 0
                ? html`
                                <span class="chip">
                                  Shortest
                                </span>
                              `
                : null
              }
                            
                            ${path.entities?.map((entity) => {
                let types = new Set()
                let displayedName: string | undefined
                if (entity.type === EntityTypeEnum.ObjectProperty ||
                  entity.type === EntityTypeEnum.InverseObjectProperty) {
                  if (!entity.iri?.endsWith('subClassOf')) {
                    types.add(TypesEnum.OBJECT_PROPERTY)
                  } else {
                    displayedName = 'subClassOf'
                  }
                }
      
                if (entity.type === EntityTypeEnum.Class) {
                  types.add(TypesEnum.CLASS)
                }
      
                return html`
                                <gscape-entity-list-item
                                  displayedName=${displayedName || this.getDisplayedName(entity)}
                                  iri=${entity.iri}
                                  .types=${types}
            
                                >
                                </gscape-entity-list-item>
                              `
              })}
                          </div>
                        `
          })}
                    </div> -->
      
        <div id="cy"></div>
      
        ${this.canShowMore
          ? html`
        <center>
          <gscape-button label="Show More" type="subtle" size=${SizeEnum.S} @click=${this.handleShowMoreClick}>
          </gscape-button>
        </center>
        `
          : null
        }
      
        <div class="buttons">
          <gscape-button label="Cancel" type="subtle" @click=${this.handleCancel}></gscape-button>
          <gscape-button label="Ok" @click=${this.handleConfirm}></gscape-button>
        </div>
      </div>
    `
  }

  getDisplayedName = (entity: Entity) => entity.iri

  private setTheme(theme: GrapholscapeTheme) {
    const style = incrementalStyle(theme)

    style.push(
      {
        selector: 'node',
        style: {
          shape: 'round-rectangle',
          width: 100,
          height: 35,
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'unbundled-bezier',
          "control-point-distances": (elem: cytoscape.EdgeSingular) => this.getEdgePointDistances(elem),
          "control-point-weights": (elem: cytoscape.EdgeSingular) => this.getEdgePointWeights(elem),
          // 'source-endpoint': ['50%', 0],
          // 'target-endpoint': ['-50%', 0],
        }
      },
      {
        selector: `[?inverseEdge]`,
        style: {
          'source-arrow-shape': 'triangle',
          'source-arrow-fill': 'filled',
        }
      },
      {
        selector: `[?inverseEdge][type = "${TypesEnum.INCLUSION}"]`,
        style: {
          'target-arrow-shape': 'none',
        }
      },
      {
        selector: `[?inverseEdge][type = "${TypesEnum.OBJECT_PROPERTY}"]`,
        style: {
          'target-arrow-shape': 'square',
          'target-arrow-fill': 'hollow',
        }
      },
      {
        selector: `.dimmed`,
        style: {
          'opacity': 0.4,
        }
      },      
      {
        selector: `.highlighted`,
        style: {
          'underlay-opacity': '1',
          'underlay-color': theme.getColour(ColoursNames.neutral_muted),
          'opacity': 1,
        } as any // avoid warning on 'underlay-*' not existing in cytoscape's types.
      },
      {
        selector: `edge.selected`,
        style: {
          'width': 4,
        }
      },
      {
        selector: `.selected`,
        style: {
          'border-color': theme.getColour(ColoursNames.accent),
          'border-width': 4,
          'line-color': theme.getColour(ColoursNames.accent),
          'target-arrow-color': theme.getColour(ColoursNames.accent),
          'source-arrow-color': theme.getColour(ColoursNames.accent),
          'z-index': 10,
        } as any
      }
    );

    (this.cy?.style() as any)?.fromJson(style).update()
  }

  private getEdgePointDistances(elem: cytoscape.EdgeSingular) {
    if (elem.source().same(elem.cy().elements().roots()) &&
      elem.target().same(elem.cy().elements().leaves())) {
      return [-60]
    }

    let result
    const sourcePos = elem.source().position()
    const targetPos = elem.target().position()

    const xDiff = Math.abs(sourcePos.x - targetPos.x)
    let yDiff = sourcePos.y - targetPos.y
    const isSourceAbove = yDiff < 0
    yDiff = Math.abs(yDiff)
    if (xDiff < Math.abs(yDiff)) {
      result = xDiff
    } else {
      result = yDiff
    }

    result = result / 4

    return isSourceAbove ? [-result, result] : [result, -result]
  }

  private getEdgePointWeights(edge: cytoscape.EdgeSingular) {
    if (edge.source().same(edge.cy().elements().roots()) &&
      edge.target().same(edge.cy().elements().leaves())) {
      return [0.5]
    }

    let weight1 = 0.25
    let weight2 = 0.75
    // if last edge in path and path is shorter than the longest one, we must move
    // control points towards the sink node to avoid cluttering diagram
    if (edge.target().degree(false) === 1) {
      const maxPathsLength = Math.max(...this._paths.map(path => path.entities?.length || 0))
      const currentPathLength = this._paths[edge.data().pathId].entities?.length || 0
  
      if (currentPathLength < maxPathsLength) {
        weight1 = weight1 + (weight2 * currentPathLength)
        weight2 = weight2 + (weight1 * currentPathLength)
      }
    }

    return [0.25, 0.75]
  }

  private handlePathClick(e: MouseEvent) {
    const id = (e.currentTarget as HTMLDivElement)?.getAttribute('id')
    if (id) {
      this.selectedPathID = parseInt(id)
    }
  }

  private async handleShowMoreClick(e: MouseEvent) {
    await this.updateComplete

    this.dispatchEvent(new CustomEvent('show-more-paths', {
      bubbles: true,
      composed: true,
    } as PathSelectionEvent))
  }

  private async handleConfirm() {
    await this.updateComplete

    this.dispatchEvent(new CustomEvent('path-selection', {
      bubbles: true,
      composed: true,
      detail: this.selectedPath
    } as PathSelectionEvent))

    this.remove()
  }

  private async handleCancel() {
    await this.updateComplete

    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }))

    this.remove()
  }

  get selectedPath() {
    return this.paths[this.selectedPathID]
  }

  get paths() {
    return this._paths
  }

  set paths(newPaths) {
    this.updateComplete.then(() => {
      this.cyInit()
      if (!this.cy || newPaths.length <= 0 || !newPaths[0].entities) 
        return
      
      const oldValue = this._paths
      this._paths = newPaths
    
      const sourceNodeCy = this.cy.add(this.getEntityCyRepr(newPaths[0].entities[0], -1))
      const sinkNodeCy = this.cy.add(this.getEntityCyRepr(newPaths[0].entities[newPaths[0].entities.length - 1], -1))

      for( let [pathId, path] of newPaths.entries()) {
        if (path.entities) {
          let edge: ElementDefinition,
            previousClassCy: cytoscape.SingularElementArgument,
            successorClassCy: cytoscape.SingularElementArgument

          for (let [i, entity] of path.entities.entries()) {
            if (entity.type === EntityTypeEnum.ObjectProperty || entity.type === EntityTypeEnum.InverseObjectProperty) {
              let previousClass = path.entities[i - 1]
              let successorClass = path.entities[i + 1]

              if (previousClass && successorClass) {              
                /**
                 * If i === 1 then previous class is sourceNode
                 * if i === length - 1 then successor class is sinkNode
                 * 
                 * In all other cases check if there's already the class node
                 * for the current path, each path must have its own classes,
                 * so the can be replicated.
                 */
                if (i === 1) {
                  previousClassCy = sourceNodeCy
                } else {
                  previousClassCy = this.cy.$(`[iri = "${previousClass.iri}"][type = "${EntityTypeEnum.Class}"][pathId = ${pathId}]`).first()

                  if (previousClassCy.empty()) {
                    previousClassCy = this.cy.add(this.getEntityCyRepr(previousClass, pathId))
                  }
                }
                
                if (i === path.entities.length - 2) {
                  successorClassCy = sinkNodeCy
                } else {
                  successorClassCy = this.cy.$(`[iri = "${successorClass.iri}"][type = "${EntityTypeEnum.Class}"][pathId = ${pathId}]`).first()

                  if (successorClassCy.empty()) {
                    successorClassCy = this.cy.add(this.getEntityCyRepr(successorClass, pathId))
                  }
                }
                
                if (previousClassCy.empty() || successorClassCy.empty()) {
                  break
                }
                
                edge = this.getEntityCyRepr(entity, pathId)
                edge.data.source = previousClassCy.id()
                edge.data.target = successorClassCy.id()
                this.cy.add(edge)
              } else {
                break
              }
            }
          }
        }
      }

      this.cy.layout({
        name: 'klay',
        klay: {
          spacing: 80,
          fixedAlignment: 'BALANCED',
        },
        padding: 30,
        // some more options here...
      } as any).run()

      this.cy.fit()
      this.selectPath(0)
      this.requestUpdate('paths', oldValue)
    })
  }

  private getEntityCyRepr(entity: Entity, pathId: number): ElementDefinition {

    let type: TypesEnum

    switch (entity.type) {
      case EntityTypeEnum.Class:
        type = TypesEnum.CLASS
        break

      case EntityTypeEnum.InverseObjectProperty:
      case EntityTypeEnum.ObjectProperty:
        type = entity.iri?.endsWith('subClassOf') ? TypesEnum.INCLUSION : TypesEnum.OBJECT_PROPERTY
        break

      default:
        type = TypesEnum.CLASS
    }

    return {
      data: {
        displayedName: this.getDisplayedName(entity),
        type: type,
        iri: entity.iri,
        pathId: pathId,
        inverseEdge: entity.type === EntityTypeEnum.InverseObjectProperty
      }
    }
  }

  private cyInit() {
    this.cy = cytoscape({
      container: this.shadowRoot?.querySelector('#cy'),
      autounselectify: true,
      autoungrabify: true,
      wheelSensitivity: 0.2,
    })

    this.setTheme(this.theme)

    this.fixHover()

    this.cy.on('mouseover', '*', (evt) => {
      const pathId = evt.target.data().pathId

      if (pathId !== undefined) {
        this.highlightPath(pathId)

        const container = this.cy?.container()
        if (container)
          container.style.cursor = 'pointer'
      }
    })

    this.cy.on('tap', (evt) => {
      if (evt.target === this.cy) {
        this.paths.forEach((path, i) => {
          this.deHighlightPath(i)
        })
      } else {
        const pathId = evt.target.data().pathId

        if (pathId !== undefined) {
          this.selectPath(pathId)
        }
      }

      this.fixHover()
    })

    this.cy.on('dbltap', (evt) => {
      if (evt.target === this.cy)
        this.cy?.fit()

      this.fixHover()
    })

    this.cy.on('mouseout', '*', (evt) => {
      const pathId = evt.target.data().pathId

      if (pathId !== undefined) {
        this.deHighlightPath(pathId)

        const container = this.cy?.container()
        if (container)
          container.style.cursor = 'initial'
      }
    })
  }

  private highlightPath(pathId: number) {
    if (pathId !== -1) // -1 is for source and sink nodes, common to every path
      this.cy?.$(`[pathId = ${pathId}]`).addClass('highlighted')
  }

  private deHighlightPath(pathId) {
    if (pathId !== -1) // -1 is for source and sink nodes, common to every path
      this.cy?.$(`[pathId = ${pathId}]`).removeClass('highlighted')
  }

  private selectPath(pathId: number) {
    if (pathId !== -1) {
      this.cy?.elements().removeClass('selected dimmed')
      this.cy?.$(`[pathId = -1]`).addClass('selected')
      this.cy?.$(`[pathId = ${pathId}]`).addClass('selected')
      this.cy?.$('*').difference(this.cy?.$('.selected')).addClass('dimmed')
      this.selectedPathID = pathId
    }
  }

  /**
   * --- HACKY --- 
   * Allow events not involving buttons to work on cytoscape when it's in a shadow dom.
   * They don't work due to shadow dom event's retargeting
   * Cytoscape listen to events on window object. When the event reach window due to bubbling,
   * cytoscape handler for mouse movement handles it but event target appear to be the 
   * custom component and not the canvas due to retargeting, therefore listeners are not triggered.
   * workaround found here: https://github.com/cytoscape/cytoscape.js/issues/2081
   */
  private fixHover() {
    try {
      (this.cy as any).renderer().hoverData.capture = true
    } catch { }
  }
}

customElements.define('gscape-path-selector', GscapePathSelector)

export type PathSelectionEvent = CustomEvent<OntologyPath>