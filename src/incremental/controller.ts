import { Grapholscape, IncrementalRendererState } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Annotation, AnnotationsKind, GrapholElement, GrapholEntity, GrapholTypesEnum, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum } from "../model";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { createEntitiesList, EntityViewData } from "../ui/util/search-entities";
import GscapeContextMenu, { Command } from "../ui/common/context-menu";
import { GscapeEntityDetails } from "../ui/entity-details";
import { GscapeEntitySelector } from "../ui/entity-selector";
import { IClassInstancesExplorer, IIncrementalDetails, IncrementalCommands } from "../ui/incremental-ui";
import GscapeIncrementalDetails from "../ui/incremental-ui/incremental-details";
import { GscapeExplorer } from "../ui/ontology-explorer";
import { WidgetEnum } from "../ui/util/widget-enum";
import grapholEntityToEntityViewData from "../util/graphol-entity-to-entity-view-data";
import VKGApi, { ClassInstance, IVirtualKnowledgeGraphApi } from "./api/kg-api";
import DiagramBuilder from "./diagram-builder";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import HighlightsManager from "./highlights-manager";
import { showParentClass } from "./ui/commands-widget/commands";
import { MastroEndpoint, RequestOptions } from "./api/model";
import { IBaseMixin } from "../ui";
import IncrementalLifecycle, { IncrementalEvent } from "./lifecycle";
import EndpointApi, { IEndpointApi } from "./api/endpoint-api";
import { EdgeSingular, NodeSingular, Position } from "cytoscape";
import EndpointController from "./endpoint-controller";

/** @internal */
export default class IncrementalController {
  private diagramBuilder: DiagramBuilder
  neighbourhoodFinder: NeighbourhoodFinder

  public classInstanceEntities: Map<string, ClassInstanceEntity> = new Map()

  public lastClassIri?: string
  public lastInstanceIri?: string

  private suggestedClassInstances: ClassInstance[] = []
  private suggestedClassInstancesRanges: ClassInstance[] = []

  endpointController?: EndpointController

  private entitySelectionTimeout: NodeJS.Timeout

  lifecycle: IncrementalLifecycle = new IncrementalLifecycle()
  on = this.lifecycle.on

  addEdge: (sourceId: string, targetId: string, edgeType: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.INPUT | GrapholTypesEnum.EQUIVALENCE | GrapholTypesEnum.INSTANCE_OF) => void;

  constructor(
    public grapholscape: Grapholscape
  ) {
    this.diagramBuilder = new DiagramBuilder(this.incrementalDiagram)
    this.addEdge = this.diagramBuilder.addEdge.bind(this.diagramBuilder)
    this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology)

    grapholscape.on(LifecycleEvent.RendererChange, newRendererState => {
      if (newRendererState === RendererStatesEnum.INCREMENTAL) {
        this.diagramBuilder.diagram = this.incrementalDiagram
      }
    })

    // update instances displayed names
    grapholscape.on(LifecycleEvent.EntityNameTypeChange, _ => {
      this.classInstanceEntities.forEach(instanceEntity => this.updateEntityNameType(instanceEntity.iri))
    })
  }

  createClassInstanceEntity(classInstance: ClassInstance) {

  }

  async performActionWithBlockedGraph(action: () => void | Promise<void>) {
    const oldElemNumbers = this.numberOfElements
    this.incrementalRenderer.freezeGraph()
    await action()
    this.postDiagramEdit(oldElemNumbers)
  }

  // getRunningEndpoints = async (): Promise<MastroEndpoint[]> => {
  //   return []
  // }

  // setEndpoint(endpoint: MastroEndpoint) {
  //   if (!this.vKGApi) {
  //     if (this.grapholscape.mastroRequestOptions) {
  //       this.vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, endpoint)

  //       if (this.highlightsManager) {
  //         this.highlightsManager.vkgApi = this.vKGApi
  //       } else {
  //         this.highlightsManager = new HighlightsManager(this.vKGApi)
  //       }
  //     }
  //   } else {
  //     this.vKGApi?.setEndpoint(endpoint)
  //   }

  //   this.lifecycle.trigger(IncrementalEvent.EndpointChange, endpoint)
  // }

  // private initEndpointController() {
  //   if (this.grapholscape.buttonsTray && this.grapholscape.mastroRequestOptions) {
  //     this.endpointController = new EndpointController(this.grapholscape.buttonsTray, this.grapholscape.mastroRequestOptions)
  //     this.endpointController.onEndpointChange(newEndpoint => {
  //       const confirmDialog = new GscapeConfirmDialog(`Are you sure? \nIf you change the current endpoint, your exploration will be reset.`)
  //       this.grapholscape.uiContainer?.appendChild(confirmDialog)
  //       confirmDialog.show()
  //       confirmDialog.onConfirm = () => {
  //         this.initApi(newEndpoint)
  //         this.endpointController!.selectedEndpoint = newEndpoint
  //         this.reset()
  //       }
  //     })

  //     this.endpointController.onAutoEndpointSelection(this.initApi.bind(this))

  //     this.endpointController.updateEndpointList()
  //   }
  // }

  /**
   * @internal
   * 
   * Create new EndpointApi object with actual mastro request options
   */
  setMastroConnection(mastroRequestOptions: RequestOptions) {
    // if (this.grapholscape.mastroRequestOptions) {
    //   this.endpointApi = new EndpointApi(this.grapholscape.mastroRequestOptions)
    //   this.getRunningEndpoints = this.endpointApi.getRunningEndpoints
    // }
    this.reset()
    this.endpointController = new EndpointController(mastroRequestOptions, this.lifecycle)
    this.lifecycle.trigger(IncrementalEvent.ReasonerSet)
  }

  // addEntity(entity: GrapholEntity) {
  //   this.entitySelector.hide()
  //   this.incrementalRenderer.freezeGraph()

  //   if (entity.is(GrapholTypesEnum.CLASS_INSTANCE) && (entity as ClassInstanceEntity).parentClassIris !== undefined) {
  //     this.classInstanceEntities.set(entity.iri.fullIri, entity as ClassInstanceEntity)
  //     this.diagramBuilder.addClassInstance(entity.iri.fullIri)
  //   }

  //   // this.diagramBuilder.addEntity(iri)
  //   this.postDiagramEdit()
  // }

  addEntity(iri: string, centerOnIt = true) {
    const entity = this.grapholscape.ontology.getEntity(iri)

    if (entity && this.diagramBuilder.diagram.representation) {
      this.diagramBuilder.addEntity(entity)

      this.updateEntityNameType(entity.iri)
      if (centerOnIt)
        this.grapholscape.centerOnElement(iri)
    }
  }

  // init() {
  //   this.updateWidget()
  //   if (!this.endpointController) {
  //     // this.initEndpointController()
  //   }
  //   this.endpointController?.showView()
  //   this.setIncrementalEventHandlers()
  //   this.incrementalDetails.reset()
  //   this.incrementalDetails.onObjectPropertySelection = this.addIntensionalObjectProperty.bind(this)
  //   this.entitySelector.onClassSelection((iri: string) => {
  //     this.entitySelector.hide()
  //     this.incrementalRenderer.freezeGraph()
  //     this.diagramBuilder.addEntity(iri)
  //     this.postDiagramEdit()
  //   })

  //   this.endpointController?.onLimitChange(this.changeInstancesLimit.bind(this))
  //   this.endpointController?.onStopRequests(() => {
  //     if (this.isReasonerEnabled) {
  //       this.vKGApi?.stopAllQueries()
  //     }
  //   })

  //   setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.ontology)
  // }

  // private updateWidget() {
  //   this.incrementalDetails = this.grapholscape.widgets.get(WidgetEnum.CLASS_INSTANCE_DETAILS) as GscapeIncrementalDetails
  //   this.entitySelector = this.grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  // }

  // private async buildDetailsForInstance(instanceIri: string) {
  //   if (!this.incrementalDetails) return

  //   this.incrementalDetails.canShowInstances = false
  //   this.incrementalDetails.canShowDataPropertiesValues = true
  //   this.incrementalDetails.canShowObjectPropertiesRanges = true

  //   const instanceEntity = this.diagram.classInstances?.get(instanceIri)
  //   if (instanceEntity) {
  //     let shouldUpdate = false
  //     const parentClasses: EntityViewData[] = []
  //     instanceEntity.parentClassIris.forEach(parentClassIri => {
  //       this.addDataPropertiesDetails(parentClassIri.fullIri)
  //       this.addObjectPropertiesDetails(parentClassIri.fullIri)

  //       const parentClassEntity = this.grapholscape.ontology.getEntity(parentClassIri.fullIri)
  //       if (parentClassEntity)
  //         parentClasses.push(grapholEntityToEntityViewData(parentClassEntity, this.grapholscape))
  //     })

  //     this.incrementalDetails.parentClasses = parentClasses
  //     this.incrementalDetails.onParentClassSelection = (parentClassIri: string) => this.addInstanceParentClass(instanceEntity, parentClassIri)

  //     // Check if the last classes used for highlights matches with parentClasses of selected instance
  //     // If it matches, no need to update highlights and values
  //     for (const parentClassIri of instanceEntity.parentClassIris) {
  //       if (!this.highlightsManager?.lastClassIris.includes(parentClassIri.fullIri) &&
  //         this.highlightsManager?.lastClassIris.length !== instanceEntity.parentClassIris.size
  //       ) {
  //         shouldUpdate = true
  //         break
  //       }
  //     }

  //     if (shouldUpdate || this.lastInstanceIri !== instanceIri) {
  //       this.lastInstanceIri = instanceIri
  //       // init data properties values and recalculate them all
  //       const dataPropertiesValues = new Map<string, { values: string[], loading?: boolean }>();
  //       const dataProperties = await this.highlightsManager?.dataProperties()
  //       dataProperties?.forEach(dpIri => {
  //         dataPropertiesValues.set(dpIri, { values: [], loading: true })
  //       })

  //       this.incrementalDetails.setDataPropertiesValues(dataPropertiesValues)

  //       dataProperties?.forEach(dpIri => {
  //         this.vKGApi?.getInstanceDataPropertyValues(instanceIri, dpIri,
  //           (res) => {
  //             if (instanceIri === this.lastInstanceIri)
  //               this.incrementalDetails.addDataPropertiesValues(dpIri, res)
  //           }, // onNewResults
  //           () => this.onStopDataPropertyValueQuery(instanceIri, dpIri)) // onStop
  //       })

  //       const objectPropertiesRanges = new Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>()
  //       let rangeMap: Map<string, { values: EntityViewData[], loading?: boolean }>

  //       const objectProperties = await this.highlightsManager?.objectProperties()

  //       // init ranges map with empty arrays and all loading
  //       objectProperties?.forEach(opBranch => {
  //         if (opBranch.objectPropertyIRI) {
  //           rangeMap = new Map<string, { values: EntityViewData[], loading?: boolean }>()
  //           opBranch.relatedClasses?.forEach(rangeClass => {
  //             rangeMap.set(rangeClass, { values: [], loading: false })
  //           })

  //           objectPropertiesRanges.set(opBranch.objectPropertyIRI, rangeMap)
  //         }
  //       })

  //       this.suggestedClassInstancesRanges = []
  //       this.incrementalDetails.setObjectPropertyRanges(objectPropertiesRanges)
  //       this.incrementalDetails.onGetRangeInstances = (objectPropertyIri, rangeClassIri) => {
  //         this.onGetRangeInstances(instanceIri, objectPropertyIri, rangeClassIri)
  //       }

  //       this.incrementalDetails.onInstanceObjectPropertySelection = this.addInstanceObjectProperty.bind(this)
  //     }
  //   }
  // }

  // private buildDetailsForClass(classIri: string) {
  //   if (!this.incrementalDetails) return

  //   this.addDataPropertiesDetails(classIri)
  //   this.addObjectPropertiesDetails(classIri)

  //   if (this.isReasonerEnabled) {
  //     this.incrementalDetails.canShowDataPropertiesValues = false
  //     this.incrementalDetails.canShowObjectPropertiesRanges = false
  //     this.incrementalDetails.parentClasses = undefined
  //     this.incrementalDetails.canShowInstances = true

  //     this.incrementalDetails.onGetInstances = () => this.onGetInstances(classIri)
  //     this.incrementalDetails.onInstanceSelection = this.addInstance.bind(this)
  //     this.incrementalDetails.onEntitySearch = (searchText) => this.onGetInstances(classIri, searchText)
  //     this.incrementalDetails.onEntitySearchByDataPropertyValue = (dataPropertyIri, searchText) => this.onGetInstancesByDataPropertyValue(classIri, dataPropertyIri, searchText)

  //     if (classIri !== this.lastClassIri) {
  //       this.incrementalDetails.setInstances([])
  //       this.suggestedClassInstances = []
  //       this.incrementalDetails.isInstanceCounterLoading = true
  //       this.incrementalDetails.areInstancesLoading = true
  //       // Ask instance number
  //       this.vKGApi?.getInstancesNumber(
  //         classIri,
  //         (count) => { // onResult
  //           this.incrementalDetails.isInstanceCounterLoading = false
  //           this.incrementalDetails.instanceCount = count
  //         },
  //         () => this.incrementalDetails.isInstanceCounterLoading = false
  //       )
  //     }
  //   }

  //   this.lastClassIri = classIri
  // }

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
      const connectedEdges = this.grapholscape.renderer.cy?.$id(subClassIri)
        .connectedEdges(`[ type ="${positionType === 'equivalent' ? GrapholTypesEnum.EQUIVALENCE : GrapholTypesEnum.INCLUSION}" ]`)

      if (connectedEdges) {
        if (positionType === 'sub' && connectedEdges.targets(`[id = "${classIri}"]`).empty())
          return false

        if (positionType === 'super' && connectedEdges.sources(`[id = "${classIri}"]`).empty())
          return false

        if (positionType === 'equivalent' && connectedEdges.connectedNodes(`[id = "${classIri}"]`).empty())
          return false
      }
    }

    return true
  }


  // private addDataPropertiesDetails(classIri: string) {
  //   this.getDataPropertiesByClass(classIri).then(dataProperties => {
  //     this.incrementalDetails.setDataProperties(dataProperties.map(dp => grapholEntityToEntityViewData(dp, this.grapholscape)))
  //   })
  // }

  // private addObjectPropertiesDetails(classIri: string) {
  //   // OBJECT PROPERTIES
  //   this.getObjectProperties(classIri).then(objectProperties => {
  //     if (objectProperties) {
  //       this.incrementalDetails.setObjectProperties(Array.from(objectProperties).map(v => {
  //         return {
  //           objectProperty: grapholEntityToEntityViewData(v[0], this.grapholscape),
  //           connectedClasses: v[1].connectedClasses.map(classEntity => {
  //             return grapholEntityToEntityViewData(classEntity, this.grapholscape)
  //           }),
  //           direct: v[1].direct,
  //         }
  //       }))
  //     }
  //   })
  // }

  reset() {
    if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      this.incrementalRenderer.createNewDiagram()
      this.diagramBuilder.diagram = this.incrementalDiagram
      this.classInstanceEntities.clear()
      // this.entitySelector.show()
      if (this.grapholscape.renderer.diagram)
        setGraphEventHandlers(this.grapholscape.renderer.diagram, this.grapholscape.lifecycle, this.ontology)

      this.setIncrementalEventHandlers()
      // this.incrementalDetails.reset()
      // const entityDetails = this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
      // entityDetails.hide()
    }

    this.clearState()
    this.lifecycle.trigger(IncrementalEvent.Reset)
  }

  clearState() {
    // this.lastClassIri = undefined
    // this.lastInstanceIri = undefined
    this.endpointController?.clear()
  }

  private updateEntityNameType(entityOrIri: string | Iri) {
    let entityIri: string
    if (typeof (entityOrIri) !== 'string') {
      entityIri = entityOrIri.fullIri
    } else {
      entityIri = entityOrIri
    }

    const entity = this.classInstanceEntities.get(entityIri) || this.ontology.getEntity(entityIri)
    let entityElement = this.incrementalDiagram.representation?.grapholElements.get(entityIri)
    let entityElements: GrapholElement[] | undefined

    // can't find element? look for occurrences, not every entity has id=iri
    if (entity && !entityElement) {
      entityElements = entity.occurrences.get(this.incrementalRenderer.id)?.map(occurrence => {
        return this.incrementalDiagram.representation?.grapholElements.get(occurrence.elementId) as GrapholElement
      }).filter(e => e !== undefined)
    } else if (entityElement) {
      entityElements = [entityElement]
    }

    if (entity && entityElements) {
      // set the displayed name based on current entity name type
      entityElements.forEach(element => {
        element.displayedName = entity.getDisplayedName(
          this.grapholscape.entityNameType,
          this.grapholscape.language,
          this.ontology.languages.default
        )
        this.incrementalDiagram.representation?.updateElement(element, false)
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
                  this.incrementalRenderer.removeElement(neighbourElement.id())
                }
              }
            } else {
              // edges must be removed anyway
              // (cytoscape removes them automatically
              // but we need to update the grapholElements 
              // map too in diagram representation)
              this.incrementalRenderer.removeElement((neighbourElement as EdgeSingular).id())
            }
          })

          this.ontology.hierarchiesBySubclassMap.get(entity!.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })

          this.ontology.hierarchiesBySuperclassMap.get(entity!.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })
        }

        this.incrementalRenderer.removeElement(element.id())
        entity?.removeOccurrence(element.id(), this.incrementalDiagram.id, RendererStatesEnum.INCREMENTAL)

        if (entity?.is(GrapholTypesEnum.CLASS_INSTANCE))
          this.classInstanceEntities.delete(entity.iri.fullIri)
      })
    })
  }

  addInstance(instance: ClassInstance, parentClassesIris?: string[] | string) {
    let classInstanceEntity = this.classInstanceEntities.get(instance.iri)
    if (classInstanceEntity) {
      return classInstanceEntity
    }

    // if (!this.diagramBuilder.referenceNodeId) return
    let parentClassEntity: GrapholEntity | null | undefined
    const classInstanceIri = new Iri(instance.iri, this.ontology.namespaces, instance.shortIri)

    classInstanceEntity = new ClassInstanceEntity(classInstanceIri)

    if (instance.label) {
      classInstanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, instance.label))
    }

    this.diagramBuilder.addClassInstance(classInstanceEntity)
    this.classInstanceEntities.set(instance.iri, classInstanceEntity)

    if (typeof (parentClassesIris) !== 'string') {

      if (!parentClassesIris) {
        parentClassesIris = this.ontology.getEntitiesByType(GrapholTypesEnum.CLASS).map(entity => entity.iri.fullIri)
      }

      this.endpointController?.instanceCheck(instance.iri, parentClassesIris).then(result => {
        result.forEach(classIri => {
          const classEntity = this.ontology.getEntity(classIri)
          if (classEntity && classInstanceEntity) {
            if (classInstanceEntity.parentClassIris) {
              classInstanceEntity.parentClassIris.push(classEntity.iri)
            } else {
              classInstanceEntity.parentClassIris = [classEntity.iri]
            }
          }
        })
      })

    } else {
      parentClassEntity = this.ontology.getEntity(parentClassesIris)
      if (parentClassEntity)
        classInstanceEntity.parentClassIris = [parentClassEntity.iri]
    }

    this.updateEntityNameType(classInstanceEntity.iri)
    this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    return classInstanceEntity

    // const parentClassEntity = this.ontology.getEntity(this.diagramBuilder.referenceNodeId)

    // if (parentClassEntity) {
    //   const suggestedClassInstance = this.suggestedClassInstances.find(c => c.iri === instanceIriString)

    //   if (!suggestedClassInstance) return

    //   if (!this.diagram.classInstances) {
    //     this.diagram.classInstances = new Map()
    //   }

    //   const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance?.shortIri)
    //   let instanceEntity: ClassInstanceEntity | undefined

    //   instanceEntity = this.diagram.classInstances.get(instanceIriString)

    //   if (!instanceEntity) {
    //     instanceEntity = new ClassInstanceEntity(instanceIri)
    //     this.diagram.classInstances.set(instanceIriString, instanceEntity)

    //     // Set label as annotation
    //     if (suggestedClassInstance.label) {
    //       instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
    //     }
    //   }

    //   instanceEntity.parentClassIris.add(parentClassEntity.iri)

    //   this.incrementalRenderer.freezeGraph()
    //   this.diagramBuilder.addClassInstance(instanceIriString)
    //   this.connectInstanceToParentClasses(instanceEntity)
    //   const addedInstance = this.diagram.representation?.grapholElements.get(instanceIriString)
    //   if (addedInstance) {
    //     addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default)
    //     this.diagram.representation?.updateElement(addedInstance, false)
    //   }

    //   this.postDiagramEdit()
    //   this.grapholscape.centerOnElement(instanceIriString)
    // }
  }

  // async addInstanceObjectProperty(instanceIriString: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) {
  //   if (!this.diagramBuilder.referenceNodeId) return

  //   const parentClassEntity = this.ontology.getEntity(parentClassIri)

  //   if (parentClassEntity) {
  //     const suggestedClassInstance = this.suggestedClassInstancesRanges.find(c => c.iri === instanceIriString)
  //     const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance?.shortIri)
  //     const instanceEntity = new ClassInstanceEntity(instanceIri, parentClassEntity.iri)

  //     if (!suggestedClassInstance) return

  //     // Set label as annotation
  //     if (suggestedClassInstance.label) {
  //       instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
  //     }

  //     // (await this.vKGApi?.getHighlights(parentClassIri))?.dataProperties?.forEach(dpIri => {
  //     //   instanceEntity.addDataProperty(dpIri)
  //     // })

  //     if (!this.diagram.classInstances) {
  //       this.diagram.classInstances = new Map()
  //     }

  //     this.diagram.classInstances.set(instanceIriString, instanceEntity)
  //     this.incrementalRenderer.freezeGraph()
  //     this.diagramBuilder.addInstanceObjectProperty(objectPropertyIri, instanceIriString, direct)
  //     const addedInstance = this.diagram.representation?.grapholElements.get(instanceIriString)
  //     if (addedInstance) {
  //       addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default)
  //       this.diagram.representation?.updateElement(addedInstance, false)
  //       this.connectInstanceToParentClasses(instanceEntity)
  //     }

  //     this.postDiagramEdit()
  //     this.grapholscape.centerOnElement(instanceIriString)
  //   }
  // }

  /**
   * Called when the user trigger the toggle for showing data properties.
   * Given the state of the toggle and the list of dataproperties it is
   * controlling, use diagram builder to add or remove them
   * @param enabled 
   * @param dataProperties
   */
  // toggleDataProperties(enabled: boolean, dataProperties: GrapholEntity[]) {
  //   if (enabled) {
  //     dataProperties.forEach(dataProperty => this.diagramBuilder.addEntity(dataProperty.iri.fullIri))
  //   } else {
  //     dataProperties.forEach(dataProperty => this.diagramBuilder.removeEntity(dataProperty.iri.fullIri))
  //   }

  //   if (dataProperties.length > 0)
  //     this.postDiagramEdit()
  // }

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
        this.diagramBuilder.addObjectProperty(objectPropertyEntity, sourceClass, targetClass)

        this.updateEntityNameType(objectPropertyEntity.iri)
        this.updateEntityNameType(sourceClassIri)
        this.updateEntityNameType(targetClassIri)
      })
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
          targetInstanceEntity
        )

        this.updateEntityNameType(objectPropertyEntity.iri)
        this.updateEntityNameType(sourceInstanceEntity.iri)
        this.updateEntityNameType(targetInstanceEntity.iri)
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
        const position = this.grapholscape.renderer.cy?.$id(classIri).position()
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

    this.incrementalDiagram.addElement(unionNode)

    // Add inputs
    for (const inputClassIri of hierarchy.inputs) {
      this.addEntity(inputClassIri, false)
    }

    for (const superClass of hierarchy.superclasses) {
      this.addEntity(superClass.classIri, false)
    }

    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => this.incrementalDiagram.addElement(inputEdge))
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => this.incrementalDiagram.addElement(inclusionEdge))
  }

  private removeHierarchy(hierarchy: Hierarchy, entitiesTokeep: string[] = []) {
    if (!hierarchy.id || (hierarchy.id && this.grapholscape.renderer.cy?.$id(hierarchy.id).empty()))
      return

    // remove union node
    this.incrementalRenderer.removeElement(hierarchy.id)

    // remove input edges
    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => {
      this.incrementalRenderer.removeElement(inputEdge.id)
    })

    // remove inclusion edges
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => {
      this.incrementalRenderer.removeElement(inclusionEdge.id)
    })

    let entity: GrapholEntity | null

    // remove input classes or superclasses left with no edges
    hierarchy.inputs.forEach(inputClassIri => {
      if (this.grapholscape.renderer.cy?.$id(inputClassIri).degree(false) === 0 &&
        !entitiesTokeep.includes(inputClassIri)) {
        entity = this.ontology.getEntity(inputClassIri)
        if (entity)
          this.removeEntity(entity)
      }
    })

    hierarchy.superclasses.forEach(superclass => {
      if (this.grapholscape.renderer.cy?.$id(superclass.classIri).degree(false) === 0 &&
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
        this.addEntity(targetIri, false)
        subOrSuper === 'super'
          ? this.diagramBuilder.addEdge(sourceIri, targetIri, isaType)
          : this.diagramBuilder.addEdge(targetIri, sourceIri, isaType)
      })
    })
  }

  // connectInstanceToParentClasses(instanceEntity: ClassInstanceEntity) {
  //   instanceEntity.parentClassIris.forEach(parentClassIri => {
  //     this.diagramBuilder.addInstanceOfEdge(instanceEntity.iri.fullIri, parentClassIri.fullIri)
  //   })
  // }

  // addInstanceParentClass(classInstanceEntity: ClassInstanceEntity, parentClassIri: string) {
  //   const oldElemNumbers = this.diagramBuilder.diagram.representation?.grapholElements.size
  //   this.diagramBuilder.addEntity(parentClassIri)
  //   this.connectInstanceToParentClasses(classInstanceEntity)

  //   if (oldElemNumbers !== this.diagramBuilder.diagram.representation?.grapholElements.size)
  //     this.postDiagramEdit()

  //   this.grapholscape.centerOnElement(parentClassIri)
  // }

  // requestInstancesForClass(classIri: string, searchText?: string) {
  //   // this.incrementalDetails.areInstancesLoading = true

  //   // if it's a search, clear instances list
  //   // if (searchText !== undefined)
  //   //   this.incrementalDetails.setInstances([])

  //   if (!this.endpointController) return

  //   this.endpointController.getInstances(
  //     classIri,
  //     this.onNewInstancesForDetails.bind(this), // onNewResults
  //     () => this.onStopInstanceLoading(classIri), // onStop
  //     searchText
  //   )
  // }

  // private onGetInstancesByDataPropertyValue(classIri: string, dataPropertyIri: string, dataPropertyValue: string) {
  //   this.incrementalDetails.areInstancesLoading = true
  //   this.incrementalDetails.setInstances([])

  //   this.vKGApi!.getInstancesByDataPropertyValue(
  //     classIri,
  //     dataPropertyIri,
  //     dataPropertyValue,
  //     this.onNewInstancesForDetails.bind(this), // onNewResults
  //     () => this.onStopInstanceLoading(classIri) // onStop
  //   )
  // }

  // private async onGetRangeInstances(instanceIri: string, objectPropertyIri: string, rangeClassIri: string) {
  //   this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, true)
  //   const isDirect = (await this.highlightsManager?.objectProperties())?.find(op => op.objectPropertyIRI === objectPropertyIri)?.direct || false

  //   this.vKGApi?.getInstanceObjectPropertyRanges(instanceIri, objectPropertyIri, isDirect, rangeClassIri,
  //     (instances) => this.onNewInstanceRangesForDetails(instances, objectPropertyIri, rangeClassIri), // onNewResults
  //     () => this.onStopObjectPropertyRangeValueQuery(instanceIri, objectPropertyIri, rangeClassIri) // onStop
  //   )
  // }

  private onNewInstancesForDetails(instances: ClassInstance[]) {
    // this.suggestedClassInstances = instances

    // this.incrementalDetails.setInstances(instances.map(instance => {
    //   let instanceEntity = this.getInstanceEntityFromClassInstance(instance)
    //   return {
    //     displayedName: instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language),
    //     value: instanceEntity
    //   }
    // }))
  }

  // private onNewInstanceRangesForDetails(instances: ClassInstance[], objectPropertyIri: string, rangeClassIri: string) {
  //   this.suggestedClassInstancesRanges.push(...instances)
  //   const instancesEntities = instances.map(i =>
  //     grapholEntityToEntityViewData(this.getInstanceEntityFromClassInstance(i), this.grapholscape)
  //   )

  //   this.incrementalDetails.addObjectPropertyRangeInstances(objectPropertyIri, rangeClassIri, instancesEntities)
  // }

  /**
   * Given the iri of a class, retrieve connected object properties.
   * These object properties are inferred if the reasoner is available.
   * Otherwise only object properties directly asserted in the ontology
   * will be retrieved.
   * @param classIri 
   * @returns 
   */
  async getObjectPropertiesByClasses(classIris: string[]) {
    if (this.endpointController) {
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
    if (this.endpointController) {
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

    if (instanceEntity?.parentClassIris && this.endpointController?.highlightsManager) {
      this.endpointController.highlightsManager
        .computeHighlights(instanceEntity.parentClassIris.map(i => i.fullIri))

      return (await this.endpointController.highlightsManager.dataProperties())
        .map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
    } else {
      return []
    }
  }

  private onStopDataPropertyValueQuery(instanceIri: string, dataPropertyIri: string) {
    // if there is a new instance iri, loading will be stopped by new requests
    // if (instanceIri === this.lastInstanceIri) {
    //   this.incrementalDetails.setDataPropertyLoading(dataPropertyIri, false)
    // }
  }

  // private onStopInstanceLoading(classIri: string) {
  //   if (classIri === this.lastClassIri) {
  //     this.incrementalDetails.areInstancesLoading = false
  //   }
  // }

  // private onStopObjectPropertyRangeValueQuery(instanceIri: string, objectPropertyIri: string, rangeClassIri: string) {
  //   if (instanceIri === this.lastInstanceIri) {
  //     this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, false)
  //   }
  // }

  runLayout = () => this.incrementalRenderer.runLayout()
  pinNode = (node: NodeSingular | string) => this.incrementalRenderer.pinNode(node)
  unpinNode = (node: NodeSingular | string) => this.incrementalRenderer.unpinNode(node)

  postDiagramEdit(oldElemsNumber: number) {
    if (this.numberOfElements !== oldElemsNumber) {
      this.runLayout()
      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    } else {
      this.incrementalRenderer.unFreezeGraph()
    }
  }

  setIncrementalEventHandlers() {
    this.incrementalRenderer.onContextClick(target => {
      const entity = this.classInstanceEntities.get(target.data().iri) || this.ontology.getEntity(target.data().iri)
      if (entity)
        this.lifecycle.trigger(IncrementalEvent.ContextClick, entity)
    })

    if (this.incrementalDiagram.representation?.hasEverBeenRendered || this.incrementalDiagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    // const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
    this.incrementalRenderer.diagramRepresentation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {

        const triggerSelectionEvent = () => {
          // this.diagramBuilder.referenceNodeId = evt.target.id()
          const targetIri = evt.target.data().iri

          if (targetType === GrapholTypesEnum.CLASS_INSTANCE) {
            const instanceEntity = this.classInstanceEntities.get(targetIri)
            if (instanceEntity) {
              // this.highlightsManager?.computeHighlights(Array.from(instanceEntity.parentClassIris).map(iri => iri.fullIri));
              // (this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails).setGrapholEntity(instanceEntity)

              if (targetIri !== this.lastInstanceIri)
                this.endpointController?.stopRequests()

              this.lifecycle.trigger(IncrementalEvent.ClassInstanceSelection, instanceEntity)
              // this.buildDetailsForInstance(targetIri)
            }
          } else {
            // this.highlightsManager?.computeHighlights(targetIri)

            if (targetIri !== this.lastClassIri)
              this.endpointController?.stopRequests()

            const classEntity = this.grapholscape.ontology.getEntity(targetIri)

            if (classEntity)
              this.lifecycle.trigger(IncrementalEvent.ClassSelection, classEntity)
            // this.buildDetailsForClass(targetIri)
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

        // this.incrementalDetails.show()
      } else {
        // this.incrementalDetails.hide()
      }
    })

    this.incrementalDiagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set', true)
  }

  private get ontology() { return this.grapholscape.ontology }
  public get incrementalDiagram() { return this.incrementalRenderer.incrementalDiagram }
  // private get vKGApi() {
  //   // if (this.grapholscape.mastroRequestOptions && !this._vKGApi) {
  //   //   if (this.endpointController?.selectedEndpoint)
  //   //     this._vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, this.endpointController?.selectedEndpoint)
  //   //   else
  //   //     this.initEndpointController()
  //   // }

  //   return this._vKGApi
  // }

  private getInstanceEntityFromClassInstance(classInstance: ClassInstance) {
    const instanceIri = new Iri(classInstance.iri, this.ontology.namespaces, classInstance.shortIri)
    const instanceEntity = new GrapholEntity(instanceIri, GrapholTypesEnum.CLASS_INSTANCE)
    if (classInstance.label) {
      instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, classInstance.label))
    }

    return instanceEntity
  }

  private get incrementalRenderer() { return this.grapholscape.renderer.renderState as IncrementalRendererState }

  get numberOfElements() { return this.grapholscape.renderer.cy?.elements().size() || 0 }
}