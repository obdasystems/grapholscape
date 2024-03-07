import { EdgeSingular, SingularElementReturnValue } from "cytoscape";
import { DiagramBuilder, Grapholscape, IncrementalRendererState, OntologyColorManager } from "../core";
import { Annotation, Filter, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Hierarchy, IncrementalDiagram, Position, RendererStatesEnum, TypesEnum, Viewport } from "../model";
import { Command, NodeButton } from "../ui";
import { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import IncrementalLifecycle, { IncrementalEvent, IonIncrementalEvent } from "./lifecycle";
import setGraphEventHandlers from "../core/set-graph-event-handlers";


type ClassInstance = {
  iri: string,
  shortIri?: string,
  label?: {
    language?: string,
    value: string,
  },
  searchMatch?: string,
}

export type IncrementalHighlights = {
  classes: GrapholEntity[],
  dataProperties: GrapholEntity[]
  objectProperties: Map<GrapholEntity, ObjectPropertyConnectedClasses>
}

export interface IIncremental {
  diagram: IncrementalDiagram
  grapholscape: Grapholscape

  init(...args: any[]): void
  reset(...args: any[]): void
  on: IonIncrementalEvent
  setIncrementalEventHandlers(...args: any[]): void
  showDiagram(viewportState?: Viewport): void
  performActionWithBlockedGraph(action: () => void | Promise<void>, customLayoutOptions?: any): Promise<void>

  // highlights
  getHighlights(iris: string[], isInstance: boolean): Promise<IncrementalHighlights>
  getDataPropertiesHighlights(iris: string[], isInstance: boolean): Promise<GrapholEntity[]>
  getObjectPropertiesHighlights(iris: string[], isInstance: boolean): Promise<Map<GrapholEntity, ObjectPropertyConnectedClasses>>
  getAnnotations(iri: string): Promise<Annotation[]>
  getSuperClasses(classIri: string): Promise<GrapholEntity[]>
  getSubClasses(classIri: string): Promise<GrapholEntity[]>

  addIndividual(individual: GrapholEntity, parentClassesIris?: string[], position?: Position): void
  addClass(iri: string, centerOnIt?: boolean, position?: Position): void
  addEdge(sourceId: string, targetId: string, edgeType: TypesEnum.INCLUSION | TypesEnum.INPUT | TypesEnum.EQUIVALENCE | TypesEnum.INSTANCE_OF): GrapholElement | undefined

  getContextMenuCommands(grapholElement: GrapholElement, cyElement: SingularElementReturnValue): Command[]
  getNodeButtons(grapholElement: GrapholElement, cyElement: SingularElementReturnValue): NodeButton[]

  getIDByIRI(iri: string, type: TypesEnum): string | undefined

  // instanceCheck(iri: string, classesToCheck: string[]): Promise<string[]>
  // countInstances(iri: string, entityType: TypesEnum.CLASS | TypesEnum.OBJECT_PROPERTY): Promise<number>,

  // queries
  // getInstances: (classIri: string) => Promise<{ results: ClassInstance[][], totalAvailableNumber: number }>,
}

export default abstract class IncrementalBase implements IIncremental {
  protected actionsWithBlockedGraph = 0
  diagramBuilder: DiagramBuilder

  classFilterMap: Map<string, Filter> = new Map()
  diagram: IncrementalDiagram = new IncrementalDiagram()
  grapholscape: Grapholscape

  lifecycle: IncrementalLifecycle = new IncrementalLifecycle()
  on = this.lifecycle.on

  constructor(grapholscape: Grapholscape) {
    this.grapholscape = grapholscape
    // this.grapholscape.incremental = this
    this.diagramBuilder = new DiagramBuilder(this.diagram, RendererStatesEnum.INCREMENTAL)
  }

  abstract getHighlights(iris: string[], isInstance: boolean): Promise<IncrementalHighlights>
  abstract getDataPropertiesHighlights(iris: string[], isInstance: boolean): Promise<GrapholEntity[]>
  abstract getObjectPropertiesHighlights(iris: string[], isInstance: boolean): Promise<Map<GrapholEntity, ObjectPropertyConnectedClasses>>
  abstract getAnnotations(iri: string): Promise<Annotation[]>
  abstract getSuperClasses(classIri: string): Promise<GrapholEntity[]>
  abstract getSubClasses(classIri: string): Promise<GrapholEntity[]>
  abstract getContextMenuCommands(grapholElement: GrapholElement, cyElement: SingularElementReturnValue): Command[]
  abstract getNodeButtons(grapholElement: GrapholElement, cyElement: SingularElementReturnValue): NodeButton[]
  abstract init(...args: any[]): void
  abstract reset(...args: any[]): void
  abstract setIncrementalEventHandlers(...args: any[]): void

  async performActionWithBlockedGraph(action: () => void | Promise<void>, customLayoutOptions?: any) {
    this.actionsWithBlockedGraph += 1
    const oldElemNumbers = this.numberOfElements
    this.incrementalRenderer?.freezeGraph()
    await action()
    this.actionsWithBlockedGraph -= 1
    this.postDiagramEdit(oldElemNumbers, customLayoutOptions)
  }

  addEdge = (sourceId: string, targetId: string, edgeType: TypesEnum.INCLUSION | TypesEnum.INPUT | TypesEnum.EQUIVALENCE | TypesEnum.INSTANCE_OF) => {
    return this.diagramBuilder.addEdge(sourceId, targetId, edgeType)
  }

  showDiagram(viewportState?: Viewport) {
    if (viewportState)
      this.diagram.lastViewportState = viewportState

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.grapholscape.ontology)

    this.grapholscape.renderer.render(this.diagram)
  }

  addClass(iri: string, centerOnIt = true, position?: Position) {
    const entity = this.grapholscape.ontology.getEntity(iri)
    let classNode: GrapholNode | undefined
    if (entity && this.diagram.representation) {
      if (!entity.color) {
        const colorManager = new OntologyColorManager(
          this.grapholscape.ontology,
          this.diagram.representation)

        colorManager.setClassColor(entity)
      }

      classNode = this.diagramBuilder.addClass(entity, position) as GrapholNode
    } else {
      const classNodeId = this.getIDByIRI(iri, TypesEnum.CLASS)
      if (classNodeId)
        classNode = this.diagram.representation?.grapholElements.get(classNodeId) as GrapholNode
    }

    if (centerOnIt && classNode) {
      this.grapholscape.centerOnElement(classNode.id)
      this.grapholscape.selectElement(classNode.id)
    }

    this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    return classNode
  }

  addIndividual(individual: GrapholEntity, parentClassesIris?: string[], position?: Position) {
    const addedNode = this.diagramBuilder.addIndividual(individual, position)

    parentClassesIris?.forEach(parentClassesIri => {
      const classId = this.getIDByIRI(parentClassesIri, TypesEnum.CLASS)


      if (addedNode && classId) {
        this.diagramBuilder.addEdge(addedNode.id, classId, TypesEnum.INSTANCE_OF)
      }
    })

    // if (!individual.color && this.diagram.representation) {
    //   const colorManager = new OntologyColorManager(this.grapholscape.ontology, this.diagram.representation)
    //   colorManager.setInstanceColor(individual as ClassInstance)
    // }

    // this.updateEntityNameType(individual.iri)
    this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    return addedNode
  }

  /**
   * Add object property edge between two classes.
   * @param objectPropertyIri the object property iri to add
   * @param sourceClassIri
   * @param targetClassIri
   */
  addIntensionalObjectProperty(objectPropertyIri: string, sourceClassIri: string, targetClassIri: string) {
    const objectPropertyEntity = this.grapholscape.ontology.getEntity(objectPropertyIri)
    const sourceClass = this.grapholscape.ontology.getEntity(sourceClassIri)
    const targetClass = this.grapholscape.ontology.getEntity(targetClassIri)
    let objectPropertyEdge: GrapholEdge | undefined
    if (objectPropertyEntity && sourceClass && targetClass) {
      if ((!sourceClass.color || !targetClass.color) && this.diagram.representation) {
        new OntologyColorManager(this.grapholscape.ontology, this.diagram.representation)
          .setClassColor(sourceClass)
          .setClassColor(targetClass)
      }
      objectPropertyEdge = this.diagramBuilder.addObjectProperty(
        objectPropertyEntity,
        sourceClass,
        targetClass,
        [TypesEnum.CLASS]
      ) as GrapholEdge

      // this.updateEntityNameType(objectPropertyEntity.iri)
      // this.updateEntityNameType(sourceClassIri)
      // this.updateEntityNameType(targetClassIri)

      setTimeout(() => {
        const nodeId = this.getIDByIRI(targetClassIri, TypesEnum.CLASS)
        if (nodeId) {
          this.grapholscape.centerOnElement(nodeId)
        }
      }, 250)

      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
      return objectPropertyEdge
    }
  }

  showClassesInIsa(
    sourceIri: string,
    targetsIris: string[],
    isaType: TypesEnum.INCLUSION | TypesEnum.EQUIVALENCE,
    subOrSuper: 'sub' | 'super' = 'sub') {

    const sourceId = this.getIDByIRI(sourceIri, TypesEnum.CLASS)
    if (sourceId) {
      this.performActionWithBlockedGraph(() => {
        let targetNode: GrapholNode | undefined
        targetsIris.forEach(targetIri => {
          targetNode = this.addClass(targetIri, false)
          if (targetNode) {
            const cySource = this.diagram.representation?.cy.$id(sourceId)
            const cyTarget = this.diagram.representation?.cy.$id(targetNode.id)

            if (cySource?.nonempty() && cyTarget?.nonempty()) {
              if (subOrSuper === 'super') {
                const isEdgeAlreadyPresent = cySource.edgesTo(cyTarget)
                  .filter(e => e.data().type === TypesEnum.INCLUSION ||
                    e.data().type === TypesEnum.EQUIVALENCE)
                  .nonempty()

                if (!isEdgeAlreadyPresent) {
                  this.diagramBuilder.addEdge(sourceId, targetNode.id, isaType)
                }
              } else {
                const isEdgeAlreadyPresent = cyTarget.edgesTo(cySource)
                  .filter(e => e.data().type === TypesEnum.INCLUSION ||
                    e.data().type === TypesEnum.EQUIVALENCE)
                  .nonempty()

                if (!isEdgeAlreadyPresent) {
                  this.diagramBuilder.addEdge(targetNode.id, sourceId, isaType)
                }
              }
            }
          }
        })
      })
    }
  }

  /**
   * Show hierarchies for which the specified class is a subclass.
   * @param classIri 
   */
  showSuperHierarchiesOf(classIri: string) {
    this.showOrHideHierarchies(classIri, 'super', 'show')
  }

  /**
   * Show hierarchies for which the specified class is a superclass.
   * @param classIri 
   */
  showSubHierarchiesOf(classIri: string) {
    this.showOrHideHierarchies(classIri, 'sub', 'show')
  }

  protected showOrHideHierarchies(classIri: string, hierarchyType: 'super' | 'sub' | 'any', showORHide: 'show' | 'hide') {
    const classEntity = this.grapholscape.ontology.getEntity(classIri)
    if (!classEntity) return

    let hierarchies: Hierarchy[] | undefined
    const sub = this.grapholscape.ontology.getSubHierarchiesOf(classIri) // get hiearchies with class being a superclass => get sub classes
    const superh = this.grapholscape.ontology.getSuperHierarchiesOf(classIri) // get hierarchies with class being a subclass => get super classes
    switch (hierarchyType) {
      case 'super':
        hierarchies = superh
        break

      case 'sub':
        hierarchies = sub
        break

      case 'any':
        hierarchies = []
        if (sub)
          hierarchies.concat(sub)
        if (superh)
          hierarchies.concat(superh)

        break

      default:
        return
    }

    if (hierarchies && hierarchies.length > 0) {
      this.performActionWithBlockedGraph(() => {
        const classId = this.getIDByIRI(classIri, TypesEnum.CLASS)
        if (classId) {
          const position = this.grapholscape.renderer.cy?.$id(classId).position()
          if (showORHide === 'show')
            hierarchies?.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy, position))
          else
            hierarchies?.forEach(hierarchy => this.removeHierarchy(hierarchy, [classIri]))
        }
      })
    }
  }

  removeHierarchy(hierarchy: Hierarchy, entitiesTokeep: string[] = []) {
    if (!hierarchy.id || !this.isHierarchyNodeInDiagram(hierarchy)) {
      return
    }
    this.diagramBuilder.removeHierarchy(hierarchy)

    let classId: string | undefined

    // remove input classes or superclasses left with no edges
    hierarchy.inputs.forEach(inputClass => {
      classId = this.getIDByIRI(inputClass.iri.fullIri, TypesEnum.CLASS)
      if (classId &&
        this.grapholscape.renderer.cy?.$id(classId).degree(false) === 0 &&
        !entitiesTokeep.includes(inputClass.iri.fullIri)) {
        this.removeEntity(inputClass)
      }
    })

    hierarchy.superclasses.forEach(superclass => {
      classId = this.getIDByIRI(superclass.classEntity.iri.fullIri, TypesEnum.CLASS)
      if (
        classId &&
        this.grapholscape.renderer.cy?.$id(classId).degree(false) === 0 &&
        !entitiesTokeep.includes(superclass.classEntity.iri.fullIri)) {
        this.removeEntity(superclass.classEntity)
      }
    })
  }

  /**
   * Remove a class, an instance or a data property node from the diagram.
   * Entities left with no other connections are recurisvely removed too.
   * Called when the user click on the remove button on a entity node
   * @param entity
   */
  removeEntity(entity: GrapholEntity, entitiesIrisToKeep: string[] = []): void {
    this.performActionWithBlockedGraph(() => {
      this.grapholscape.renderer.cy?.$(`[iri = "${entity?.iri.fullIri}"]`).forEach(element => {
        // start from object properties connected to this entity, remove their occurrences from ontology entities
        const edges = element.connectedEdges(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`)
        edges.forEach(objectPropertyEdge => {
          const objectPropertyEntity = this.grapholscape.ontology.getEntity(objectPropertyEdge.data().iri)
          if (objectPropertyEntity) {
            const grapholOccurrence = this.diagram.representation?.grapholElements.get(objectPropertyEdge.id())
            if (grapholOccurrence) {
              objectPropertyEntity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
            }
          }
        })

        if (element.data().type === TypesEnum.CLASS) {
          element.neighborhood().forEach(neighbourElement => {
            if (neighbourElement.isNode()) {
              // remove nodes only if they have 1 connection, i.e. with the class we want to remove
              if (neighbourElement.degree(false) === 1 && !entitiesIrisToKeep.includes(neighbourElement.data().iri)) {
                if (neighbourElement.data().iri) {
                  // it's an entity, recursively remove entities
                  entitiesIrisToKeep.push(entity?.iri.fullIri || '') // the entity we are removing must be skipped, otherwise cyclic recursion
                  this.removeEntity(neighbourElement.data().iri, entitiesIrisToKeep)
                } else {
                  this.diagram.removeElement(neighbourElement.id())
                }
              }
            } else {
              // edges must be removed anyway
              // (cytoscape removes them automatically
              // but we need to update the grapholElements 
              // map in diagram representation and entity occurrences)
              this.diagram.removeElement((neighbourElement as EdgeSingular).id())
            }
          })

          this.grapholscape.ontology.getSuperHierarchiesOf(entity!.iri.fullIri).forEach(hierarchy => {
            this.removeHierarchy(hierarchy, [entity.iri.fullIri])
          })

          this.grapholscape.ontology.getSubHierarchiesOf(entity!.iri.fullIri).forEach(hierarchy => {
            this.removeHierarchy(hierarchy, [entity.iri.fullIri])
          })
        }


        if (entity && this.diagram.representation) {
          const grapholOccurrence = this.diagram.representation?.grapholElements.get(element.id())
          if (grapholOccurrence) {
            entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
          }
          this.diagram.removeElement(element.id())

          // if (entity.is(TypesEnum.CLASS_INSTANCE))
          //   this.classInstanceEntities.delete(entity.iri.fullIri)

          // this.classFilterMap.delete(entity.fullIri)
        }

      })
    })
  }

  postDiagramEdit(oldElemsNumber: number, customLayoutOptions?: any) {
    if (this.numberOfElements !== oldElemsNumber) {
      if (this.actionsWithBlockedGraph === 0) {
        customLayoutOptions
          ? this.incrementalRenderer?.runCustomLayout(customLayoutOptions)
          : this.incrementalRenderer?.runLayout()
      }
      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    } else {
      this.incrementalRenderer?.unFreezeGraph()
    }
  }

  protected isHierarchyNodeInDiagram(hierarchy: Hierarchy) {
    return this.grapholscape.renderer.cy?.$(`[hierarchyID = "${hierarchy.id}"]`).nonempty()
  }

  getIDByIRI(iri: string, type: TypesEnum) {
    const entity = this.grapholscape.ontology.getEntity(iri)
    if (entity) {
      return entity.getOccurrenceByType(type, RendererStatesEnum.INCREMENTAL)?.id
    }
  }

  private get incrementalRenderer() {
    if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      return this.grapholscape.renderer.renderState as IncrementalRendererState
    }
  }

  get numberOfElements() { return this.grapholscape.renderer.cy?.elements().size() || 0 }
}