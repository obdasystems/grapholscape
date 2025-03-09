import { CollectionReturnValue, NodeSingular } from 'cytoscape'
import AnnotatedElement from './annotated-element'
import Diagram from './diagrams/diagram'
import DiagramRepresentation from './diagrams/diagram-representation'
import { Hierarchy } from './graph-structures'
import GrapholEntity from './graphol-elems/entity'
import GrapholElement from './graphol-elems/graphol-element'
import { GrapholNode } from './graphol-elems/node'
import Iri from './iri'
import Namespace from './namespace'
import { RDFGraphConfigEntityNameTypeEnum, RDFGraphMetadata, SHACLShape, TypesEnum } from './rdf-graph/swagger'
import { RendererStatesEnum } from './renderers/i-render-state'
import AnnotationProperty from './annotation-property'
import Annotation from './annotation'
import { Language } from '../config'
import AnnotationsDiagram from './diagrams/annotations-diagram'

/**
 * ### Ontology
 * Class used as the Model of the whole app.
 */
class Ontology extends AnnotatedElement implements RDFGraphMetadata {
  name: string
  version: string
  namespaces: Namespace[] = []
  annProperties: AnnotationProperty[] = []
  private _diagrams: Map<string, Diagram> = new Map()
  ontologyEntity?: GrapholEntity
  languages: string[] = []
  defaultLanguage?: string
  iri?: string
  usedColorScales: string[] = []
  shaclConstraints: Map<string, SHACLShape[]> = new Map()

  constructor(name: string, version: string, iri?: string, namespaces: Namespace[] = [], annProperties: AnnotationProperty[] = [], diagrams: Diagram[] = []) {
    super()

    this.name = name
    this.version = version
    this.namespaces = namespaces
    this.annProperties = annProperties
    diagrams.forEach(d => this.addDiagram(d))
    this.iri = iri
    if (this.iri) {
      this.ontologyEntity = new GrapholEntity(new Iri(this.iri, this.namespaces))
    }
  }

  private _entities: Map<string, GrapholEntity> = new Map()

  // computed only in floaty
  private _hierarchies: Map<string, Hierarchy> = new Map()
  private _subHierarchiesMap: Map<string, Set<Hierarchy>> = new Map()
  private _superHierarchiesMap: Map<String, Set<Hierarchy>> = new Map()
  private _inclusions: { subclass: GrapholEntity, superclass: GrapholEntity }[] = []

  addHierarchy(hierarchy: Hierarchy) {
    this._hierarchies.set(hierarchy.id, hierarchy)

    let hierarchiesSet: Set<Hierarchy> | undefined
    hierarchy.inputs.forEach(inputClass => {
      hierarchiesSet = this._superHierarchiesMap.get(inputClass.fullIri)
      if (!hierarchiesSet) {
        this._superHierarchiesMap.set(inputClass.fullIri, new Set([hierarchy]))
      } else {
        hierarchiesSet.add(hierarchy)
      }
    })

    hierarchy.superclasses.map(sc => sc.classEntity).forEach(superClass => {
      hierarchiesSet = this._subHierarchiesMap.get(superClass.fullIri)
      if (!hierarchiesSet) {
        this._subHierarchiesMap.set(superClass.fullIri, new Set([hierarchy]))
      } else {
        hierarchiesSet.add(hierarchy)
      }
    })
  }

  removeHierarchy(hiearchyId: string): void
  removeHierarchy(hiearchyId: Hierarchy): void
  removeHierarchy(hierarchyOrId: Hierarchy | string) {
    let hierarchy: Hierarchy | undefined
    if (typeof hierarchyOrId === 'string') {
      hierarchy = this.getHierarchy(hierarchyOrId)
    }

    if (hierarchy) {
      this._hierarchies.delete(hierarchy.id)

      this._subHierarchiesMap.forEach(sh => {
        sh.delete(hierarchy!)
      })

      this._superHierarchiesMap.forEach(sh => {
        sh.delete(hierarchy!)
      })
    }
  }

  getHierarchy(hierarchyId: string) {
    return this._hierarchies.get(hierarchyId)
  }

  getHierarchiesOf(classIri: string | Iri) {
    return Array.from(
      new Set(Array.from(this.getSubHierarchiesOf(classIri)).concat(
        Array.from(this.getSuperHierarchiesOf(classIri)))
      )
    )
  }

  /**
   * @param superClassIri the superclass iri
   * @returns The arrary of hiearchies for which a class appear as superclass
   */
  getSubHierarchiesOf(superClassIri: string | Iri) {
    if (typeof superClassIri !== 'string')
      superClassIri = superClassIri.fullIri

    return Array.from(this._subHierarchiesMap.get(superClassIri) || [])
  }

  /**
   * 
   * @param subClassIri 
   * @returns The arrary of hiearchies for which a class appear as subclass
   */
  getSuperHierarchiesOf(subClassIri: string | Iri) {
    if (typeof subClassIri !== 'string')
      subClassIri = subClassIri.fullIri

    return Array.from(this._superHierarchiesMap.get(subClassIri) || [])
  }

  getSubclassesOf(superClassIri: string | Iri) {
    const res: Set<GrapholEntity> = new Set()

    this.getSubHierarchiesOf(superClassIri).forEach(hierarchy => {
      hierarchy.inputs.forEach(classInput => res.add(classInput))
    })

    this._inclusions.forEach(s => {
      if (s.superclass.iri.equals(superClassIri)) {
        res.add(s.subclass)
      }
    })

    return res
  }

  getSuperclassesOf(superClassIri: string | Iri) {
    const res: Set<GrapholEntity> = new Set()

    this.getSuperHierarchiesOf(superClassIri).forEach(hierarchy => {
      hierarchy.superclasses.forEach(sc => res.add(sc.classEntity))
    })

    this._inclusions.forEach(s => {
      if (s.subclass.iri.equals(superClassIri)) {
        res.add(s.superclass)
      }
    })

    return res
  }

  addSubclassOf(subclassIri: string | Iri, superclassIri: string | Iri): void
  addSubclassOf(subclass: GrapholEntity, superclass: GrapholEntity): void
  addSubclassOf(subclass: GrapholEntity | string | Iri, superclass: GrapholEntity | string | Iri) {

    let subclassEntity: GrapholEntity | undefined
    let superclassEntity: GrapholEntity | undefined

    if (!(subclass as unknown as GrapholEntity).types) {
      subclassEntity = this.getEntity(subclass as string | Iri)
    } else {
      subclassEntity = subclass as GrapholEntity
    }

    if (!(superclass as unknown as GrapholEntity).types) {
      superclassEntity = this.getEntity(superclass as string | Iri)
    } else {
      superclassEntity = subclass as GrapholEntity
    }

    if (superclassEntity && subclassEntity) {
      if (!this._inclusions.find(sc => sc.subclass.iri.equals(subclassEntity!.iri) && sc.superclass.iri.equals(superclassEntity!.iri))) {
        this._inclusions.push({ subclass: subclassEntity, superclass: superclassEntity })
      }
    }
  }

  removeSubclassOf(subclassIri: string | Iri, superclassIri: string | Iri): void
  removeSubclassOf(subclass: GrapholEntity, superclass: GrapholEntity): void
  removeSubclassOf(subclass: GrapholEntity | string | Iri, superclass: GrapholEntity | string | Iri) {
    let subclassEntity: GrapholEntity | undefined
    let superclassEntity: GrapholEntity | undefined

    if (!(subclass as unknown as GrapholEntity).types) {
      subclassEntity = this.getEntity(subclass as string | Iri)
    } else {
      subclassEntity = subclass as GrapholEntity
    }

    if (!(superclass as unknown as GrapholEntity).types) {
      superclassEntity = this.getEntity(superclass as string | Iri)
    } else {
      superclassEntity = subclass as GrapholEntity
    }

    this._inclusions.splice(
      this._inclusions.findIndex(sc => sc.subclass === subclassEntity && sc.superclass === superclassEntity),
      1
    )
  }

  /** @param {Namespace} namespace */
  addNamespace(namespace: Namespace) {
    this.namespaces.push(namespace)
  }

  /**
   * Get the Namspace object given its IRI string
   * @param {string} iriValue the IRI assigned to the namespace
   * @returns {Namespace}
   */
  getNamespace(iriValue: string): Namespace | undefined {
    return this.namespaces.find(ns => ns.toString() === iriValue)
  }

  /**
   * Get the Namespace given one of its prefixes
   * @param {string} prefix 
   * @returns {Namespace}
   */
  getNamespaceFromPrefix(prefix: string): Namespace | undefined {
    return this.namespaces.find(ns => ns.hasPrefix(prefix))
  }

  getNamespaces() {
    return this.namespaces
  }

  /** @param {AnnotationProperty} annProperty */
  addAnnotationProperty(annProperty: AnnotationProperty) {
    this.annProperties.push(annProperty)
  }

  /**
   * Get the Namspace object given its IRI string
   * @param {string} iriValue the IRI assigned to the namespace
   * @returns {AnnotationProperty}
   */
  getAnnotationProperty(iriValue: string): AnnotationProperty | undefined {
    return this.annProperties.find(prop => prop.fullIri === iriValue)
  }

  public getAnnotationProperties(): AnnotationProperty[] {
    return this.annProperties
  }

  addDiagram(diagram: Diagram) {
    if (this._diagrams.get(diagram.id.toString())) {
      console.warn(`Diagram with id = ${diagram.id} already existing, has been overridden.`)
    }
    this._diagrams.set(diagram.id.toString(), diagram)
  }

  removeDiagram(diagramId: string | number) {
    this._diagrams.delete(diagramId.toString())
  }

  /**
   * Get the diagram with the given id
   */
  getDiagram(diagramId: string | number): Diagram | undefined {
    return this._diagrams.get(diagramId.toString())
  }

  getDiagramByName(name: string): Diagram | undefined {
    return Array.from(this._diagrams.values()).find(d => d.name.toLowerCase() === name?.toLowerCase())
  }

  addEntity(entity: GrapholEntity) {
    this.entities.set(entity.iri.fullIri, entity)
  }

  getEntity(iri: string | Iri) {
    return this.entities.get(iri.toString())
  }

  getEntitiesByType(entityType: TypesEnum) {
    return Array.from(this.entities).filter(([_, entity]) => entity.is(entityType)).map(([_, entity]) => entity)
  }

  getEntityFromOccurrence(entityOccurrence: GrapholElement) {
    const diagram = this.getDiagram(entityOccurrence.diagramId)
    if (!diagram) return

    if (entityOccurrence.iri) {
      const entity = this.getEntity(entityOccurrence.iri)
      if (entity)
        return entity
    }

    console.warn(`Can't find occurrence ${entityOccurrence.toString()} in any diagram's representation`)
    return undefined
  }

  getGrapholElement(elementId: string, diagramId?: number, renderState = RendererStatesEnum.GRAPHOL) {
    if (diagramId || diagramId === 0)
      return this.getDiagram(diagramId)?.representations.get(renderState)?.grapholElements.get(elementId)

    for (let diagram of this._diagrams.values()) {
      const elem = diagram.representations.get(renderState)?.grapholElements.get(elementId)
      if (elem) return elem
    }
  }

  getGrapholNode(nodeId: string, diagramId?: number, renderState = RendererStatesEnum.GRAPHOL) {
    try {
      const node = this.getGrapholElement(nodeId, diagramId, renderState) as GrapholNode
      return node
    } catch (e) {
      console.error(e)
    }
  }

  getGrapholEdge(edgeId: string, diagramId?: number, renderState = RendererStatesEnum.GRAPHOL) {
    try {
      const edge = this.getGrapholElement(edgeId, diagramId, renderState) as GrapholNode
      return edge
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Retrieve all occurrences of an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns An array of EntityOccurrence objects
   */
  getEntityOccurrences(iri: string, diagramId?: number, renderState?: RendererStatesEnum): Map<RendererStatesEnum, GrapholElement[]> | undefined {
    // return this.entities[iri] || this.entities[this.prefixedToFullIri(iri)]
    return diagramId || diagramId === 0
      ? this.getEntity(iri)?.getOccurrencesByDiagramId(diagramId, renderState)
      : this.getEntity(iri)?.occurrences
  }

  /**
   * Retrieve the full IRI given a prefixed IRI
   * @param {string} prefixedIri a prefixed IRI
   * @returns {string} full IRI
   */
  prefixedToFullIri(prefixedIri: string): string | undefined {
    if (!prefixedIri || typeof (prefixedIri) !== 'string') return
    for (let namespace of this.namespaces) {
      let prefix = namespace.prefixes.find(p => prefixedIri.includes(p + ':'))

      if (prefix) return prefixedIri.replace(prefix + ':', namespace.toString())

      else if (prefixedIri.startsWith(':') && namespace.prefixes.some(p => p === '')) {
        return prefixedIri.replace(':', namespace.toString())
      }
    }
  }

  computeDatatypesOnDataProperties(): void {
    let cyElement: CollectionReturnValue | undefined,
      representation: DiagramRepresentation | undefined,
      datatypeNode: CollectionReturnValue,
      datatype: string,
      occurrences: GrapholElement[] | undefined

    this.entities.forEach((dataPropertyEntity, _) => {
      if (dataPropertyEntity.is(TypesEnum.DATA_PROPERTY)) {
        occurrences = dataPropertyEntity.occurrences.get(RendererStatesEnum.GRAPHOL)
        if (!occurrences)
          return

        // retrieve datatype for dataproperties
        occurrences.forEach(occurrence => {
          representation = this.getDiagram(occurrence.diagramId)
            ?.representations.get(RendererStatesEnum.GRAPHOL)

          cyElement = representation?.cy.$id(occurrence.id)

          if (cyElement && cyElement.nonempty()) {
            datatypeNode = cyElement
              .neighborhood(`node[type = "${TypesEnum.RANGE_RESTRICTION}"]`)
              .neighborhood(`node[type = "${TypesEnum.VALUE_DOMAIN}"]`)

            if (datatypeNode.nonempty()) {
              datatype = datatypeNode.first().data('displayedName')
              dataPropertyEntity.datatype = datatype
              representation?.updateElement(occurrence.id, dataPropertyEntity)
            }
          }
        })
      }
    })
  }

  computeInverseObjectProperties(): void {
    let grapholRepr: DiagramRepresentation | undefined
    let baseObjectPropertyNode: NodeSingular | undefined
    let baseObjectPropertyEntity: GrapholEntity | undefined
    let inverseObjectPropertyEntity: GrapholEntity | undefined
    for (let diagram of this.diagrams) {
      grapholRepr = diagram.representations.get(RendererStatesEnum.GRAPHOL)
      if (grapholRepr) {
        const roleInverseNodes = grapholRepr.cy.$(`node[type = "${TypesEnum.ROLE_INVERSE}"]`)
        roleInverseNodes.forEach(roleInverseNode => {
          baseObjectPropertyNode = roleInverseNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`).sources().first()
          if (baseObjectPropertyNode.nonempty()) {
            baseObjectPropertyEntity = this.getEntity(baseObjectPropertyNode.data().iri)
            if (baseObjectPropertyEntity) {
              roleInverseNode.connectedEdges(`[type != "${TypesEnum.INPUT}"]`).connectedNodes("[iri]").forEach(objectPropertyNode => {
                inverseObjectPropertyEntity = this.getEntity(objectPropertyNode.data().iri)
                if (inverseObjectPropertyEntity?.is(TypesEnum.OBJECT_PROPERTY)) {
                  baseObjectPropertyEntity!.addInverseObjectProperty(inverseObjectPropertyEntity.iri.fullIri)
                  inverseObjectPropertyEntity.addInverseObjectProperty(baseObjectPropertyEntity!.iri.fullIri)
                }
              })
            }
          }
        })
      }
    }
  }

  /** @override */
  public addAnnotation(newAnnotation: Annotation): void {
    super.addAnnotation(newAnnotation)

    if (!this.iri) {
      console.warn('ontology has no defined IRI. Unable to add annotation to ontology entity node.')
      return
    }

    if (!this.annotationsDiagram) {
      this._diagrams.set("-1", new AnnotationsDiagram())
    }

    if (!this.ontologyEntity) {
      this.ontologyEntity = new GrapholEntity(new Iri(this.iri, this.namespaces))
    }

    const annotationPropertyEntity = this.getEntity(newAnnotation.propertyIri)

    if (annotationPropertyEntity && newAnnotation.rangeIri) {
      this.annotationsDiagram!.addIRIValueAnnotation(
        this.ontologyEntity,
        annotationPropertyEntity,
        newAnnotation.rangeIri,
        RDFGraphConfigEntityNameTypeEnum.LABEL,
        Language.EN,
        this.getEntity(newAnnotation.rangeIri)
      )
    }
  }

  get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0) }

  get entities() { return this._entities }
  set entities(newEntities: Map<string, GrapholEntity>) {
    this._entities = newEntities
  }

  get annotationsDiagram(): AnnotationsDiagram | undefined {
    return this.getDiagram(-1) as AnnotationsDiagram | undefined
  }

  get diagrams() {
    return Array.from(this._diagrams.values())
  }

  set diagrams(diagram: Diagram[]) {
    this._diagrams = new Map()
    diagram.forEach(d => this.addDiagram(d))
  }

  get diagramsMap() {
    return this._diagrams
  }
}

export default Ontology