import { Grapholscape, IncrementalRendererState } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Annotation, AnnotationsKind, GrapholEntity, GrapholTypesEnum, Iri, RendererStatesEnum } from "../model";
import { WidgetEnum } from "../ui/util/widget-enum";
import { IEntitySelector } from "../ui/entity-selector/entity-selector";
import { IIncrementalDetails } from "../ui/incremental-ui/incremental-details";
import DiagramBuilder from "./diagram-builder";
import VKGApi, { ClassInstance, IVirtualKnowledgeGraphApi } from "./api/kg-api";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import grapholEntityToEntityViewData from "../util/graphol-entity-to-entity-view-data";
import { Branch, Highlights } from "./api/swagger";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { GscapeEntityDetails } from "../ui/entity-details";
import { IBaseMixin } from "../ui/common/base-widget-mixin";
import GscapeContextMenu, { Command } from "../ui/common/context-menu";
import { IncrementalCommands } from "../ui/incremental-ui";
import { EntityViewData } from "../ui";

export default class IncrementalController {
  private diagramBuilder: DiagramBuilder
  private _vKGApi?: IVirtualKnowledgeGraphApi
  private neighbourhoodFinder: NeighbourhoodFinder

  private highlights: Promise<Highlights> = new Promise(() => { })
  private lastClassIri?: string
  private lastInstanceIri?: string

  private suggestedClassInstances: ClassInstance[] = []
  private suggestedClassInstancesRanges: ClassInstance[] = []

  private commandsWidget = new GscapeContextMenu()

  constructor(
    private grapholscape: Grapholscape,
    private incrementalRenderer: IncrementalRendererState,
    private incrementalDetails: IIncrementalDetails & IBaseMixin,
    private entitySelector: IEntitySelector & IBaseMixin
  ) {
    this.diagramBuilder = new DiagramBuilder(this.ontology, this.diagram)
    this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology)
    this.commandsWidget
  }

  init() {
    this.setIncrementalEventHandlers()
    this.incrementalDetails.reset()
    this.incrementalDetails.onObjectPropertySelection = this.addIntensionalObjectProperty.bind(this)
    this.entitySelector.onClassSelection((iri: string) => {
      this.entitySelector.hide()
      this.diagramBuilder.addEntity(iri)
      this.postDiagramEdit()
    })

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.ontology)
  }

  private async buildDetailsForInstance(instanceIri: string) {
    if (!this.incrementalDetails) return

    this.incrementalDetails.canShowInstances = false
    this.incrementalDetails.canShowDataPropertiesValues = true
    this.incrementalDetails.canShowObjectPropertiesRanges = true

    const instanceEntity = this.diagram.classInstances?.get(instanceIri)
    if (instanceEntity) {
      this.addDataPropertiesDetails(instanceEntity.parentClassIri.fullIri)
      this.addObjectPropertiesDetails(instanceEntity.parentClassIri.fullIri)
      
      if (instanceIri !== this.lastInstanceIri) {
        // init data properties values
        const dataPropertiesValues = new Map<string, { values: string[], loading?: boolean }>();
        const dataProperties = (await this.highlights).dataProperties
        dataProperties?.forEach(dpIri => {
          dataPropertiesValues.set(dpIri, { values: [], loading: true })
        })

        this.incrementalDetails.setDataPropertiesValues(dataPropertiesValues)

        dataProperties?.forEach(dpIri => {
          this.vKGApi?.getInstanceDataPropertyValues(instanceIri, dpIri,
            (res) => this.incrementalDetails.addDataPropertiesValues(dpIri, res), // onNewResults
            () => this.onStopDataPropertyValueQuery(dpIri)) // onStop
        })

        const objectPropertiesRanges = new Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>()
        let rangeMap: Map<string, { values: EntityViewData[], loading?: boolean}>

        const objectProperties = (await (this.highlights)).objectProperties

        // init ranges map with empty arrays and all loading
        objectProperties?.forEach(opBranch => {
          if (opBranch.objectPropertyIRI) {
            opBranch.relatedClasses?.forEach(rangeClass => {
              rangeMap = new Map<string, { values: EntityViewData[], loading?: boolean}>()
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

    const superHierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
    const subHierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)

    if (superHierarchies && superHierarchies.length > 0) {
      const areAllSuperHierarchiesVisible = this.diagramBuilder.areAllSuperHierarchiesVisibleForClass(classIri)

      commands.push(IncrementalCommands.showHideSuperClasses(
        areAllSuperHierarchiesVisible,
        () => {
          this.diagramBuilder.referenceNodeId = classIri
          areAllSuperHierarchiesVisible ? this.hideSuperClassesOf(classIri) : this.showSuperClassesOf(classIri)
        }
      ))
    }

    if (subHierarchies && subHierarchies.length > 0) {
      const areAllSubHierarchiesVisible = this.diagramBuilder.areAllSubHierarchiesVisibleForClass(classIri)

      commands.push(
        IncrementalCommands.showHideSubClasses(
          areAllSubHierarchiesVisible,
          () => {
            this.diagramBuilder.referenceNodeId = classIri
            areAllSubHierarchiesVisible ? this.hideSubClassesOf(classIri) : this.showSubClassesOf(classIri)
          }
        ),
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

  private addObjectPropertiesDetails(classIri:string) {
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

      this.lastClassIri = undefined
      this.lastInstanceIri = undefined
      this.highlights = new Promise(() => { })
    }
  }

  /**
   * Called when the user click on the remove button on a entity node
   * Remove a class, an instance or a data property node from the diagram
   * @param entityIri 
   */
  removeEntity(entityIri: string) {
    this.diagramBuilder.removeEntity(entityIri)
    this.postDiagramEdit()
  }

  async addInstance(instanceIriString: string) {
    if (!this.diagramBuilder.referenceNodeId) return

    const parentClassEntity = this.ontology.getEntity(this.diagramBuilder.referenceNodeId)

    if (parentClassEntity) {
      const suggestedClassInstance = this.suggestedClassInstances.find(c => c.iri === instanceIriString)
      const instanceIri = new Iri(instanceIriString, this.ontology.namespaces, suggestedClassInstance?.shortIri)
      const instanceEntity = new ClassInstanceEntity(instanceIri, parentClassEntity.iri)

      if (!suggestedClassInstance) return

      // Set label as annotation
      if (suggestedClassInstance.label) {
        instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
      }

      // (await this.lastHighlights).dataProperties?.forEach(dpIri => {
      //   instanceEntity.addDataProperty(dpIri)
      // })

      if (!this.diagram.classInstances) {
        this.diagram.classInstances = new Map()
      }

      this.diagram.classInstances.set(instanceIriString, instanceEntity)

      this.diagramBuilder.addClassInstance(instanceIriString)
      this.diagramBuilder.addInstanceOfEdge(instanceIriString)
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

      (await this.vKGApi?.getHighlights(parentClassIri))?.dataProperties?.forEach(dpIri => {
        instanceEntity.addDataProperty(dpIri)
      })

      if (!this.diagram.classInstances) {
        this.diagram.classInstances = new Map()
      }

      this.diagram.classInstances.set(instanceIriString, instanceEntity)

      this.diagramBuilder.addInstanceObjectProperty(objectPropertyIri, instanceIriString, direct)
      const addedInstance = this.diagram.representation?.grapholElements.get(instanceIriString)
      if (addedInstance) {
        addedInstance.displayedName = instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language, this.ontology.languages.default)
        this.diagram.representation?.updateElement(addedInstance)
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
    this.diagramBuilder.addEntity(objectPropertyIri, classIri, direct)
    this.postDiagramEdit()
  }

  /**
   * Show hierarchies for which the specified class is a subClass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  showSuperClassesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
    hierarchies?.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy))

    if (hierarchies && hierarchies.length > 0)
      this.postDiagramEdit()
  }

  /**
   * Hide hierarchies for which the specified class is a subClass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSuperClassesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
    hierarchies?.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]))

    if (hierarchies && hierarchies.length > 0)
      this.postDiagramEdit()
  }

  /**
   * Show hierarchies for which the specified class is a superclass.
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  showSubClassesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)
    hierarchies?.forEach(hierarchy => this.diagramBuilder.addHierarchy(hierarchy))

    if (hierarchies && hierarchies.length > 0)
      this.postDiagramEdit()
  }

  /**
   * Show hierarchies for which the specified class is a superclass (i.e. an input class).
   * Hierarchies are pre-computed, after the floaty-transformation is performed.
   * @param classIri 
   */
  hideSubClassesOf(classIri: string) {
    const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)
    hierarchies?.forEach(hierarchy => this.diagramBuilder.removeHierarchy(hierarchy, [classIri]))

    this.postDiagramEdit()
  }

  private onGetInstances(classIri: string, searchText?: string) {
    this.incrementalDetails.areInstancesLoading = true

    // if it's a search, clear instances list
    if (searchText !== undefined)
      this.incrementalDetails.setInstances([])

    this.vKGApi!.getInstances(
      classIri,
      this.onNewInstancesForDetails.bind(this), // onNewResults
      () => this.incrementalDetails.areInstancesLoading = false, // onStop
      searchText
    )
  }

  private onGetRangeInstances(instanceIri: string, objectPropertyIri: string, rangeClassIri: string) {
    this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, true)

    this.vKGApi?.getInstanceObjectPropertyRanges(instanceIri, objectPropertyIri, rangeClassIri,
      (instances) => this.onNewInstanceRangesForDetails(instances, objectPropertyIri, rangeClassIri), // onNewResults
      () => this.incrementalDetails.setObjectPropertyLoading(objectPropertyIri, rangeClassIri, false) // onStop
    )
  }

  private onNewInstancesForDetails(instances: ClassInstance[]) {
    this.suggestedClassInstances.push(...instances)

    this.incrementalDetails.addInstances(instances.map(instance => {
      let instanceEntity = this.getInstanceEntityFromClassInstance(instance)
      return {
        displayedName: instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language),
        value: instanceEntity
      }
    }))
  }

  private refreshHighlights(classIri: string) {
    if (this.isReasonerEnabled) {
      this.highlights = this.vKGApi!.getHighlights(classIri)
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
      const branches = (await this.highlights).objectProperties
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
      const dataProperties = (await this.highlights).dataProperties
      return dataProperties
        ?.map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
        || []

    } else {
      return this.neighbourhoodFinder.getDataProperties(classIri)
    }
  }

  private onStopDataPropertyValueQuery(dataPropertyIri: string) {
    this.incrementalDetails.setDataPropertyLoading(dataPropertyIri, false)
  }

  private postDiagramEdit() {
    if (!this.diagram.representation || this.diagram.representation.grapholElements.size === 0) {
      this.entitySelector.show()
    }

    this.runLayout()
  }

  private runLayout() { this.incrementalRenderer.runLayout() }

  private setIncrementalEventHandlers() {
    this.incrementalRenderer.onContextClick(target => this.showCommandsForClass(target.data().iri))

    if (this.diagram.representation?.hasEverBeenRendered || this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    // const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
    this.incrementalRenderer.diagramRepresentation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {
        this.diagramBuilder.referenceNodeId = evt.target.id()
        const targetIri = evt.target.data().iri
        // set class instance entity in entity details widget
        if (evt.target.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
          const instanceEntity = this.diagram.classInstances?.get(targetIri)
          if (instanceEntity) {
            this.refreshHighlights(instanceEntity.parentClassIri.fullIri);
            (this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails).setGrapholEntity(instanceEntity)
            this.buildDetailsForInstance(targetIri)
          }
        } else {
          this.refreshHighlights(targetIri)
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
  private get vKGApi() {
    if (this.grapholscape.mastroRequestOptions && !this._vKGApi) {
      this._vKGApi = new VKGApi(this.grapholscape.mastroRequestOptions, {
        name: 'new_endpoint',
      })
    }

    return this._vKGApi
  }

  private getInstanceEntityFromClassInstance(classInstance: ClassInstance) {
    const instanceIri = new Iri(classInstance.iri, this.ontology.namespaces, classInstance.shortIri)
    const instanceEntity = new GrapholEntity(instanceIri, GrapholTypesEnum.CLASS_INSTANCE)
    if (classInstance.label) {
      instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, classInstance.label))
    }

    return instanceEntity
  }
}