import { CollectionReturnValue } from 'cytoscape'
import AnnotatedElement from './annotated-element'
import Diagram from './diagrams/diagram'
import DiagramRepresentation from './diagrams/diagram-representation'
import { Hierarchy } from './graph-structures'
import GrapholEntity from './graphol-elems/entity'
import GrapholElement from './graphol-elems/graphol-element'
import GrapholNode from './graphol-elems/node'
import Namespace from './namespace'
import { RDFGraphMetadata, TypesEnum } from './rdf-graph/swagger'
import { RendererStatesEnum } from './renderers/i-render-state'
/**
 * # Ontology
 * Class used as the Model of the whole app.
 */
class Ontology extends AnnotatedElement implements RDFGraphMetadata {
  name: string
  version: string
  namespaces: Namespace[] = []
  diagrams: Diagram[] = []
  languages: string[] = []
  defaultLanguage?: string
  iri?: string

  private _entities: Map<string, GrapholEntity> = new Map()

  // computed only in floaty
  hierarchiesBySubclassMap: Map<string, Hierarchy[]> = new Map()
  hierarchiesBySuperclassMap: Map<string, Hierarchy[]> = new Map()

  /**
   * @param {string} name
   * @param {string} version
   * @param {Namespace[]} namespaces
   * @param {Diagram[]} diagrams
   */
  constructor(name: string, version: string, iri?: string, namespaces: Namespace[] = [], diagrams: Diagram[] = []) {
    super()
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.version = version
    /** @type {Namespace[]} */
    this.namespaces = namespaces
    /** @type {Diagram[]} */
    this.diagrams = diagrams

    this.iri = iri
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


  /** @param {Diagram} diagram */
  addDiagram(diagram: Diagram) {
    this.diagrams.push(diagram)
  }

  /**
   * Get the diagram with the given id
   */
  getDiagram(diagramId: number): Diagram | undefined {
    if (diagramId < 0 || diagramId > this.diagrams.length) return
    return this.diagrams.find(diagram => diagram.id === diagramId)
  }

  getDiagramByName(name: string): Diagram | undefined {
    return this.diagrams.find(d => d.name.toLowerCase() === name?.toLowerCase())
  }

  addEntity(entity: GrapholEntity) {
    this.entities.set(entity.iri.fullIri, entity)
  }

  getEntity(iri: string) {
    for (let entity of this.entities.values()) {
      if (entity.iri.equals(iri)) {
        return entity
      }
    }
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

    for (let diagram of this.diagrams) {
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

  // /**
  //  * Get an element in the ontology by id, searching in every diagram
  //  * @param {string} elem_id - The `id` of the elem to retrieve
  //  * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
  //  */
  // getElem(elem_id: string): cytoscape.CollectionReturnValue {
  //   for (let diagram of this.diagrams) {
  //     let node = diagram.cy.$id(elem_id)
  //     if (node.length > 0) return node
  //   }
  // }

  /**
   * Retrieve an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
   */
  // getEntity(iri: string): cytoscape.CollectionReturnValue {
  //   if (this.getEntityOccurrences(iri)) return this.getEntityOccurrences(iri)[0]
  // }

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

  // /**
  //  * Get an element in the ontology by its id and its diagram id
  //  * @param {string} elemID - The id of the element to retrieve
  //  * @param {number} diagramID - the id of the diagram containing the element
  //  * @returns {cytoscape.CollectionReturnValue} The element in cytoscape object representation
  //  */
  // getElemByDiagramAndId(elemID: string, diagramID: number): cytoscape.CollectionReturnValue {
  //   let diagram = this.getDiagram(diagramID)

  //   if (diagram) {
  //     return diagram.cy.$id(elemID)
  //   }
  // }

  /**
   * Get the entities in the ontology
   * @returns {Object.<string, cytoscape.CollectionReturnValue[]>} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
   */
  // getEntities(): { [s: string]: cytoscape.CollectionReturnValue[] } {
  //   let entities = {}
  //   this.diagrams.forEach(diagram => {
  //     diagram.cy.$('.predicate').forEach(entity => {
  //       let iri = entity.data('iri').fullIri

  //       if (!Object.keys(entities).includes(iri)) {
  //         entities[iri] = []
  //       }

  //       entities[iri].push(entity)
  //     })
  //   })

  //   //this._entities = entities
  //   return entities
  // }

  /**
   * Check if entity has the specified iri in full or prefixed form
   * @param {Entity} entity 
   * @param {string} iri
   * @returns {boolean}
   */
  // checkEntityIri(entity: Entity, iri: string): boolean {
  //   /** @type {Iri} */
  //   let entityIri: Iri = entity.data('iri') || entity.data.iri
  //   return entityIri.fullIri === iri ||
  //     entityIri.prefixed === iri
  // }

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
              representation?.updateElement(occurrence.id)
            }
          }
        })
      }
    })
  }

  get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0) }

  get entities() { return this._entities }
  set entities(newEntities: Map<string, GrapholEntity>) {
    this._entities = newEntities
  }
}

export default Ontology