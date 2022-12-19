import { Grapholscape, IncrementalRendererState } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Annotation, AnnotationsKind, GrapholEntity, GrapholTypesEnum, Iri, RendererStatesEnum } from "../model";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { createEntitiesList, EntityViewData } from "../ui/util/search-entities";
import GscapeContextMenu, { Command } from "../ui/common/context-menu";
import { GscapeEntityDetails } from "../ui/entity-details";
import GscapeEntitySelector from "../ui/entity-selector/entity-selector";
import { IncrementalCommands } from "../ui/incremental-ui";
import GscapeIncrementalDetails from "../ui/incremental-ui/incremental-details";
import { GscapeExplorer } from "../ui/ontology-explorer";
import { WidgetEnum } from "../ui/util/widget-enum";
import grapholEntityToEntityViewData from "../util/graphol-entity-to-entity-view-data";
import VKGApi, { ClassInstance, IVirtualKnowledgeGraphApi } from "./api/kg-api";
import DiagramBuilder from "./diagram-builder";
import EndpointController from "./endpoint-controller";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import HighlightsManager from "./highlights-manager";
import { showParentClass } from "../ui/incremental-ui/commands";
import GscapeConfirmDialog from "../ui/incremental-ui/confirm-dialog";
import { MastroEndpoint } from "./api/model";

export default class IncrementalController {
  private diagramBuilder: DiagramBuilder
  private vKGApi?: IVirtualKnowledgeGraphApi
  private neighbourhoodFinder: NeighbourhoodFinder

  private incrementalDetails: GscapeIncrementalDetails
  private entitySelector: GscapeEntitySelector

  private lastClassIri?: string
  private lastInstanceIri?: string

  private suggestedClassInstances: ClassInstance[] = []
  private suggestedClassInstancesRanges: ClassInstance[] = []

  private commandsWidget = new GscapeContextMenu()

  private endpointController?: EndpointController
  private highlightsManager?: HighlightsManager

  constructor(
    private grapholscape: Grapholscape
  ) {
    this.diagramBuilder = new DiagramBuilder(this.ontology, this.diagram)
    this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology)
  }

  private initEndpointController() {
    if (this.grapholscape.buttonsTray && this.grapholscape.mastroRequestOptions) {
      this.endpointController = new EndpointController(this.grapholscape.buttonsTray, this.grapholscape.mastroRequestOptions)
      this.endpointController.onEndpointChange(newEndpoint => {
        const confirmDialog = new GscapeConfirmDialog(`Are you sure? \nIf you change the actual endpoint, your exploration will be reset.`)
        this.grapholscape.uiContainer?.appendChild(confirmDialog)
        confirmDialog.show()
        confirmDialog.onConfirm = () => {
          this.initApi(newEndpoint)
          this.endpointController!.selectedEndpoint = newEndpoint
          this.reset()
        }
      })

      this.endpointController.onAutoEndpointSelection(this.initApi.bind(this))

      this.endpointController.updateEndpointList()
    }
  }

  private initApi(endpoint: MastroEndpoint) {
    if (!this.vKGApi) {
      if (this.grapholscape.mastroRequestOptions)
        this.vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, endpoint)
      if (this.highlightsManager) {
        this.highlightsManager.vkgApi = this.vKGApi!
      } else {
        this.highlightsManager = new HighlightsManager(this.vKGApi!)
      }
    } else {
      this.vKGApi?.setEndpoint(endpoint)
    }
  }

  init() {
    this.updateWidget()
    if (!this.endpointController) {
      this.initEndpointController()
    }
    this.endpointController?.showView()
    this.setIncrementalEventHandlers()
    this.incrementalDetails.reset()
    this.incrementalDetails.onObjectPropertySelection = this.addIntensionalObjectProperty.bind(this)
    this.entitySelector.onClassSelection((iri: string) => {
      this.entitySelector.hide()
      this.incrementalRenderer.freezeGraph()
      this.diagramBuilder.addEntity(iri)
      this.postDiagramEdit()
    })

    this.endpointController?.onLimitChange(this.changeInstancesLimit.bind(this))

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.ontology)
  }

  private updateWidget() {
    this.incrementalDetails = this.grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails
    this.entitySelector = this.grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  }

  private async buildDetailsForInstance(instanceIri: string) {
    if (!this.incrementalDetails) return

    this.incrementalDetails.canShowInstances = false
    this.incrementalDetails.canShowDataPropertiesValues = true
    this.incrementalDetails.canShowObjectPropertiesRanges = true

    const instanceEntity = this.diagram.classInstances?.get(instanceIri)
    if (instanceEntity) {
      let shouldUpdate = false

      instanceEntity.parentClassIris.forEach(parentClassIri => {
        this.addDataPropertiesDetails(parentClassIri.fullIri)
        this.addObjectPropertiesDetails(parentClassIri.fullIri)
      })

      // Check if the last classes used for highlights matches with parentClasses of selected instance
      // If it matches, no need to update highlights and values
      for (const parentClassIri of instanceEntity.parentClassIris) {
        if (!this.highlightsManager?.lastClassIris.includes(parentClassIri.fullIri) &&
          this.highlightsManager?.lastClassIris.length !== instanceEntity.parentClassIris.size
        ) {
          shouldUpdate = true
          break
        }
      }

      if (shouldUpdate || this.lastInstanceIri !== instanceIri) {

        // init data properties values and recalculate them all
        const dataPropertiesValues = new Map<string, { values: string[], loading?: boolean }>();
        const dataProperties = await this.highlightsManager?.dataProperties()
        dataProperties?.forEach(dpIri => {
          dataPropertiesValues.set(dpIri, { values: [], loading: true })
        })

        this.incrementalDetails.setDataPropertiesValues(dataPropertiesValues)

        dataProperties?.forEach(dpIri => {
          this.vKGApi?.getInstanceDataPropertyValues(instanceIri, dpIri,
            (res) => this.incrementalDetails.addDataPropertiesValues(dpIri, res), // onNewResults
            () => this.onStopDataPropertyValueQuery(instanceIri, dpIri)) // onStop
        })

        const objectPropertiesRanges = new Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>()
        let rangeMap: Map<string, { values: EntityViewData[], loading?: boolean }>

        const objectProperties = await this.highlightsManager?.objectProperties()

        // init ranges map with empty arrays and all loading
        objectProperties?.forEach(opBranch => {
          if (opBranch.objectPropertyIRI) {
            opBranch.relatedClasses?.forEach(rangeClass => {
              rangeMap = new Map<string, { values: EntityViewData[], loading?: boolean }>()
              rangeMap.set(rangeClass, { values: [], loading: false })

              objectPropertiesRanges.set(opBranch.objectPropertyIRI!, rangeMap)
            })
          }
        })

        this.suggestedClassInstancesRanges = []
        this.incrementalDetails.setObjectPropertyRanges(objectPropertiesRanges)
        this.incrementalDetails.onGetRangeInstances = (objectPropertyIri, rangeClassIri) => {
          this.onGetRangeInstances(instanceIri, objectPropertyIri, rangeClassIri)
        }

        this.incrementalDetails.onInstanceObjectPropertySelection = this.addInstanceObjectProperty.bind(this)

        this.lastInstanceIri = instanceIri
      }
    }
  }

  private buildDetailsForClass(classIri: string) {
    if (!this.incrementalDetails) return

    this.addDataPropertiesDetails(classIri)
    this.addObjectPropertiesDetails(classIri)

    if (this.isReasonerEnabled) {
      this.incrementalDetails.canShowDataPropertiesValues = false
      this.incrementalDetails.canShowObjectPropertiesRanges = false
      this.incrementalDetails.canShowInstances = true

      this.incrementalDetails.onGetInstances = () => this.onGetInstances(classIri)
      this.incrementalDetails.onInstanceSelection = this.addInstance.bind(this)
      this.incrementalDetails.onEntitySearch = (searchText) => this.onGetInstances(classIri, searchText)
      this.incrementalDetails.onEntitySearchByDataPropertyValue = (dataPropertyIri, searchText) => this.onGetInstancesByDataPropertyValue(classIri, dataPropertyIri, searchText)

      if (classIri !== this.lastClassIri) {
        this.incrementalDetails.setInstances([])
        this.suggestedClassInstances = []
        this.incrementalDetails.isInstanceCounterLoading = true
        this.incrementalDetails.areInstancesLoading = true
        // Ask instance number
        this.vKGApi?.getInstancesNumber(classIri, (count) => {
          this.incrementalDetails.isInstanceCounterLoading = false
          this.incrementalDetails.instanceCount = count
        })
      }
    }

    this.lastClassIri = classIri
  }

  private showCommandsForClass(classIri: string) {
    const commands: Command[] = []

    const classInstanceEntity = this.diagram.classInstances?.get(classIri)

    if (classInstanceEntity) {
      commands.push(showParentClass(() => {
        const oldElemNumbers = this.diagramBuilder.diagram.representation?.grapholElements.size
        classInstanceEntity.parentClassIris.forEach(parentClassIri => {
          this.diagramBuilder.addEntity(parentClassIri.fullIri)
          this.connectInstanceToParentClasses(classInstanceEntity)
        })

        if (oldElemNumbers !== this.diagramBuilder.diagram.representation?.grapholElements.size)
          this.postDiagramEdit()
      }))
    }

    const superHierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
    const subHierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)

    if (superHierarchies && superHierarchies.length > 0) {
      const areAllSuperHierarchiesVisible = this.diagramBuilder.areAllSuperHierarchiesVisibleForClass(classIri)

      commands.push(IncrementalCommands.showHideSuperHierarchies(
        areAllSuperHierarchiesVisible,
        () => {
          this.diagramBuilder.referenceNodeId = classIri
          areAllSuperHierarchiesVisible ? this.hideSuperHierarchiesOf(classIri) : this.showSuperHierarchiesOf(classIri)
        }
      ))
    }

    if (subHierarchies && subHierarchies.length > 0) {
      const areAllSubHierarchiesVisible = this.diagramBuilder.areAllSubHierarchiesVisibleForClass(classIri)

      commands.push(
        IncrementalCommands.showHideSubHierarchies(
          areAllSubHierarchiesVisible,
          () => {
            this.diagramBuilder.referenceNodeId = classIri
            areAllSubHierarchiesVisible ? this.hideSubHierarchiesOf(classIri) : this.showSubHierarchiesOf(classIri)
          }
        ),
      )
    }

    const subClasses = this.neighbourhoodFinder.getSubclassesIris(classIri)
    const superClasses = this.neighbourhoodFinder.getSuperclassesIris(classIri)

    if (subClasses.length > 0) {
      const areAllSubclassesVisible = this.diagramBuilder.areAllSubclassesVisibleForClass(classIri, subClasses)
      commands.push(
        IncrementalCommands.showHideSubClasses(
          areAllSubclassesVisible,
          () => {
            this.diagramBuilder.referenceNodeId = classIri
            areAllSubclassesVisible
              ? subClasses.forEach(sc => this.removeEntity(sc, [classIri]))
              : this.showSubClassesOf(classIri, subClasses)
          }
        )
      )
    }

    if (superClasses.length > 0) {
      const areAllSuperclassesVisible = this.diagramBuilder.areAllSuperclassesVisibleForClass(classIri, superClasses)
      commands.push(
        IncrementalCommands.showHideSuperClasses(
          areAllSuperclassesVisible,
          () => {
            this.diagramBuilder.referenceNodeId = classIri
            areAllSuperclassesVisible
              ? superClasses.forEach(sc => this.removeEntity(sc, [classIri]))
              : this.showSuperClassesOf(classIri, superClasses)
          }
        )
      )
    }

    commands.push(
      IncrementalCommands.remove(() => this.removeEntity(classIri))
    )

    try {
      const htmlNodeReference = (this.diagram.representation?.cy.$id(classIri) as any).popperRef()
      if (htmlNodeReference && commands.length > 0) {
        this.commandsWidget.attachTo(htmlNodeReference, commands)
      }
    } catch (e) { console.error(e) }
  }

  private addDataPropertiesDetails(classIri: string) {
    this.getDataProperties(classIri).then(dataProperties => {
      this.incrementalDetails.setDataProperties(dataProperties.map(dp => grapholEntityToEntityViewData(dp, this.grapholscape)))
    })
  }

  private addObjectPropertiesDetails(classIri: string) {
    // OBJECT PROPERTIES
    this.getObjectProperties(classIri).then(objectProperties => {
      if (objectProperties) {
        this.incrementalDetails.setObjectProperties(Array.from(objectProperties).map(v => {
          return {
            objectProperty: grapholEntityToEntityViewData(v[0], this.grapholscape),
            connectedClasses: v[1].connectedClasses.map(classEntity => {
              return grapholEntityToEntityViewData(classEntity, this.grapholscape)
            }),
            direct: v[1].direct,
          }
        }))
      }
    })
  }

  reset() {
    if (this.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      this.incrementalRenderer.createNewDiagram()
      this.entitySelector.show()
      if (this.grapholscape.renderer.diagram)
        setGraphEventHandlers(this.grapholscape.renderer.diagram, this.grapholscape.lifecycle, this.ontology)

      this.setIncrementalEventHandlers()
      this.incrementalDetails.reset()
      const entityDetails = this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
      entityDetails.hide()
      this.clearState()
    }
  }

  clearState() {
    this.lastClassIri = undefined
    this.lastInstanceIri = undefined
    this.highlightsManager?.clear()
    this.vKGApi?.stopAllQueries()
  }

  hideUI() {
    this.incrementalDetails.hide()
    this.endpointController?.hideView()
    this.commandsWidget.hide()
  }

  /**
   * Called when the user click on the remove button on a entity node
   * Remove a class, an instance or a data property node from the diagram
   * @param entityIri 
   */
  removeEntity(entityIri: string, entitiesIrisToKeep?: string[]) {
    this.incrementalRenderer.freezeGraph()
    this.diagramBuilder.removeEntity(entityIri, entitiesIrisToKeep)
    this.postDiagramEdit()
  }

  async addInstance(instanceIriString: string) {
    if (!this.diagramBuilder.referenceNodeId) return

    const parentClassEntity = this.ontology.getEntity(this.diagramBuilder.referenceNodeId)

    if (parentClassEntity) {
      const suggestedClassInstance = this.suggestedClassInstances.find(c => c.iri === instanceIriString)

      if (!suggestedClassInstance) return

      if (!this.diagram.classInstances) {
        this.diagram.classInstances = new Map()
      }

      const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance?.shortIri)
      let instanceEntity: ClassInstanceEntity | undefined

      instanceEntity = this.diagram.classInstances.get(instanceIriString)

      if (!instanceEntity) {
        instanceEntity = new ClassInstanceEntity(instanceIri)
        this.diagram.classInstances.set(instanceIriString, instanceEntity)

        // Set label as annotation
        if (suggestedClassInstance.label) {
          instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
        }
      }

      instanceEntity.parentClassIris.add(parentClassEntity.iri)

      this.incrementalRenderer.freezeGraph()
      this.diagramBuilder.addClassInstance(instanceIriString)
      this.connectInstanceToParentClasses(instanceEntity)
      const addedInstance = this.diagram.representation?.grapholElements.get(instanceIriString)
      if (addedInstance) {
        addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default)
        this.diagram.representation?.updateElement(addedInstance)
      }

      this.postDiagramEdit()
    }
  }

  async addInstanceObjectProperty(instanceIriString: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) {
    if (!this.diagramBuilder.referenceNodeId) return

    const parentClassEntity = this.ontology.getEntity(parentClassIri)

    if (parentClassEntity) {
      const suggestedClassInstance = this.suggestedClassInstancesRanges.find(c => c.iri === instanceIriString)
      const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance?.shortIri)
      const instanceEntity = new ClassInstanceEntity(instanceIri, parentClassEntity.iri)

      if (!suggestedClassInstance) return

      // Set label as annotation
      if (suggestedClassInstance.label) {
        instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
      }

      // (await this.vKGApi?.getHighlights(parentClassIri))?.dataProperties?.forEach(dpIri => {
      //   instanceEntity.addDataProperty(dpIri)
      // })

      if (!this.diagram.classInstances) {
        this.diagram.classInstances = new Map()
      }

      this.diagram.classInstances.set(instanceIriString, instanceEntity)
      this.incrementalRenderer.freezeGraph()
      this.diagramBuilder.addInstanceObjectProperty(objectPropertyIri, instanceIriString, direct)
      const addedInstance = this.diagram.representation?.grapholElements.get(instanceIriString)
      if (addedInstance) {
        addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default)
        this.diagram.representation?.updateElement(addedInstance)
        this.connectInstanceToParentClasses(instanceEntity)
      }

      this.postDiagramEdit()
    }
  }

  /**
   * Called when the user trigger the toggle for showing data properties.
   * Given the state of the toggle and the list of dataproperties it is
   * controlling, use diagram builder to add or remove them
   * @param enabled 
   * @param dataProperties
   */
  toggleDataProperties(enabled: boolean, dataProperties: GrapholEntity[]) {
    if (enabled) {
      dataProperties.forEach(dataProperty => this.diagramBuilder.addEntity(dataProperty.iri.fullIri))
    } else {
      dataProperties.forEach(dataProperty => this.diagramBuilder.removeEntity(dataProperty.iri.fullIri))
    }

    if (dataProperties.length > 0)
      this.postDiagramEdit()
  }

  /**
   * Called when the user select a class connected with the reference class
   * through an object property from the incremental menu.
   * Using diagram builder (which knows the actual reference class),
   * add the object property edge using the right direction
   * (towards reference class in case of a invereObjectProperty)
   * @param classIri the class selected in the list
   * @param objectPropertyIri the object property through which the class has been selected in the list
   * @param direct if true the edge goes from reference class to selected class in menu
   */
  addIntensionalObjectProperty(classIri: string, objectPropertyIri: string, direct: boolean) {
    this.incrementalRenderer.freezeGraph()
    this.diagramBuilder.addEntity(objectPropertyIri, classIri, direct)
    this.postDiagramEdit()
  }

  /**
   * Show hierarchies for which the specified class is a subClass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  showSuperHierarchiesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)

    if (hierarchies && hierarchies.length > 0) {
      this.incrementalRenderer.freezeGraph()
      hierarchies.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy))
      this.postDiagramEdit()
    }

  }

  /**
   * Hide hierarchies for which the specified class is a subClass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSuperHierarchiesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)


    if (hierarchies && hierarchies.length > 0) {
      this.incrementalRenderer.freezeGraph()
      hierarchies.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]))
      this.postDiagramEdit()
    }
  }

  /**
   * Show hierarchies for which the specified class is a superclass.
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  showSubHierarchiesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)


    if (hierarchies && hierarchies.length > 0) {
      this.incrementalRenderer.freezeGraph()
      hierarchies.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy))
      this.postDiagramEdit()
    }
  }

  /**
   * Show hierarchies for which the specified class is a superclass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSubHierarchiesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)

    if (hierarchies && hierarchies.length > 0) {
      this.incrementalRenderer.freezeGraph()
      hierarchies?.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]))
      this.postDiagramEdit()
    }
  }

  showSubClassesOf(classIri: string, subclassesIris?: string[]) {
    if (!subclassesIris) {
      subclassesIris = this.neighbourhoodFinder.getSubclassesIris(classIri)
    }

    subclassesIris.forEach(subclassIri => this.diagramBuilder.addSubClass(subclassIri))
    this.runLayout()
  }

  showSuperClassesOf(classIri: string, superclassesIris?: string[]) {
    if (!superclassesIris) {
      superclassesIris = this.neighbourhoodFinder.getSuperclassesIris(classIri)
    }

    superclassesIris.forEach(subclassIri => this.diagramBuilder.addSuperClass(subclassIri))
    this.runLayout()
  }

  changeInstancesLimit(limitValue: number) {
    if (this.isReasonerEnabled) {
      this.vKGApi!.limit = limitValue
      if (this.incrementalDetails.canShowInstances && this.lastClassIri) {
        this.buildDetailsForClass(this.lastClassIri)
      }

      if (this.incrementalDetails.canShowDataPropertiesValues && this.lastInstanceIri) {
        this.buildDetailsForInstance(this.lastInstanceIri)
      }
    }
  }

  connectInstanceToParentClasses(instanceEntity: ClassInstanceEntity) {
    instanceEntity.parentClassIris.forEach(parentClassIri => {
      this.diagramBuilder.addInstanceOfEdge(instanceEntity.iri.fullIri, parentClassIri.fullIri)
    })
  }

  private onGetInstances(classIri: string, searchText?: string) {
    this.incrementalDetails.areInstancesLoading = true

    // if it's a search, clear instances list
    if (searchText !== undefined)
      this.incrementalDetails.setInstances([])

    this.vKGApi!.getInstances(
      classIri,
      this.onNewInstancesForDetails.bind(this), // onNewResults
      () => this.onStopInstanceLoading(classIri), // onStop
      searchText
    )
  }

  private onGetInstancesByDataPropertyValue(classIri: string, dataPropertyIri: string, dataPropertyValue: string) {
    this.incrementalDetails.areInstancesLoading = true
    this.incrementalDetails.setInstances([])

    this.vKGApi!.getInstancesByDataPropertyValue(
      classIri,
      dataPropertyIri,
      dataPropertyValue,
      this.onNewInstancesForDetails.bind(this), // onNewResults
      () => this.onStopInstanceLoading(classIri) // onStop
    )
  }

  private async onGetRangeInstances(instanceIri: string, objectPropertyIri: string, rangeClassIri: string) {
    this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, true)
    const isDirect = (await this.highlightsManager?.objectProperties())?.find(op => op.objectPropertyIRI === objectPropertyIri)?.direct || false

    this.vKGApi?.getInstanceObjectPropertyRanges(instanceIri, objectPropertyIri, isDirect, rangeClassIri,
      (instances) => this.onNewInstanceRangesForDetails(instances, objectPropertyIri, rangeClassIri), // onNewResults
      () => this.onStopObjectPropertyRangeValueQuery(instanceIri, objectPropertyIri, rangeClassIri) // onStop
    )
  }

  private onNewInstancesForDetails(instances: ClassInstance[]) {
    this.suggestedClassInstances = instances

    this.incrementalDetails.setInstances(instances.map(instance => {
      let instanceEntity = this.getInstanceEntityFromClassInstance(instance)
      return {
        displayedName: instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language),
        value: instanceEntity
      }
    }))
  }

  private async getHighlights(classIri: string) {
    if (this.isReasonerEnabled) {
      return await this.vKGApi!.getHighlights(classIri)
    }
  }

  private onNewInstanceRangesForDetails(instances: ClassInstance[], objectPropertyIri: string, rangeClassIri: string) {
    this.suggestedClassInstancesRanges.push(...instances)
    const instancesEntities = instances.map(i =>
      grapholEntityToEntityViewData(this.getInstanceEntityFromClassInstance(i), this.grapholscape)
    )

    this.incrementalDetails.addObjectPropertyRangeInstances(objectPropertyIri, rangeClassIri, instancesEntities)
  }

  /**
   * Given the iri of a class, retrieve connected object properties.
   * These object properties are inferred if the reasoner is available.
   * Otherwise only object properties directly asserted in the ontology
   * will be retrieved.
   * @param classIri 
   * @returns 
   */
  private async getObjectProperties(classIri: string) {
    if (this.isReasonerEnabled) {
      const branches = await this.highlightsManager?.objectProperties()
      const objectPropertiesMap = new Map<GrapholEntity, ObjectPropertyConnectedClasses>()

      branches?.forEach(branch => {
        if (!branch.objectPropertyIRI) return

        const objectPropertyEntity = this.ontology.getEntity(branch.objectPropertyIRI)

        if (!objectPropertyEntity) return

        const connectedClasses: ObjectPropertyConnectedClasses = {
          connectedClasses: [],
          direct: branch.direct || false,
        }

        branch.relatedClasses?.forEach(relatedClass => {
          const relatedClassEntity = this.ontology.getEntity(relatedClass)

          if (relatedClassEntity) {
            connectedClasses.connectedClasses.push(relatedClassEntity)
          }
        })

        objectPropertiesMap.set(objectPropertyEntity, connectedClasses)
      })

      return objectPropertiesMap

    } else {
      return this.neighbourhoodFinder.getObjectProperties(classIri)
    }
  }

  private async getDataProperties(classIri: string) {
    if (this.isReasonerEnabled) {
      const dataProperties = await this.highlightsManager?.dataProperties()
      return dataProperties
        ?.map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
        || []

    } else {
      return this.neighbourhoodFinder.getDataProperties(classIri)
    }
  }

  private onStopDataPropertyValueQuery(instanceIri: string, dataPropertyIri: string) {
    // if there is a new instance iri, loading will be stopped by new requests
    if (instanceIri === this.lastInstanceIri) {
      this.incrementalDetails.setDataPropertyLoading(dataPropertyIri, false)
    }
  }

  private onStopInstanceLoading(classIri: string) {
    if (classIri === this.lastClassIri) {
      this.incrementalDetails.areInstancesLoading = false
    }
  }

  private onStopObjectPropertyRangeValueQuery(instanceIri: string, objectPropertyIri: string, rangeClassIri: string) {
    if (instanceIri === this.lastInstanceIri) {
      this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, false)
    }
  }

  private postDiagramEdit() {
    if (!this.diagram.representation || this.diagram.representation.grapholElements.size === 0) {
      this.entitySelector.show()
    }

    this.runLayout()
    const ontologyExplorer = this.grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER) as GscapeExplorer | undefined
    if (ontologyExplorer) {
      ontologyExplorer.entities = createEntitiesList(this.grapholscape, ontologyExplorer.searchEntityComponent)
    }
  }

  private runLayout() { this.incrementalRenderer.runLayout() }

  private setIncrementalEventHandlers() {
    this.incrementalRenderer.onContextClick(target => this.showCommandsForClass(target.data().iri))

    if (this.diagram.representation?.hasEverBeenRendered || this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    // const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
    this.incrementalRenderer.diagramRepresentation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {

        if (this.isReasonerEnabled) {
          this.vKGApi?.stopAllQueries()
        }

        this.diagramBuilder.referenceNodeId = evt.target.id()
        const targetIri = evt.target.data().iri
        // set class instance entity in entity details widget
        if (evt.target.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
          const instanceEntity = this.diagram.classInstances?.get(targetIri)
          if (instanceEntity) {
            this.highlightsManager?.computeHighlights(Array.from(instanceEntity.parentClassIris).map(iri => iri.fullIri));
            (this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails).setGrapholEntity(instanceEntity)
            this.buildDetailsForInstance(targetIri)
          }
        } else {
          this.highlightsManager?.computeHighlights(targetIri)
          this.buildDetailsForClass(targetIri)
        }

        this.incrementalDetails.show()
      } else {
        this.incrementalDetails.hide()
      }
    })

    this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set', true)
  }

  private get ontology() { return this.grapholscape.ontology }
  private get diagram() { return this.incrementalRenderer.incrementalDiagram }
  private get isReasonerEnabled() { return this.vKGApi !== undefined }
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
}