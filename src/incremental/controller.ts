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
import { Highlights } from "./api/swagger";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { GscapeEntityDetails } from "../ui/entity-details";
import { IBaseMixin } from "../ui/common/base-widget-mixin";
import GscapeContextMenu, { Command } from "../ui/common/context-menu";
import * as IncrementalCommands from "../ui/incremental-ui/commands";

export default class IncrementalController {
  private diagramBuilder: DiagramBuilder
  private _vKGApi?: IVirtualKnowledgeGraphApi
  private neighbourhoodFinder: NeighbourhoodFinder

  private lastHighlights: Promise<Highlights> = new Promise(() => { })
  private lastClassIri: string
  private lastInstanceIri: string

  private suggestedClassInstances: ClassInstance[] = []

  private commandsWidget = new GscapeContextMenu()

  constructor(
    private grapholscape: Grapholscape,
    private incrementalRenderer: IncrementalRendererState,
    private incrementalMenu: IIncrementalDetails,
    private entitySelector: IEntitySelector & IBaseMixin
  ) {
    this.diagramBuilder = new DiagramBuilder(this.ontology, this.diagram)
    this.neighbourhoodFinder = new NeighbourhoodFinder(this.ontology)
    this.commandsWidget
  }

  init() {
    this.setIncrementalEventHandler()

    this.incrementalMenu.onObjectPropertySelection = this.addIntensionalObjectProperty.bind(this)
    this.entitySelector.onClassSelection((iri: string) => {
      this.entitySelector.hide()
      this.diagramBuilder.addEntity(iri)
      this.postDiagramEdit()
    })

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.ontology)
  }

  private async buildDetailsForInstance(instanceIri: string) {
    if (!this.incrementalMenu) return

    this.incrementalMenu.canShowInstances = false
    this.incrementalMenu.canShowDataPropertiesValues = true
    // this.incrementalMenu.setInstances([])

    const instanceEntity = this.diagram.classInstances?.get(instanceIri)
    if (instanceEntity) {
      this.addPropertiesToIncrementalMenu(instanceEntity.parentClassIri.fullIri)

      if (instanceIri !== this.lastInstanceIri) {
        // init data properties values
        const dataPropertiesValues = new Map<string, { values: string[], loading?: boolean }>();
        const dataProperties = (await this.lastHighlights).dataProperties
        dataProperties?.forEach(dpIri => {
          dataPropertiesValues.set(dpIri, { values: [], loading: true })
        })

        this.incrementalMenu.setDataPropertiesValues(dataPropertiesValues)

        dataProperties?.forEach(dpIri => {
          this.vKGApi?.getInstanceDataPropertyValues(instanceIri, dpIri,
            (res) => this.incrementalMenu.addDataPropertiesValues(dpIri, res), // onNewResults
            () => this.onStopDataPropertyValueQuery(dpIri)) // onStop
        })

        this.lastInstanceIri = instanceIri
      }
    }
  }

  private buildDetailsForClass(classIri: string) {
    if (!this.incrementalMenu) return

    this.addPropertiesToIncrementalMenu(classIri)

    // this.incrementalMenu.onShowSuperClasses = () => this.showSuperClassesOf(classIri)
    // this.incrementalMenu.onHideSuperClasses = () => this.hideSuperClassesOf(classIri)
    // this.incrementalMenu.onShowSubClasses = () => this.showSubClassesOf(classIri)
    // this.incrementalMenu.onHideSubClasses = () => this.hideSubClassesOf(classIri)
    // this.incrementalMenu.onRemove = () => this.removeEntity(classIri)

    if (this.isReasonerEnabled) {
      this.incrementalMenu.canShowDataPropertiesValues = false
      this.incrementalMenu.canShowInstances = true

      this.incrementalMenu.onGetInstances = () => {
        this.vKGApi!.getInstances(
          classIri,
          this.onNewInstancesForMenu.bind(this), // onNewResults
          () => this.incrementalMenu.areInstancesLoading = false // onStop
        )
      }
      this.incrementalMenu.onInstanceSelection = this.addInstance.bind(this)

      if (classIri !== this.lastClassIri) {
        this.incrementalMenu.setInstances([])
        this.suggestedClassInstances = []
        this.incrementalMenu.isInstanceCounterLoading = true
        this.incrementalMenu.areInstancesLoading = true
        // Ask instance number
        this.vKGApi?.getInstancesNumber(classIri, (count) => {
          this.incrementalMenu.isInstanceCounterLoading = false
          this.incrementalMenu.instanceCount = count
        })
      }

      this.lastClassIri = classIri
    }
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

  private addPropertiesToIncrementalMenu(classIri) {
    // DATA PROPERTIES TOGGLE
    this.getDataProperties(classIri).then(dataProperties => {
      this.incrementalMenu.setDataProperties(dataProperties.map(dp => grapholEntityToEntityViewData(dp, this.grapholscape)))
    })

    // OBJECT PROPERTIES
    this.getObjectProperties(classIri).then(objectProperties => {
      if (objectProperties) {
        this.incrementalMenu.setObjectProperties(Array.from(objectProperties).map(v => {
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

      this.setIncrementalEventHandler()

      const entityDetails = this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
      entityDetails.hide()
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
    const instanceIri = new Iri(instanceIriString, this.ontology.namespaces)

    if (parentClassEntity) {
      const instanceEntity = new ClassInstanceEntity(instanceIri, parentClassEntity.iri)
      const suggestedClassInstance = this.suggestedClassInstances.find(c => c.iri === instanceIriString)

      if (!suggestedClassInstance) return

      // Set label as annotation
      if (suggestedClassInstance.label) {
        instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, suggestedClassInstance.label))
      }

      (await this.lastHighlights).dataProperties?.forEach(dpIri => {
        instanceEntity.addDataProperty(dpIri)
      })

      if (!this.diagram.classInstances) {
        this.diagram.classInstances = new Map()
      }

      this.diagram.classInstances.set(instanceIriString, instanceEntity)

      this.diagramBuilder.addClassInstance(instanceIriString)
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

  private onNewInstancesForMenu(instances: ClassInstance[]) {
    this.suggestedClassInstances.push(...instances)

    this.incrementalMenu.addInstances(instances.map(instance => {
      let instanceIri = new Iri(instance.iri, this.ontology.namespaces)

      let instanceEntity = new GrapholEntity(instanceIri, GrapholTypesEnum.CLASS_INSTANCE)
      if (instance.label) {
        instanceEntity.addAnnotation(new Annotation(AnnotationsKind.label, instance.label))
      }

      return {
        displayedName: instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language),
        value: instanceEntity
      }
    }))
  }

  private refreshHighlights(classIri: string) {
    if (this.isReasonerEnabled) {
      this.lastHighlights = this.vKGApi!.getHighlights(classIri)
    }
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
      if (classIri !== this.lastClassIri) {
        this.refreshHighlights(classIri)
      }
      const branches = (await this.lastHighlights).objectProperties
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
      if (classIri !== this.lastClassIri) {
        this.refreshHighlights(classIri)
      }

      const dataProperties = (await this.lastHighlights).dataProperties
      return dataProperties
        ?.map(dp => this.ontology.getEntity(dp))
        .filter(dpEntity => dpEntity !== null) as GrapholEntity[]
        || []

    } else {
      return this.neighbourhoodFinder.getDataProperties(classIri)
    }
  }

  private onStopDataPropertyValueQuery(dataPropertyIri: string) {
    this.incrementalMenu.setDataPropertyLoading(dataPropertyIri, false)
  }

  private postDiagramEdit() {
    if (!this.diagram.representation || this.diagram.representation.grapholElements.size === 0) {
      this.entitySelector.show()
    }

    this.runLayout()
  }

  private runLayout() { this.incrementalRenderer.runLayout() }

  private setIncrementalEventHandler() {
    if (this.diagram.representation?.hasEverBeenRendered && this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    const classOrInstanceSelector = `node[type = "${GrapholTypesEnum.CLASS}"], node[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`
    this.incrementalRenderer.diagramRepresentation?.cy.on('tap', classOrInstanceSelector, evt => {
      this.diagramBuilder.referenceNodeId = evt.target.id()
      const targetIri = evt.target.data().iri
      // set class instance entity in entity details widget
      if (evt.target.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
        const instanceEntity = this.diagram.classInstances?.get(targetIri)
        if (instanceEntity) {
          (this.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails).setGrapholEntity(instanceEntity)
          this.buildDetailsForInstance(targetIri)
        }
      } else {
        this.buildDetailsForClass(targetIri)
      }
    })

    this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set', true)

    this.incrementalRenderer.onContextClick(target => this.showCommandsForClass(target.data().iri))
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
}