import { EdgeSingular, NodeSingular, Position } from "cytoscape";
import { EntityNameType } from "../config";
import { Grapholscape, IncrementalRendererState } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Annotation, AnnotationsKind, GrapholElement, GrapholEntity, GrapholTypesEnum, Hierarchy, IncrementalDiagram, Iri, LifecycleEvent, RendererStatesEnum, ViewportState } from "../model";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { ClassInstance } from "./api/kg-api";
import { QueryStatusEnum, RequestOptions } from "./api/model";
import DiagramBuilder from "./diagram-builder";
import EndpointController from "./endpoint-controller";
import IncrementalLifecycle, { IncrementalEvent } from "./lifecycle";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import { addBadge } from "./ui";
import NodeButton from "./ui/node-buttons.ts/node-button";

/** @internal */
export default class IncrementalController {
  private diagramBuilder: DiagramBuilder
  neighbourhoodFinder: NeighbourhoodFinder

  public classInstanceEntities: Map<string, ClassInstanceEntity> = new Map()

  public lastClassIri?: string
  public lastInstanceIri?: string

  public diagram: IncrementalDiagram = new IncrementalDiagram()

  endpointController?: EndpointController

  private actionsWithBlockedGraph = 0
  private entitySelectionTimeout: NodeJS.Timeout
  public counts: Map<string, { value: number, materialized: boolean, date?: string }> = new Map()
  public countersEnabled: boolean = true

  lifecycle: IncrementalLifecycle = new IncrementalLifecycle()
  on = this.lifecycle.on

  /**
   * Callback called when user click on data lineage command
   */
  onShowDataLineage: (entityIri: string) => void = () => { }
  addEdge: (sourceId: string, targetId: string, edgeType: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.INPUT | GrapholTypesEnum.EQUIVALENCE | GrapholTypesEnum.INSTANCE_OF) => void;

  constructor(
    public grapholscape: Grapholscape
  ) {
    this.setIncrementalEventHandlers()
    this.diagramBuilder = new DiagramBuilder(this.diagram)
    this.addEdge = this.diagramBuilder.addEdge.bind(this.diagramBuilder)
    this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology)

    // update instances displayed names
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, _ => {
      this.classInstanceEntities.forEach(instanceEntity => this.updateEntityNameType(instanceEntity.iri))
    })

    grapholscape.on(LifecycleEvent.LanguageChange, newLang => {
      this.endpointController?.setLanguage(newLang)

      // update labels language only if they are actually visible
      if (grapholscape.entityNameType === EntityNameType.LABEL)
        this.classInstanceEntities.forEach(instanceEntity => this.updateEntityNameType(instanceEntity.iri))
    })
  }

  showDiagram(viewportState?: ViewportState) {
    if (viewportState)
      this.diagram.lastViewportState = viewportState

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.grapholscape.ontology)

    this.grapholscape.renderer.render(this.diagram)
  }

  async performActionWithBlockedGraph(action: () => void | Promise<void>) {
    this.actionsWithBlockedGraph += 1
    const oldElemNumbers = this.numberOfElements
    this.incrementalRenderer?.freezeGraph()
    await action()
    this.actionsWithBlockedGraph -= 1
    this.postDiagramEdit(oldElemNumbers)
  }

  /**
   * @internal
   * 
   * Create new EndpointApi object with current mastro request options
   */
  setMastroConnection(mastroRequestOptions: RequestOptions) {
    this.reset()
    if (!mastroRequestOptions.onError) {
      mastroRequestOptions.onError = (error) => console.error(error)
    }
    this.endpointController = new EndpointController(mastroRequestOptions, this.lifecycle)
    this.endpointController.setLanguage(this.grapholscape.language)
    this.lifecycle.trigger(IncrementalEvent.ReasonerSet)
  }

  addClass(iri: string, centerOnIt = true, position?: Position) {
    const entity = this.grapholscape.ontology.getEntity(iri)

    if (entity && this.diagramBuilder.diagram.representation) {

      this.diagramBuilder.addClass(entity, position)

      this.updateEntityNameType(entity.iri)
      if (centerOnIt)
        this.grapholscape.centerOnElement(`${iri}-${GrapholTypesEnum.CLASS}`)

      if (entity.is(GrapholTypesEnum.CLASS))
        this.countInstancesForClass(iri, false)
    }
  }

  areHierarchiesVisible(hierarchies: Hierarchy[]) {
    let result = true
    for (let hierarchy of hierarchies) {
      if (hierarchy.id && this.grapholscape.renderer.cy?.$id(hierarchy.id).empty()) {
        result = false
        break
      }
    }

    return result
  }

  areAllConnectedClassesVisibleForClass(classIri: string, connectedClassesIris: string[], positionType: 'sub' | 'super' | 'equivalent') {
    for (let subClassIri of connectedClassesIris) {
      const connectedEdges = this.grapholscape.renderer.cy?.$id(`${subClassIri}-${GrapholTypesEnum.CLASS}`)
        .connectedEdges(`[ type ="${positionType === 'equivalent' ? GrapholTypesEnum.EQUIVALENCE : GrapholTypesEnum.INCLUSION}" ]`)

      if (connectedEdges) {
        if (positionType === 'sub' && connectedEdges.targets(`[iri = "${classIri}"]`).empty())
          return false

        if (positionType === 'super' && connectedEdges.sources(`[iri = "${classIri}"]`).empty())
          return false

        if (positionType === 'equivalent' && connectedEdges.connectedNodes(`[iri = "${classIri}"]`).empty())
          return false
      }
    }

    return true
  }

  reset() {
    this.incrementalRenderer?.reset()
    this.classInstanceEntities.clear()
    this.diagram.clear()
    this.clearState()
    this.lifecycle.trigger(IncrementalEvent.Reset)
  }

  clearState() {
    this.endpointController?.clear()
  }

  private updateEntityNameType(iri: string | Iri) {
    let entityIri: string

    if (typeof (iri) !== 'string') {
      entityIri = iri.fullIri
    } else {
      entityIri = iri
    }

    const entity = this.classInstanceEntities.get(entityIri) || this.ontology.getEntity(entityIri)
    let entityElement = this.diagram.representation?.grapholElements.get(entityIri)
    let entityElements: GrapholElement[] | undefined

    // can't find element? look for occurrences, not every entity has id=iri
    if (entity && !entityElement) {
      entityElements = entity.occurrences.get(RendererStatesEnum.INCREMENTAL)
    } else if (entityElement) {
      entityElements = [entityElement]
    }

    if (entity && entityElements) {
      // set the displayed name based on current entity name type
      entityElements.forEach(element => {
        element.displayedName = entity.getDisplayedName(
          this.grapholscape.entityNameType,
          this.grapholscape.language
        )
        this.diagram?.representation?.updateElement(element, false)
      })
    }
  }

  /**
   * Remove a class, an instance or a data property node from the diagram.
   * Entities left with no other connections are recurisvely removed too.
   * Called when the user click on the remove button on a entity node
   * @param entityIri 
   */
  removeEntity(entityIri: GrapholEntity, entitiesIrisToKeep?: string[]): void
  removeEntity(entityIri: string, entitiesIrisToKeep?: string[]): void
  removeEntity(entityOrIri: string | GrapholEntity, entitiesIrisToKeep: string[] = []) {
    let entity: GrapholEntity | undefined | null

    if (typeof (entityOrIri) === 'string') {
      entity = this.classInstanceEntities.get(entityOrIri) || this.ontology.getEntity(entityOrIri)
    } else {
      entity = entityOrIri
    }

    this.performActionWithBlockedGraph(() => {
      this.grapholscape.renderer.cy?.$(`[iri = "${entity?.iri.fullIri}"]`).forEach(element => {
        // start from object properties connected to this entity, remove their occurrences from ontology entities
        const edges = element.connectedEdges(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`)
        edges.forEach(objectPropertyEdge => {
          const objectPropertyEntity = this.ontology.getEntity(objectPropertyEdge.data().iri)
          if (objectPropertyEntity) {
            const grapholOccurrence = this.diagram.representation?.grapholElements.get(objectPropertyEdge.id())
            if (grapholOccurrence) {
              objectPropertyEntity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
            }
          }
        })

        if (element.data().type === GrapholTypesEnum.CLASS) {
          element.neighborhood().forEach(neighbourElement => {
            if (neighbourElement.isNode()) {
              // remove nodes only if they have 1 connection, i.e. with the class we want to remove
              if (neighbourElement.degree(false) === 1 && !entitiesIrisToKeep.includes(neighbourElement.id())) {
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
              // map too in diagram representation)
              this.diagram.removeElement((neighbourElement as EdgeSingular).id())
            }
          })

          this.ontology.hierarchiesBySubclassMap.get(entity!.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })

          this.ontology.hierarchiesBySuperclassMap.get(entity!.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })
        }

        this.diagram.removeElement(element.id())
        const grapholOccurrence = this.diagram.representation?.grapholElements.get(element.id())
        if (grapholOccurrence) {
          entity?.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
        }

        if (entity?.is(GrapholTypesEnum.CLASS_INSTANCE))
          this.classInstanceEntities.delete(entity.iri.fullIri)
      })
    })
  }

  addInstance(instance: ClassInstance, parentClassesIris?: string[] | string) {
    let classInstanceEntity = this.classInstanceEntities.get(instance.iri)

    // if not already present, then build classInstanceEntity and add it to diagram
    if (!classInstanceEntity) {
      const classInstanceIri = new Iri(instance.iri, this.ontology.namespaces, instance.shortIri)

      classInstanceEntity = new ClassInstanceEntity(classInstanceIri)

      if (instance.label) {
        classInstanceEntity.addAnnotation(
          new Annotation(AnnotationsKind.label, instance.label.value, instance.label.language)
        )
      }

      this.endpointController?.requestLabels(instance.iri).then(labels => {
        labels?.forEach(label => {
          classInstanceEntity!.addAnnotation(
            new Annotation(AnnotationsKind.label, label.value, label.language)
          )
        })

        this.updateEntityNameType(classInstanceEntity!.iri)
      })


      this.diagramBuilder.addClassInstance(classInstanceEntity)
      this.classInstanceEntities.set(instance.iri, classInstanceEntity)
    }


    // update parent class Iri
    if (typeof (parentClassesIris) !== 'string') {

      if (!parentClassesIris || parentClassesIris.length === 0) {
        parentClassesIris = this.ontology.getEntitiesByType(GrapholTypesEnum.CLASS).map(entity => entity.iri.fullIri)
      }

      this.endpointController?.instanceCheck(instance.iri, parentClassesIris).then(result => {
        result.forEach(classIri => {
          const classEntity = this.ontology.getEntity(classIri)
          if (classEntity && classInstanceEntity) {
            classInstanceEntity.addParentClass(classEntity.iri)
          }
        })
      })

    } else {
      const parentClassEntity = this.ontology.getEntity(parentClassesIris)
      if (parentClassEntity)
        classInstanceEntity.addParentClass(parentClassEntity.iri)
    }

    this.updateEntityNameType(classInstanceEntity.iri)
    this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    return classInstanceEntity
  }

  /**
   * Add object property edge between two classes.
   * @param objectPropertyIri the object property iri to add
   * @param sourceClassIri
   * @param targetClassIri
   */
  addIntensionalObjectProperty(objectPropertyIri: string, sourceClassIri: string, targetClassIri: string) {
    const objectPropertyEntity = this.ontology.getEntity(objectPropertyIri)
    const sourceClass = this.ontology.getEntity(sourceClassIri)
    const targetClass = this.ontology.getEntity(targetClassIri)

    if (objectPropertyEntity && sourceClass && targetClass) {
      this.performActionWithBlockedGraph(() => {
        this.diagramBuilder.addObjectProperty(objectPropertyEntity, sourceClass, targetClass, GrapholTypesEnum.CLASS)

        this.updateEntityNameType(objectPropertyEntity.iri)
        this.updateEntityNameType(sourceClassIri)
        this.updateEntityNameType(targetClassIri)
      })

      this.countInstancesForClass(sourceClassIri)
      this.countInstancesForClass(targetClassIri)
    }
  }

  /**
   * Add object property edge between two instances
   * @param objectPropertyIri 
   * @param sourceInstanceIri 
   * @param targetInstanceIri 
   */
  addExtensionalObjectProperty(objectPropertyIri: string, sourceInstanceIri: string, targetInstanceIri: string) {
    const objectPropertyEntity = this.ontology.getEntity(objectPropertyIri)
    const sourceInstanceEntity = this.classInstanceEntities.get(sourceInstanceIri)
    const targetInstanceEntity = this.classInstanceEntities.get(targetInstanceIri)

    if (objectPropertyEntity && sourceInstanceEntity && targetInstanceEntity) {
      this.performActionWithBlockedGraph(() => {
        this.diagramBuilder.addObjectProperty(
          objectPropertyEntity,
          sourceInstanceEntity,
          targetInstanceEntity,
          GrapholTypesEnum.CLASS_INSTANCE
        )

        this.updateEntityNameType(objectPropertyEntity.iri)
        this.updateEntityNameType(sourceInstanceEntity.iri)
        this.updateEntityNameType(targetInstanceEntity.iri)
      })
    }
  }

  /**
   * Shows the domain/range types of an extensional object property
   * hence only if object property connects two instances, shows their rdf:types
   * and add the intensional object property between them.
   * @param objectPropertyIri
   * @param sourceClassInstanceIri 
   * @param targetClassInstanceIri 
   */
  showObjectPropertyTypes(objectPropertyIri: string, sourceClassInstanceIri: string, targetClassInstanceIri: string) {
    const sourceClassInstanceEntity = this.classInstanceEntities.get(sourceClassInstanceIri)
    const targetClassInstanceEntity = this.classInstanceEntities.get(targetClassInstanceIri)

    if (sourceClassInstanceEntity && targetClassInstanceEntity) {
      sourceClassInstanceEntity.parentClassIris.forEach(sourceParentClassIri => {
        targetClassInstanceEntity.parentClassIris.forEach(targetParentClassIri => {
          this.addIntensionalObjectProperty(
            objectPropertyIri,
            sourceParentClassIri.fullIri,
            targetParentClassIri.fullIri,
          )
          this.addEdge(
            sourceClassInstanceIri,
            sourceParentClassIri.fullIri,
            GrapholTypesEnum.INSTANCE_OF
          )
          this.addEdge(
            targetClassInstanceIri,
            targetParentClassIri.fullIri,
            GrapholTypesEnum.INSTANCE_OF
          )
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

  /**
   * Hide hierarchies for which the specified class is a subClass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSuperHierarchiesOf(classIri: string) {
    this.showOrHideHierarchies(classIri, 'super', 'hide')
  }

  /**
   * Show hierarchies for which the specified class is a superclass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSubHierarchiesOf(classIri: string) {
    this.showOrHideHierarchies(classIri, 'sub', 'hide')
  }

  private showOrHideHierarchies(classIri: string, hierarchyType: 'super' | 'sub' | 'any', showORHide: 'show' | 'hide') {
    const classEntity = this.ontology.getEntity(classIri)
    if (!classEntity) return

    let hierarchies: Hierarchy[] | undefined
    const sub = this.ontology.hierarchiesBySuperclassMap.get(classIri) // get hiearchies with class being a superclass => get sub classes
    const superh = this.ontology.hierarchiesBySubclassMap.get(classIri) // get hierarchies with class being a subclass => get super classes
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
        const position = this.grapholscape.renderer.cy?.$id(`${classIri}-${GrapholTypesEnum.CLASS}`).position()
        if (showORHide === 'show')
          hierarchies?.forEach(hierarchy => this.addHierarchy(hierarchy, position))
        else
          hierarchies?.forEach(hierarchy => this.removeHierarchy(hierarchy, [classIri]))
      })
    }
  }

  private addHierarchy(hierarchy: Hierarchy, position?: Position) {
    const unionNode = hierarchy.getUnionGrapholNode(position)
    const inputEdges = hierarchy.getInputGrapholEdges()
    const inclusionEdges = hierarchy.getInclusionEdges()

    if (!unionNode || !inputEdges || !inclusionEdges)
      return

    this.diagram.addElement(unionNode)

    // Add inputs
    for (const inputClassIri of hierarchy.inputs) {
      this.addClass(inputClassIri, false)
    }

    for (const superClass of hierarchy.superclasses) {
      this.addClass(superClass.classIri, false)
    }

    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => this.diagram.addElement(inputEdge))
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => this.diagram.addElement(inclusionEdge))
  }

  private removeHierarchy(hierarchy: Hierarchy, entitiesTokeep: string[] = []) {
    if (!this.incrementalRenderer || !hierarchy.id || (hierarchy.id && this.grapholscape.renderer.cy?.$id(hierarchy.id).empty()))
      return

    // remove union node
    this.diagram.removeElement(hierarchy.id)

    // remove input edges
    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => {
      this.diagram?.removeElement(inputEdge.id)
    })

    // remove inclusion edges
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => {
      this.diagram?.removeElement(inclusionEdge.id)
    })

    let entity: GrapholEntity | null

    // remove input classes or superclasses left with no edges
    hierarchy.inputs.forEach(inputClassIri => {
      if (this.grapholscape.renderer.cy?.$id(`${inputClassIri}-${GrapholTypesEnum.CLASS}`).degree(false) === 0 &&
        !entitiesTokeep.includes(inputClassIri)) {
        entity = this.ontology.getEntity(inputClassIri)
        if (entity)
          this.removeEntity(entity)
      }
    })

    hierarchy.superclasses.forEach(superclass => {
      if (this.grapholscape.renderer.cy?.$id(`${superclass.classIri}-${GrapholTypesEnum.CLASS}`).degree(false) === 0 &&
        !entitiesTokeep.includes(superclass.classIri)) {
        entity = this.ontology.getEntity(superclass.classIri)
        if (entity)
          this.removeEntity(entity)
      }
    })
  }


  // ------------------------ SHOW CLASSES IN ISA ---------------------------------------

  showSubClassesOf(classIri: string, subclassesIris?: string[]) {
    if (!subclassesIris) {
      subclassesIris = this.neighbourhoodFinder.getSubclassesIris(classIri)
    }
    this.showClassesInIsa(classIri, subclassesIris, GrapholTypesEnum.INCLUSION)
  }

  showSuperClassesOf(classIri: string, superclassesIris?: string[]) {
    if (!superclassesIris) {
      superclassesIris = this.neighbourhoodFinder.getSuperclassesIris(classIri)
    }
    this.showClassesInIsa(classIri, superclassesIris, GrapholTypesEnum.INCLUSION, 'super')
  }

  showEquivalentClassesOf(classIri: string, equivalentClassesIris?: string[]) {
    if (!equivalentClassesIris) {
      equivalentClassesIris = this.neighbourhoodFinder.getEquivalentClassesIris(classIri)
    }
    this.showClassesInIsa(classIri, equivalentClassesIris, GrapholTypesEnum.EQUIVALENCE)
  }

  private showClassesInIsa(
    sourceIri: string,
    targetsIris: string[],
    isaType: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.EQUIVALENCE,
    subOrSuper: 'sub' | 'super' = 'sub') {

    this.performActionWithBlockedGraph(() => {
      targetsIris.forEach(targetIri => {
        this.addClass(targetIri, false)
        subOrSuper === 'super'
          ? this.diagramBuilder.addEdge(sourceIri, targetIri, isaType)
          : this.diagramBuilder.addEdge(targetIri, sourceIri, isaType)
      })
    })
  }

  /**
   * Given the iri of a class, retrieve connected object properties.
   * These object properties are inferred if the reasoner is available.
   * Otherwise only object properties directly asserted in the ontology
   * will be retrieved.
   * @param classIri 
   * @returns 
   */
  async getObjectPropertiesByClasses(classIris: string[]) {
    if (this.endpointController?.isReasonerAvailable()) {
      this.endpointController.highlightsManager?.computeHighlights(classIris)
      const branches = await this.endpointController.highlightsManager?.objectProperties()
      const objectPropertiesMap = new Map<GrapholEntity, ObjectPropertyConnectedClasses>()

      branches?.forEach(branch => {
        if (!branch.objectPropertyIRI) return

        const objectPropertyEntity = this.ontology.getEntity(branch.objectPropertyIRI)

        if (!objectPropertyEntity) return

        const connectedClasses: ObjectPropertyConnectedClasses = {
          list: [],
          direct: branch.direct || false,
        }

        branch.relatedClasses?.forEach(relatedClass => {
          const relatedClassEntity = this.ontology.getEntity(relatedClass)

          if (relatedClassEntity) {
            connectedClasses.list.push(relatedClassEntity)
          }
        })

        objectPropertiesMap.set(objectPropertyEntity, connectedClasses)
      })

      return objectPropertiesMap

    } else {
      return this.neighbourhoodFinder.getObjectProperties(classIris[0])
    }
  }

  async getDataPropertiesByClasses(classIris: string[]) {
    if (this.endpointController?.isReasonerAvailable()) {
      this.endpointController.highlightsManager?.computeHighlights(classIris)
      const dataProperties = await this.endpointController.highlightsManager?.dataProperties()
      return dataProperties
        ?.map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
        || []
    } else {
      return this.neighbourhoodFinder.getDataProperties(classIris[0])
    }
  }

  async getDataPropertiesByClassInstance(instanceIri: string) {
    const instanceEntity = this.classInstanceEntities.get(instanceIri)

    if (instanceEntity && this.endpointController?.highlightsManager) {
      this.endpointController.highlightsManager
        .computeHighlights(instanceEntity.parentClassIris.map(i => i.fullIri))

      return (await this.endpointController.highlightsManager.dataProperties())
        .map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
    } else {
      return []
    }
  }

  async expandObjectPropertiesOnInstance(instanceIri: string) {
    if (!this.endpointController?.isReasonerAvailable() || !this.endpointController.vkgApi) {
      return
    }

    const instanceEntity = this.classInstanceEntities.get(instanceIri)
    if (instanceEntity) {
      const objectProperties = await this.getObjectPropertiesByClasses(instanceEntity.parentClassIris.map(iri => iri.fullIri))
      if (objectProperties) {
        let promisesCount = 0
        this.lifecycle.trigger(IncrementalEvent.FocusStarted, instanceIri)
        const results: Map<GrapholEntity, {
          ranges: {
            classEntity: GrapholEntity,
            classInstance: ClassInstance,
          }[],
          isDirect: boolean
        }> = new Map()

        objectProperties.forEach((rangeClasses, objectPropertyEntity) => {
          results.set(objectPropertyEntity, { ranges: [], isDirect: rangeClasses.direct })
          rangeClasses.list.forEach(rangeClassEntity => {
            promisesCount += 1

            this.endpointController!.vkgApi!.getInstancesThroughObjectProperty(
              instanceIri,
              objectPropertyEntity.iri.fullIri,
              rangeClasses.direct,
              false,
              (result) => { // onNewResult
                if (result.length > 0) {
                  results.get(objectPropertyEntity)?.ranges.push({
                    classEntity: rangeClassEntity,
                    classInstance: result[0][0]
                  })
                }
              },
              [rangeClassEntity.iri.fullIri],
              undefined, undefined,
              () => { // onStopPolling
                promisesCount -= 1
              },
              1
            )
          })
        })

        const onDone = () => {
          this.addResultsFromFocus(instanceIri, results)
          this.lifecycle.trigger(IncrementalEvent.FocusFinished, instanceIri)
        }

        let interval = setInterval(() => {
          if (promisesCount === 0) {
            onDone()
            clearInterval(interval)
          }
        }, 500)

        setTimeout(() => {
          if (promisesCount > 0) {
            clearInterval(interval)
            const dialog = new GscapeConfirmDialog(`
              Focus instance [${instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language)}] took too long, reached timeout limit.
              Partial results might be shown, ok?
            `, 'Timeout Reached')

            this.grapholscape.uiContainer?.appendChild(dialog)
            dialog.onConfirm = onDone
            dialog.onCancel = () => {
              this.lifecycle.trigger(IncrementalEvent.FocusFinished, instanceIri)
            }
            dialog.show()
          }
        }, 10000)
      }
    }
  }

  focusInstance(classInstance: ClassInstance) {
    this.addInstance(classInstance)
    this.expandObjectPropertiesOnInstance(classInstance.iri)
  }

  private addResultsFromFocus(sourceInstanceIri: string, results: Map<GrapholEntity, {
    ranges: {
      classEntity: GrapholEntity,
      classInstance: ClassInstance,
    }[],
    isDirect: boolean
  }>) {
    this.performActionWithBlockedGraph(() => {
      results.forEach((result, objectPropertyEntity) => {
        result.ranges.forEach(range => {
          if (!this.classInstanceEntities.get(range.classInstance.iri)) {
            this.addInstance(range.classInstance, range.classEntity.iri.fullIri)
          }

          this.addClass(range.classEntity.iri.fullIri)
          this.addEdge(range.classInstance.iri, range.classEntity.iri.fullIri, GrapholTypesEnum.INSTANCE_OF)

          result.isDirect
            ? this.addExtensionalObjectProperty(objectPropertyEntity.iri.fullIri, sourceInstanceIri, range.classInstance.iri)
            : this.addExtensionalObjectProperty(objectPropertyEntity.iri.fullIri, range.classInstance.iri, sourceInstanceIri)
        })
      })
    })
  }

  runLayout = () => this.incrementalRenderer?.runLayout()
  pinNode = (node: NodeSingular | string) => this.incrementalRenderer?.pinNode(node)
  unpinNode = (node: NodeSingular | string) => this.incrementalRenderer?.unpinNode(node)

  postDiagramEdit(oldElemsNumber: number) {
    if (this.numberOfElements !== oldElemsNumber) {
      if (this.actionsWithBlockedGraph === 0) {
        this.runLayout()
      }
      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    } else {
      this.incrementalRenderer?.unFreezeGraph()
    }
  }

  async countInstancesForClass(classIri: string, askFreshValue = true) {
    if (!this.countersEnabled || !this.endpointController?.isReasonerAvailable()) return
    const node = this.diagram?.representation?.cy.$id(`${classIri}-${GrapholTypesEnum.CLASS}`)
    if (!node || node.empty()) return

    await this.updateMaterializedCounts()

    if (this.counts.get(classIri) === undefined) {
      if (askFreshValue)
        this.endpointController?.requestCountForClass(classIri)
    } else { // Value already present
      let instanceCountBadge: NodeButton
      const countEntry = this.counts.get(classIri)
      if (!countEntry)
        return

      if (!node.scratch('instance-count')) {
        instanceCountBadge = addBadge(node, countEntry.value, 'instance-count', 'bottom')
        setTimeout(() => instanceCountBadge.hide(), 1000)
        node.on('mouseover', () => {
          if (this.countersEnabled)
            instanceCountBadge.tippyWidget.show()
        })
        node.on('mouseout', () => instanceCountBadge.tippyWidget.hide())
      } else {
        instanceCountBadge = node.scratch('instance-count') as NodeButton
        instanceCountBadge.content = countEntry.value
      }

      if (countEntry.materialized) {
        instanceCountBadge.highlighted = false
        instanceCountBadge.title = `Date: ${countEntry.date}`
      } else {
        instanceCountBadge.highlighted = true
        instanceCountBadge.title = 'Fresh Value'
      }
    }
  }

  async updateMaterializedCounts() {
    const materializedCounts = await this.endpointController?.getMaterializedCounts()
    if (materializedCounts) {
      materializedCounts.countsMap.forEach(countEntry => {
        if (countEntry.state === QueryStatusEnum.FINISHED) {
          const currentCount = this.counts.get(countEntry.entity.entityIRI)
          if (!currentCount || currentCount.materialized) {
            this.counts.set(countEntry.entity.entityIRI, {
              value: countEntry.count,
              materialized: true,
              date: materializedCounts.endTime !== 0
                ? new Date(materializedCounts.endTime).toDateString()
                : new Date(materializedCounts.startTime).toDateString()
            })

            this.lifecycle.trigger(IncrementalEvent.NewCountResult, countEntry.entity.entityIRI, {
              value: countEntry.count,
              materialized: true,
              date: this.counts.get(countEntry.entity.entityIRI)?.date
            })
          }
        }
      })
    }
  }

  setIncrementalEventHandlers() {
    if (this.diagram.representation?.hasEverBeenRendered || this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    // const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
    this.diagram.representation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {

        const triggerSelectionEvent = () => {
          // this.diagramBuilder.referenceNodeId = evt.target.id()
          const targetIri = evt.target.data().iri

          if (targetType === GrapholTypesEnum.CLASS_INSTANCE) {
            const instanceEntity = this.classInstanceEntities.get(targetIri)
            if (instanceEntity) {
              if (targetIri !== this.lastInstanceIri)
                this.endpointController?.stopRequests('instances')

              this.lifecycle.trigger(IncrementalEvent.ClassInstanceSelection, instanceEntity)
            }
          } else {
            if (targetIri !== this.lastClassIri)
              this.endpointController?.stopRequests('instances')

            const classEntity = this.grapholscape.ontology.getEntity(targetIri)

            if (classEntity)
              this.lifecycle.trigger(IncrementalEvent.ClassSelection, classEntity)
          }
        }

        // In case of reasoning, perform update only after 500ms of no click by the user
        // Prevent query flooding
        if (this.endpointController) {
          clearTimeout(this.entitySelectionTimeout)
          this.entitySelectionTimeout = setTimeout(triggerSelectionEvent, 400)
        } else {
          triggerSelectionEvent() // otherwise no http-request will be made
        }
      }
    })

    this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set', true)
  }

  private get ontology() { return this.grapholscape.ontology }
  // public get incrementalDiagram() { return this.incrementalRenderer?.incrementalDiagram }

  private get incrementalRenderer() {
    if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      return this.grapholscape.renderer.renderState as IncrementalRendererState
    }
  }

  get numberOfElements() { return this.grapholscape.renderer.cy?.elements().size() || 0 }
}