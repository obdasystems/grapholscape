import { Collection, EdgeCollection, EdgeSingular, NodeSingular, Position } from "cytoscape";
import { Grapholscape, IncrementalRendererState } from "../core";
import DiagramBuilder from "../core/diagram-builder";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Annotation, DefaultAnnotationProperties, DiagramRepresentation, EntityNameType, Filter, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Hierarchy, IncrementalDiagram, Iri, isGrapholEdge, isGrapholNode, LifecycleEvent, RendererStatesEnum, TypesEnum, Viewport } from "../model";
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity";
import { RDFGraph } from "../model/rdf-graph/swagger";
import * as RDFGraphParser from '../parsing/rdf-graph-parser';
import { showMessage, WidgetEnum } from "../ui";
import NodeButton from "../ui/common/button/node-button";
import { ClassInstance } from "./api/kg-api";
import { QueryStatusEnum, RequestOptions } from "./api/model";
import { Entity, EntityTypeEnum, OntologyPath } from "./api/swagger";
import { OntologyColorManager } from "../core/colors-manager";
import EndpointController from "./endpoint-controller";
import IncrementalLifecycle, { IncrementalEvent } from "./lifecycle";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import { addBadge } from "./ui";
import { GscapeEntityColorLegend, setColorList } from "../ui/entity-color-legend";

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
  public classFilterMap: Map<string, Filter> = new Map()

  lifecycle: IncrementalLifecycle = new IncrementalLifecycle()
  on = this.lifecycle.on

  /**
   * Callback called when user click on data lineage command
   */
  onShowDataLineage: (entityIri: string) => void = () => { }
  addEdge: (sourceId: string, targetId: string, edgeType: TypesEnum.INCLUSION | TypesEnum.INPUT | TypesEnum.EQUIVALENCE | TypesEnum.INSTANCE_OF) => GrapholEdge | undefined;

  constructor(
    public grapholscape: Grapholscape
  ) {
    this.setIncrementalEventHandlers()
    this.diagramBuilder = new DiagramBuilder(this.diagram, RendererStatesEnum.INCREMENTAL)
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

  showDiagram(viewportState?: Viewport) {
    if (viewportState)
      this.diagram.lastViewportState = viewportState

    setGraphEventHandlers(this.diagram, this.grapholscape.lifecycle, this.grapholscape.ontology)

    this.grapholscape.renderer.render(this.diagram)
  }

  async performActionWithBlockedGraph(action: () => void | Promise<void>, customLayoutOptions?: any) {
    this.actionsWithBlockedGraph += 1
    const oldElemNumbers = this.numberOfElements
    this.incrementalRenderer?.freezeGraph()
    await action()
    this.actionsWithBlockedGraph -= 1
    this.postDiagramEdit(oldElemNumbers, customLayoutOptions)
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

  /**
   * Inject in the current diagram the results from a construct query in RDFGraph form.
   * Here we assume entities are already in the loaded ontology.
   * If grapholscape is started right away with construct results, then the function
   * performing the init must take care of loading all the entities beforehand.
   * The only entities that will be loaded here are instance entities (individuals).
   * @param rdfGraph the graph to add to current vkg instance
   * @returns 
   */
  addRDFGraph(rdfGraph: RDFGraph) {
    if (!this.diagram.representation) {
      return
    }

    const colorManager = new OntologyColorManager(
      this.ontology,
      this.diagram.representation)

    const addElemToIncremental = (elem: GrapholElement, rdfGraphRepr: DiagramRepresentation) => {
      let entity: GrapholEntity | undefined
      if (isGrapholEdge(elem)) {
        elem.id = this.diagramBuilder.getNewId('edge')
      }

      if (elem.iri) {
        if (isGrapholNode(elem)) {
          elem.originalId = this.diagramBuilder.getNewId('node')
        }

        entity = this.classInstanceEntities.get(elem.iri) || this.ontology.getEntity(elem.iri)
      }

      elem.diagramId = this.diagram.id

      if (entity && elem.iri) {

        switch (elem.type) {
          case TypesEnum.CLASS_INSTANCE:
            if (!entity.color)
              colorManager.setInstanceColor(entity as ClassInstanceEntity)
            this.diagramBuilder.addClassInstance(entity as ClassInstanceEntity, elem)
            break

          case TypesEnum.OBJECT_PROPERTY:
            // Here we can be sure to find source and target cause nodes are added before edges, and
            // object properties are always edges in vkg.
            const source = rdfGraphRepr.grapholElements.get((elem as GrapholEdge).sourceId)
            const target = rdfGraphRepr.grapholElements.get((elem as GrapholEdge).targetId)

            let sourceEntity: GrapholEntity | undefined, targetEntity: GrapholEntity | undefined

            if (source?.iri && target?.iri) {
              if (source.is(TypesEnum.CLASS_INSTANCE) && target.is(TypesEnum.CLASS_INSTANCE)) {
                sourceEntity = this.classInstanceEntities.get(source.iri)
                targetEntity = this.classInstanceEntities.get(target.iri)
              } else if (source.is(TypesEnum.CLASS) && target.is(TypesEnum.CLASS)) {
                sourceEntity = this.ontology.getEntity(source.iri)
                targetEntity = this.ontology.getEntity(target.iri)
              } else {
                return
              }

              if (sourceEntity && targetEntity)
                this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity, source.type, elem as GrapholEdge)
            }
            break

          case TypesEnum.CLASS:
            if (!entity.color)
              colorManager.setClassColor(entity)
            this.diagramBuilder.addClass(entity, elem as GrapholNode)
            break
        }

        this.updateEntityNameType(entity.iri.fullIri)
      }
    }

    const classInstanceEntities = RDFGraphParser.getClassInstances(rdfGraph, this.grapholscape.ontology.namespaces)

    classInstanceEntities.forEach((instanceEntity, iri) => {
      if (!this.classInstanceEntities.get(iri))
        this.classInstanceEntities.set(iri, instanceEntity)
    })

    const diagram = RDFGraphParser.getDiagrams(
      rdfGraph,
      this.grapholscape.ontology,
      this.classInstanceEntities,
      RendererStatesEnum.INCREMENTAL)[0]

    if (diagram) {
      const diagramRepr = diagram.representations.get(RendererStatesEnum.INCREMENTAL)

      this.performActionWithBlockedGraph(() => {
        let elem: GrapholElement | undefined
        diagramRepr?.cy.nodes().forEach(node => {
          elem = diagramRepr.grapholElements.get(node.id())
          if (elem)
            addElemToIncremental(elem, diagramRepr)
        })

        diagramRepr?.cy.edges().forEach(edge => {
          elem = diagramRepr.grapholElements.get(edge.id())
          if (elem)
            addElemToIncremental(elem, diagramRepr)
        })
      },
        { // layout options
          centerGraph: true,
          boundingBox: {
            x1: 0,
            y1: 0,
            h: (diagramRepr?.grapholElements.size || 10) * 5,
            w: (diagramRepr?.grapholElements.size || 10) * 5,
          },
          randomize: true,
          fit: true,
        }
      )
    }
  }

  /**
   * Given source instance and target instance IRIs and a path to traverse,
   * add to the diagram the set of instances/object properties resulting
   * from the CONSTRUCT query over the path.
   */
  async addInstancesPath(sourceIri: string, targetIri: string, path: OntologyPath) {

    const sourceEntity = this.classInstanceEntities.get(sourceIri) || this.ontology.getEntity(sourceIri)
    const targetEntity = this.classInstanceEntities.get(targetIri) || this.ontology.getEntity(targetIri)

    if (sourceEntity && targetEntity) {
      /**
       * If source is a class, swap source and target
       */
      if (sourceEntity.is(TypesEnum.CLASS)) {
        [sourceIri, targetIri] = [targetIri, sourceIri]
      }
    }

    const rdfGraph = await this.endpointController?.requestInstancesPath(
      sourceIri,
      targetIri,
      path
    )

    if (rdfGraph) {
      this.addRDFGraph(rdfGraph)
    } else {
      showMessage('No results found', 'Info', this.grapholscape.uiContainer)
    }
  }

  addClass(iri: string, centerOnIt = true, position?: Position) {
    const entity = this.grapholscape.ontology.getEntity(iri)
    let classNode: GrapholNode | undefined
    if (entity && this.diagram.representation) {
      if (!entity.color) {
        const colorManager = new OntologyColorManager(
          this.ontology,
          this.diagram.representation)

        colorManager.setClassColor(entity)
      }

      classNode = this.diagramBuilder.addClass(entity, position) as GrapholNode

      this.updateEntityNameType(entity.iri)

      if (entity.is(TypesEnum.CLASS))
        this.countInstancesForClass(iri, false)
    } else {
      const classNodeId = this.getIDByIRI(iri, TypesEnum.CLASS)
      if (classNodeId)
        classNode = this.diagram.representation?.grapholElements.get(classNodeId) as GrapholNode
    }

    if (centerOnIt && classNode)
      this.grapholscape.centerOnElement(classNode.id)

    this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    return classNode
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
    let subClassEntity: GrapholEntity | undefined
    let subClassNode: GrapholElement | undefined
    let connectedEdges: EdgeCollection | undefined
    for (let subClassIri of connectedClassesIris) {
      subClassEntity = this.grapholscape.ontology.getEntity(subClassIri)
      if (subClassEntity) {
        subClassNode = subClassEntity.getOccurrenceByType(TypesEnum.CLASS, RendererStatesEnum.INCREMENTAL)

        if (subClassNode) {
          connectedEdges = this.grapholscape.renderer.cy?.$id(subClassNode.id)
            .connectedEdges(`[ type ="${positionType === 'equivalent' ? TypesEnum.EQUIVALENCE : TypesEnum.INCLUSION}" ]`)

          if (connectedEdges) {
            if (positionType === 'sub' && connectedEdges.targets(`[iri = "${classIri}"]`).empty())
              return false

            if (positionType === 'super' && connectedEdges.sources(`[iri = "${classIri}"]`).empty())
              return false

            if (positionType === 'equivalent' && connectedEdges.connectedNodes(`[iri = "${classIri}"]`).empty())
              return false
          }
        } else {
          return false
        }
      }
    }

    return true
  }

  reset() {
    this.incrementalRenderer?.reset()
    this.classInstanceEntities.clear()
    let clearedEntities: string[] = []
    this.diagram.representation?.grapholElements.forEach(elem => {
      if (elem.iri && !clearedEntities.includes(elem.iri) && elem.type !== TypesEnum.CLASS_INSTANCE) {
        const entity = this.grapholscape.ontology.getEntity(elem.iri)
        if (entity) {
          entity.occurrences.set(RendererStatesEnum.INCREMENTAL, [])
        }

        clearedEntities.push(elem.iri)
      }
    })
    clearedEntities = []
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
    // let entityElement = this.diagram.representation?.grapholElements.get(entityIri)
    if (entity) {
      let entityOccurrences = entity.occurrences.get(RendererStatesEnum.INCREMENTAL)

      if (entityOccurrences) {
        // set the displayed name based on current entity name type
        entityOccurrences.forEach(element => {
          element.displayedName = entity.getDisplayedName(
            this.grapholscape.entityNameType,
            this.grapholscape.language
          )
          this.diagram?.representation?.updateElement(element, entity, false)
        })
      }
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
        const edges = element.connectedEdges(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`)
        edges.forEach(objectPropertyEdge => {
          const objectPropertyEntity = this.ontology.getEntity(objectPropertyEdge.data().iri)
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

          this.ontology.getSuperHierarchiesOf(entity!.iri.fullIri).forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })

          this.ontology.getSubHierarchiesOf(entity!.iri.fullIri).forEach(hierarchy => {
            this.removeHierarchy(hierarchy)
          })
        }


        if (entity && this.diagram.representation) {
          const grapholOccurrence = this.diagram.representation?.grapholElements.get(element.id())
          if (grapholOccurrence) {
            entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
          }
          this.diagram.removeElement(element.id())

          if (entity.is(TypesEnum.CLASS_INSTANCE))
            this.classInstanceEntities.delete(entity.iri.fullIri)

          this.classFilterMap.delete(entity.fullIri)
        }

      })
    })
  }

  addInstance(instance: ClassInstance, parentClassesIris?: string[] | string, position?: Position) {
    let classInstanceEntity = this.classInstanceEntities.get(instance.iri)

    // if not already present, then build classInstanceEntity and add it to diagram
    if (!classInstanceEntity) {
      const classInstanceIri = new Iri(instance.iri, this.ontology.namespaces, instance.shortIri)

      classInstanceEntity = new ClassInstanceEntity(classInstanceIri)

      if (instance.label) {
        classInstanceEntity.addAnnotation(
          new Annotation(DefaultAnnotationProperties.label, instance.label.value, instance.label.language)
        )
      }

      this.endpointController?.requestLabels(instance.iri).then(labels => {
        labels?.forEach(label => {
          classInstanceEntity!.addAnnotation(
            new Annotation(DefaultAnnotationProperties.label, label.value, label.language)
          )
        })

        this.updateEntityNameType(classInstanceEntity!.iri)
      })
      this.classInstanceEntities.set(instance.iri, classInstanceEntity)
    }

    const addedNode = this.diagramBuilder.addClassInstance(classInstanceEntity, position)

    // update parent class Iri
    if (typeof (parentClassesIris) !== 'string') {

      if (!parentClassesIris || parentClassesIris.length === 0) {
        parentClassesIris = this.ontology.getEntitiesByType(TypesEnum.CLASS).map(entity => entity.iri.fullIri)
      }

      this.endpointController?.instanceCheck(instance.iri, parentClassesIris).then(result => {
        result.forEach(classIri => {
          const classEntity = this.ontology.getEntity(classIri)
          if (classEntity && classInstanceEntity) {
            classInstanceEntity.addParentClass(classEntity.iri)

            if (!classInstanceEntity.color && this.diagram.representation) {
              const colorManager = new OntologyColorManager(this.ontology, this.diagram.representation)
              colorManager.setInstanceColor(classInstanceEntity)
              this.diagram.representation.updateElement(addedNode, classInstanceEntity, false)
              setColorList(this.grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend, this.grapholscape)
            }
          }
        })
      })

    } else {
      const parentClassEntity = this.ontology.getEntity(parentClassesIris)
      if (parentClassEntity) {
        classInstanceEntity.addParentClass(parentClassEntity.iri)

        if (!classInstanceEntity.color && this.diagram.representation) {
          const colorManager = new OntologyColorManager(this.ontology, this.diagram.representation)
          colorManager.setInstanceColor(classInstanceEntity)
        }
      }
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
    let objectPropertyEdge: GrapholEdge | undefined
    if (objectPropertyEntity && sourceClass && targetClass) {
      if ((!sourceClass.color || !targetClass.color) && this.diagram.representation) {
        new OntologyColorManager(this.ontology, this.diagram.representation)
          .setClassColor(sourceClass)
          .setClassColor(targetClass)
      }
      objectPropertyEdge = this.diagramBuilder.addObjectProperty(
        objectPropertyEntity,
        sourceClass,
        targetClass,
        TypesEnum.CLASS
      ) as GrapholEdge

      this.updateEntityNameType(objectPropertyEntity.iri)
      this.updateEntityNameType(sourceClassIri)
      this.updateEntityNameType(targetClassIri)

      this.countInstancesForClass(sourceClassIri, false)
      this.countInstancesForClass(targetClassIri, false)

      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
      return objectPropertyEdge
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

    if (objectPropertyEntity && sourceInstanceEntity && targetInstanceEntity && this.diagram.representation) {
      new OntologyColorManager(this.ontology, this.diagram.representation)
        .setInstanceColor(sourceInstanceEntity)
        .setInstanceColor(targetInstanceEntity)
  
      this.diagramBuilder.addObjectProperty(
        objectPropertyEntity,
        sourceInstanceEntity,
        targetInstanceEntity,
        TypesEnum.CLASS_INSTANCE
      )

      this.updateEntityNameType(objectPropertyEntity.iri)
      this.updateEntityNameType(sourceInstanceEntity.iri)
      this.updateEntityNameType(targetInstanceEntity.iri)

      this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
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
      let sourceParentClassId: string | undefined
      let targetParentClassId: string | undefined
      let sourceClassInstanceId: string | undefined
      let targetClassInstanceId: string | undefined
      this.performActionWithBlockedGraph(() => {
        sourceClassInstanceEntity.parentClassIris.forEach(sourceParentClassIri => {
          targetClassInstanceEntity.parentClassIris.forEach(targetParentClassIri => {

            sourceClassInstanceId = this.getIDByIRI(sourceClassInstanceIri, TypesEnum.CLASS_INSTANCE)
            sourceParentClassId = this.getIDByIRI(sourceParentClassIri.fullIri, TypesEnum.CLASS)

            targetClassInstanceId = this.getIDByIRI(targetClassInstanceIri, TypesEnum.CLASS_INSTANCE)
            targetParentClassId = this.getIDByIRI(targetParentClassIri.fullIri, TypesEnum.CLASS)

            if (sourceParentClassId && targetParentClassId && sourceClassInstanceId && targetClassInstanceId) {
              this.addIntensionalObjectProperty(
                objectPropertyIri,
                sourceParentClassIri.fullIri,
                targetParentClassIri.fullIri,
              )

              this.addEdge(sourceClassInstanceId, sourceParentClassId, TypesEnum.INSTANCE_OF)
              this.addEdge(targetClassInstanceId, targetParentClassId, TypesEnum.INSTANCE_OF)
            }
          })
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
    const sub = this.ontology.getSubHierarchiesOf(classIri) // get hiearchies with class being a superclass => get sub classes
    const superh = this.ontology.getSuperHierarchiesOf(classIri) // get hierarchies with class being a subclass => get super classes
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

  // private addHierarchy(hierarchy: Hierarchy, position?: Position) {
  //   // const unionNode = hierarchy.getUnionGrapholNode(position)
  //   // const inputEdges = hierarchy.getInputGrapholEdges(this.diagram.id, RendererStatesEnum.INCREMENTAL)
  //   // const inclusionEdges = hierarchy.getInclusionEdges(this.diagram.id, RendererStatesEnum.INCREMENTAL)

  //   if (!hierarchy.id)
  //     return

  //   // Add inputs
  //   for (const inputClassIri of hierarchy.inputs) {
  //     this.addClass(inputClassIri.iri.fullIri, false)
  //   }

  //   for (const superClass of hierarchy.superclasses) {
  //     this.addClass(superClass.classEntity.iri.fullIri, false)
  //   }

  //   this.diagramBuilder.addHierarchy(hierarchy)

  //   // hierarchy.getInputGrapholEdges()?.forEach(inputEdge => this.diagram.addElement(inputEdge))
  //   // hierarchy.getInclusionEdges()?.forEach(inclusionEdge => this.diagram.addElement(inclusionEdge))
  // }

  private removeHierarchy(hierarchy: Hierarchy, entitiesTokeep: string[] = []) {
    if (!this.incrementalRenderer || !hierarchy.id || (hierarchy.id && this.grapholscape.renderer.cy?.$id(hierarchy.id).empty()))
      return

    // remove union node
    this.diagram.removeElement(hierarchy.id)

    // remove input edges
    hierarchy.getInputGrapholEdges(this.diagram.id, RendererStatesEnum.INCREMENTAL)?.forEach(inputEdge => {
      this.diagram?.removeElement(inputEdge.id)
    })

    // remove inclusion edges
    hierarchy.getInclusionEdges(this.diagram.id, RendererStatesEnum.INCREMENTAL)?.forEach(inclusionEdge => {
      this.diagram?.removeElement(inclusionEdge.id)
    })

    let entity: GrapholEntity | null
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


  // ------------------------ SHOW CLASSES IN ISA ---------------------------------------

  showSubClassesOf(classIri: string, subclassesIris?: string[]) {
    if (!subclassesIris) {
      subclassesIris = this.neighbourhoodFinder.getSubclassesIris(classIri)
    }
    this.showClassesInIsa(classIri, subclassesIris, TypesEnum.INCLUSION)
  }

  showSuperClassesOf(classIri: string, superclassesIris?: string[]) {
    if (!superclassesIris) {
      superclassesIris = this.neighbourhoodFinder.getSuperclassesIris(classIri)
    }
    this.showClassesInIsa(classIri, superclassesIris, TypesEnum.INCLUSION, 'super')
  }

  showEquivalentClassesOf(classIri: string, equivalentClassesIris?: string[]) {
    if (!equivalentClassesIris) {
      equivalentClassesIris = this.neighbourhoodFinder.getEquivalentClassesIris(classIri)
    }
    this.showClassesInIsa(classIri, equivalentClassesIris, TypesEnum.EQUIVALENCE)
  }

  private showClassesInIsa(
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
        ?.map(dp => this.ontology.getEntity(dp) || new GrapholEntity(new Iri(dp, this.ontology.namespaces)))
        .filter(dpEntity => dpEntity !== undefined) as GrapholEntity[]
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
        this.lifecycle.trigger(IncrementalEvent.LoadingStarted, instanceIri, TypesEnum.CLASS_INSTANCE)
        const results: Map<GrapholEntity, {
          ranges: {
            classEntity: GrapholEntity,
            classInstances: ClassInstance[],
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
                    classInstances: [result[0][0]] // limit is 1, array of 1 class instance
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
          this.lifecycle.trigger(IncrementalEvent.LoadingFinished, instanceIri, TypesEnum.CLASS_INSTANCE)
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
            if (this.grapholscape.uiContainer) {
              showMessage(`
                Focus instance [${instanceEntity.getDisplayedName(this.grapholscape.entityNameType, this.grapholscape.language)}] took too long, reached timeout limit.
                Partial results might be shown, ok?
              `, 'Timeout Reached',
                this.grapholscape.uiContainer
              )
                .onConfirm(onDone)
                .onCancel(() => this.lifecycle.trigger(IncrementalEvent.LoadingFinished, instanceIri, TypesEnum.CLASS_INSTANCE))
            }
          }
        }, 10000)
      }
    }
  }

  /**
   * Retrieve all class instances participating to an object property
   * with another instance and add it to diagram with the extensional
   * object property.
   * (called by navigation menu to auto expand an object property)
   * @param instanceIri 
   * @param objectPropertyIri 
   * @param isDirect 
   */
  expandObjectPropertyOnInstance(instanceIri: string, objectPropertyIri: string, isDirect: boolean) {
    if (!this.endpointController?.isReasonerAvailable() || !this.endpointController.vkgApi) {
      return
    }

    const resultForFocus: Map<GrapholEntity, {
      ranges: {
        classInstances: ClassInstance[],
      }[],
      isDirect: boolean
    }> = new Map()

    const objectPropertyEntity = this.grapholscape.ontology.getEntity(objectPropertyIri)
    if (!objectPropertyEntity) return

    resultForFocus.set(objectPropertyEntity, {
      ranges: [{ classInstances: [] }],
      isDirect: isDirect,
    })

    this.lifecycle.trigger(IncrementalEvent.LoadingStarted, instanceIri, TypesEnum.CLASS_INSTANCE)

    this.endpointController.vkgApi.getInstancesThroughObjectProperty(
      instanceIri,
      objectPropertyIri,
      isDirect,
      false,
      (results) => { // onNewResult
        results.forEach(result => {
          resultForFocus.get(objectPropertyEntity)?.ranges[0].classInstances.push(result[0])
        })

        this.addResultsFromFocus(instanceIri, resultForFocus)
      },
      undefined, // range class filter
      undefined, // data property filter
      undefined, // text search
      () => this.lifecycle.trigger(IncrementalEvent.LoadingFinished, instanceIri, TypesEnum.CLASS_INSTANCE), // on stop polling
      100,
      true
    )
  }

  /**
   * Retrieve first page of results for instances of a given class.
   * Then add instances and instance-of edges (if possible) to parent class
   * @param classIri 
   * @param pageSize 
   * @returns 
   */
  expandInstancesOnClass(classIri: string, pageSize?: number) {
    if (!this.endpointController?.vkgApi)
      return

    const parentClassId = this.getIDByIRI(classIri, TypesEnum.CLASS)
    const classNodeId = this.getIDByIRI(classIri, TypesEnum.CLASS)
    let classNodePosition: Position | undefined
    if (classNodeId) {
      classNodePosition = this.diagram.representation?.cy.$id(classNodeId).position()
    }

    this.lifecycle.trigger(IncrementalEvent.LoadingStarted, classIri, TypesEnum.CLASS)
    this.endpointController.vkgApi.getInstances(
      classIri,
      false,
      (results) => {
        this.performActionWithBlockedGraph(() => {
          let addedClassInstanceEntity: ClassInstanceEntity, classInstanceId: string | undefined
          results.forEach(result => {
            addedClassInstanceEntity = this.addInstance(result[0], classIri, classNodePosition)
            classInstanceId = this.getIDByIRI(addedClassInstanceEntity.fullIri, TypesEnum.CLASS_INSTANCE)
            if (classInstanceId && parentClassId)
              this.addEdge(classInstanceId, parentClassId, TypesEnum.INSTANCE_OF)
          })
        })
      },
      () => this.lifecycle.trigger(IncrementalEvent.LoadingFinished, classIri, TypesEnum.CLASS),
      undefined, // search text
      pageSize
    )
  }

  focusInstance(classInstance: ClassInstance) {
    this.addInstance(classInstance)
    this.expandObjectPropertiesOnInstance(classInstance.iri)
  }

  private addResultsFromFocus(sourceInstanceIri: string, results: Map<GrapholEntity, {
    ranges: {
      classEntity?: GrapholEntity,
      classInstances: ClassInstance[],
    }[],
    isDirect: boolean
  }>) {
    this.performActionWithBlockedGraph(() => {
      let addedClassNode: GrapholElement | undefined
      let addedClassInstanceEntity: ClassInstanceEntity | undefined
      let classInstanceId: string | undefined
      let position: Position | undefined
      const sourceId = this.getIDByIRI(sourceInstanceIri, TypesEnum.CLASS_INSTANCE)
      if (sourceId) {
        position = this.diagram.representation?.cy.$id(sourceId).position()
      }

      results.forEach((result, objectPropertyEntity) => {
        result.ranges.forEach(range => {
          range.classInstances.forEach((classInstance, i) => {
            addedClassInstanceEntity = this.addInstance(classInstance, range.classEntity?.iri.fullIri, position)
            classInstanceId = addedClassInstanceEntity.getOccurrenceByType(
              TypesEnum.CLASS_INSTANCE,
              RendererStatesEnum.INCREMENTAL)?.id

            if (range.classEntity && i === 0 && classInstanceId) {
              addedClassNode = this.addClass(range.classEntity.iri.fullIri)
              if (addedClassNode)
                this.addEdge(classInstanceId, addedClassNode.id, TypesEnum.INSTANCE_OF)
            }

            result.isDirect
              ? this.addExtensionalObjectProperty(objectPropertyEntity.iri.fullIri, sourceInstanceIri, classInstance.iri)
              : this.addExtensionalObjectProperty(objectPropertyEntity.iri.fullIri, classInstance.iri, sourceInstanceIri)
          })
        })
      })
    })
  }

  async addPath(path: Entity[]) {
    this.performActionWithBlockedGraph(() => {
      if (!this.diagram.representation)
        return

      let i = 0
      let cyElems: Collection = this.diagram.representation.cy.collection()
      let elemId: string | undefined

      let sourceClassIri: string | undefined, targetClassIri: string | undefined
      for (let entity of path) {
        if (entity.type === EntityTypeEnum.ObjectProperty || entity.type === EntityTypeEnum.InverseObjectProperty) {
          if (!path[i + 1] || !path[i - 1])
            return

          sourceClassIri = path[i - 1].iri
          targetClassIri = path[i + 1].iri

          if (!sourceClassIri || !targetClassIri)
            return

          if (entity.iri === "http://www.w3.org/2000/01/rdf-schema#subClassOf") {
            const sourceId = this.addClass(sourceClassIri)?.id
            const targetId = this.addClass(targetClassIri)?.id
            if (sourceId && targetId) {
              if (entity.type === EntityTypeEnum.ObjectProperty)
                elemId = this.addEdge(sourceId, targetId, TypesEnum.INCLUSION)?.id
              else
                elemId = this.addEdge(targetId, sourceId, TypesEnum.INCLUSION)?.id
            }
          } else if (entity.iri) {
            if (entity.type === EntityTypeEnum.ObjectProperty)
              elemId = this.addIntensionalObjectProperty(entity.iri, sourceClassIri, targetClassIri)?.id
            else
              elemId = this.addIntensionalObjectProperty(entity.iri, targetClassIri, sourceClassIri)?.id
          }

          // create collection of elems to flash class and highlight them
          if (elemId)
            cyElems = cyElems.union(this.diagram.representation.cy.$id(elemId))

          elemId = this.getIDByIRI(sourceClassIri, TypesEnum.CLASS)
          if (elemId)
            cyElems = cyElems.union(this.diagram.representation.cy.$id(elemId))

          elemId = this.getIDByIRI(targetClassIri, TypesEnum.CLASS)
          if (elemId)
            cyElems = cyElems.union(this.diagram.representation.cy.$id(elemId))

        }

        i += 1
      }

      // clear previous highlighting
      this.diagram.representation.cy.$('.path').removeClass('path')
      // highlight current path
      cyElems.addClass('path')
      // clear highlight at any tap
      this.diagram.representation.cy.one('tap', e => cyElems.removeClass('path'))
      setTimeout(() => this.diagram.representation?.cy.fit(cyElems, 200), 500)
    })
  }

  // runLayout = () => {
  //   this.incrementalRenderer?.runLayout()
  // }
  pinNode = (node: NodeSingular | string) => this.incrementalRenderer?.pinNode(node)
  unpinNode = (node: NodeSingular | string) => this.incrementalRenderer?.unpinNode(node)

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

  async countInstancesForClass(classIri: string, askFreshValue = true) {
    if (!this.countersEnabled || !this.endpointController?.isReasonerAvailable()) return
    const nodeId = this.getIDByIRI(classIri, TypesEnum.CLASS)
    if (!nodeId) return

    const node = this.diagram?.representation?.cy.$id(nodeId)
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

    // const classOrInstanceSelector = `node[type = "${TypesEnum.CLASS}"], node[type = "${TypesEnum.CLASS_INSTANCE}"]`
    this.diagram.representation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === TypesEnum.CLASS || targetType === TypesEnum.CLASS_INSTANCE) {

        const triggerSelectionEvent = () => {
          // this.diagramBuilder.referenceNodeId = evt.target.id()
          const targetIri = evt.target.data().iri

          if (targetType === TypesEnum.CLASS_INSTANCE) {
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

  public getIDByIRI(iri: string, type: TypesEnum) {
    const entity = this.classInstanceEntities.get(iri) || this.grapholscape.ontology.getEntity(iri)
    if (entity) {
      return entity.getOccurrenceByType(type, RendererStatesEnum.INCREMENTAL)?.id
    }
  }

  get numberOfElements() { return this.grapholscape.renderer.cy?.elements().size() || 0 }
}