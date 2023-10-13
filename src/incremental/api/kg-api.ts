import { TypesEnum } from '../../model'
import { RDFGraph } from '../../model/rdf-graph/swagger'
import QueryManager from '../queries/query-manager'
import { ResultRecord } from '../queries/query-poller'
import * as QueriesTemplates from '../queries/query-templates'
import handleApiCall from './handle-api-call'
import { EmptyUnfoldingEntities, HeadTypes, MastroEndpoint, MaterializedCounts, QuerySemantics, QueryStatusEnum, RequestOptions } from './model'
import { OntologyPath } from './swagger'
import { Highlights } from './swagger/models/Highlights'

export type ClassInstance = {
  iri: string,
  shortIri?: string,
  label?: {
    language?: string,
    value: string,
  },
  searchMatch?: string,
}

// export type ObjectPropertyInstance = {
//   iri: string,
//   domain: ClassInstance,
//   range: ClassInstance,
// }

export interface IVirtualKnowledgeGraphApi {
  getInstances: (iri: string, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, onStop?: () => void, searchText?: string) => void,
  getNewResults: (executionId: string, pageNumber: number, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, onStop?: () => void, pageSize?: number) => Promise<void>,
  getInstancesByPropertyValue: (classIri: string, propertyIri: string, propertyType: string, propertyValue: string, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, isDirect?: boolean, onStop?: () => void) => void,
  getInstancesNumber: (endpoint: MastroEndpoint, classIri: string, entityType: TypesEnum.CLASS | TypesEnum.OBJECT_PROPERTY) => Promise<number>,
  getHighlights: (iri: string) => Promise<Highlights>,
  getEntitiesEmptyUnfoldings: (endpoint: MastroEndpoint) => Promise<EmptyUnfoldingEntities>
  getInstanceDataPropertyValues: (instanceIri: string, dataPropertyIri: string, onNewResults: (values: string[]) => void, onStop?: () => void) => void,
  getInstancesThroughObjectProperty: (instanceIri: string, objectPropertyIri: string, isDirect: boolean, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, rangeClassesIri?: string[], dataPropertyFilterIri?: string, textSearch?: string, onStop?: () => void, customLimit?: number, keepAlive?: boolean) => void
  setEndpoint: (endpoint: MastroEndpoint) => void,
  instanceCheck: (instanceIri: string, classesToCheck: string[], onResult: (classIris: string[]) => void, onStop: () => void) => Promise<void>,
  stopAllQueries: () => void,
  getInstanceLabels: (instanceIri: string, onResult: (result: { value: string, lang?: string }[]) => void) => Promise<void>
  getIntensionalShortestPath: (sourceClassIri: string, targetClassIri: string, kShortest?: boolean) => Promise<OntologyPath[]>
  getExtensionalShortestPath: (path: OntologyPath, onNewResult: (rdfGraph?: RDFGraph) => void, sourceInstanceIri?: string, targetInstanceIri?: string,) => Promise<void>
  pageSize: number
}

export default class VKGApi implements IVirtualKnowledgeGraphApi {
  private queryManager: QueryManager
  public language: string

  constructor(private requestOptions: RequestOptions, endpoint: MastroEndpoint, public pageSize: number) {
    this.setEndpoint(endpoint)
  }

  async getInstances(iri: string, includeLabels: boolean, onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void, onStop?: () => void, searchText?: string, pageSize?: number) {
    const _pageSize = pageSize || this.pageSize
    let queryCode: string

    if (searchText) {
      if (includeLabels) {
        queryCode = QueriesTemplates.getInstancesByLabel(iri, searchText)
      } else {
        queryCode = QueriesTemplates.getInstancesByIRI(iri, searchText)
      }
    } else {
      queryCode = QueriesTemplates.getInstances(iri, includeLabels)
    }

    const queryPoller = await this.queryManager.performQuery(queryCode, _pageSize)
    queryPoller.onNewResults = (result => {
      onNewResults(
        result.results.map(res => this.getClassInstanceFromQueryResult(res, result.headTerms, result.headTypes)),
        queryPoller.numberResultsAvailable
      )
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()

    return queryPoller.executionId
  }

  async getNewResults(executionId: string,
    pageNumber: number,
    onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void,
    onStop?: () => void,
    pageSize?: number) {

    const _pageSize = pageSize || this.pageSize
    const queryPoller = await this.queryManager.getQueryResults(executionId, _pageSize, pageNumber)

    queryPoller.onNewResults = (result => {
      onNewResults(
        result.results.map(res => this.getClassInstanceFromQueryResult(res, result.headTerms, result.headTypes)),
        queryPoller.numberResultsAvailable
      )
      queryPoller.stop()
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
  }

  async getInstancesByPropertyValue(
    classIri: string,
    propertyIri: string,
    propertyType: string,
    propertyValue: string,
    includeLabels: boolean,
    onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void,
    isDirect?: boolean,
    onStop?: (() => void),
    pageSize?: number) {

    const _pageSize = pageSize || this.pageSize
    const queryCode = propertyType === TypesEnum.OBJECT_PROPERTY
      ? QueriesTemplates.getInstancesByObjectProperty(classIri, propertyIri, propertyValue, isDirect, includeLabels)
      : QueriesTemplates.getInstancesByDataProperty(classIri, propertyIri, propertyValue, includeLabels)
    const queryPoller = await this.queryManager.performQuery(queryCode, _pageSize)
    queryPoller.onNewResults = (result => {
      onNewResults(
        result.results.map(res => this.getClassInstanceFromQueryResult(res, result.headTerms, result.headTypes)),
        queryPoller.numberResultsAvailable
      )
    })

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()

    return queryPoller.executionId
  }

  async getInstancesNumber(endpoint: MastroEndpoint, entityIri: string, entityType: TypesEnum.CLASS | TypesEnum.OBJECT_PROPERTY) {
    const params = entityType === TypesEnum.CLASS
      ? new URLSearchParams({ classIRI: entityIri })
      : new URLSearchParams({ objectPropertyIRI: entityIri })
    const url = new URL(`${this.requestOptions.basePath}/endpoint/${endpoint.name}/countEntityInstances?${params.toString()}`)
    return parseInt(await (await handleApiCall(
      fetch(url, {
        method: 'get',
        headers: this.requestOptions.headers
      }),
      this.requestOptions.onError
    )).text())
  }

  async getHighlights(classIri: string) {
    const params = new URLSearchParams({ clickedClassIRI: classIri, version: this.requestOptions.version })
    const url = new URL(`${this.requestOptions.basePath}/owlOntology/${this.requestOptions.name}/highlights?${params.toString()}`)

    return await (await handleApiCall(
      fetch(url, {
        method: 'get',
        headers: this.requestOptions.headers
      }),
      this.requestOptions.onError
    )).json()
  }

  async getEntitiesEmptyUnfoldings(endpoint: MastroEndpoint) {
    return new Promise((resolve: (v: EmptyUnfoldingEntities) => void, reject) => {
      handleApiCall(
        fetch(`${this.requestOptions.basePath}/endpoint/${endpoint.name}/emptyUnfoldingEntities`, {
          method: 'get',
          headers: this.requestOptions.headers,
        }),
        this.requestOptions.onError
      ).then(async response => resolve(await response.json() as EmptyUnfoldingEntities))
        .catch(err => reject(err))
    })
  }

  async getInstanceDataPropertyValues(instanceIri: string, dataPropertyIri: string,
    onNewResults: (values: string[]) => void,
    onStop?: (() => void),
    onError?: (() => void)) {

    const queryCode = QueriesTemplates.getInstanceDataPropertyValues(instanceIri, dataPropertyIri)

    // const pollPage = async (pageNumber: number) => {
    //   const queryPoller = await this.queryManager.performQuery(queryCode, this.limit, pageNumber)

    //   if (queryPoller.status === QueryPollerStatus.STOPPED) {
    //     if (onStop)
    //       onStop()
    //     return
    //   }
    //   queryPoller.start()
    //   queryPoller.onNewResults = (results) => {
    //     onNewResults(results.results.map(res => res[0].value))
    //   }

    //   // If stopped then we need to decide wether to poll next page or not.
    //   // if query has not finished and queryPoller has not been stopped, continue polling for next page
    //   // if has finished or queryPoller has been stopped, then return and call onStop
    //   queryPoller.onStop = async () => {
    //     const queryStatus = await this.queryManager.getQueryStatus(queryPoller.executionId)

    //     if (queryStatus.status === QueryStatusEnum.FINISHED || queryPoller.status === QueryPollerStatus.STOPPED) {
    //       if (onStop)
    //         onStop()

    //       return
    //     }

    //     if (!queryStatus.hasError) {
    //       pollPage(pageNumber + 1) // poll for another page
    //     } else {
    //       if (onError)
    //         onError()
    //     }
    //   }
    // }

    // pollPage(1)

    const queryPoller = await this.queryManager.performQuery(queryCode, this.pageSize, QuerySemantics.CQ)
    queryPoller.onNewResults = (results) => {
      onNewResults(results.results.map(res => res[0].value))
    }

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
  }

  async getInstancesThroughObjectProperty(
    instanceIri: string,
    objectPropertyIri: string,
    isDirect: boolean,
    includeLabels: boolean,
    onNewResults: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void,
    rangeClassesIri?: string[],
    dataPropertyIriFilter?: string,
    textSearch?: string,
    onStop?: (() => void),
    customLimit?: number,
    keepAlive?: boolean,
  ) {

    let queryCode: string

    if (textSearch) {
      if (rangeClassesIri && dataPropertyIriFilter) {
        queryCode = QueriesTemplates.getInstancesThroughOPByDP(
          instanceIri,
          objectPropertyIri,
          rangeClassesIri,
          dataPropertyIriFilter,
          textSearch,
          isDirect,
          includeLabels
        )
      } else {
        if (includeLabels)
          queryCode = QueriesTemplates.getInstancesThroughObjectPropertyByLabel(instanceIri, objectPropertyIri, textSearch, rangeClassesIri, isDirect, customLimit)
        else
          queryCode = QueriesTemplates.getInstancesThroughObjectPropertyByIRI(instanceIri, objectPropertyIri, textSearch, rangeClassesIri, isDirect, customLimit)
      }

    } else {
      queryCode = QueriesTemplates.getInstancesThroughObjectProperty(instanceIri, objectPropertyIri, rangeClassesIri, isDirect, includeLabels, customLimit)
    }

    const queryPoller = await this.queryManager.performQuery(queryCode, this.pageSize, QuerySemantics.CQ, keepAlive)
    queryPoller.onNewResults = (result) => {
      onNewResults(
        result.results.map(res => this.getClassInstanceFromQueryResult(res, result.headTerms, result.headTypes)),
        queryPoller.numberResultsAvailable
      )
    }

    if (onStop) {
      queryPoller.onStop = onStop
    }

    queryPoller.start()
    return queryPoller.executionId
  }

  async instanceCheck(instanceIri: string, classesToCheck: string[], onResult: (resultClass: string[]) => void, onStop?: () => void) {
    const poller = await this.queryManager.instanceCheck(instanceIri, classesToCheck)

    poller.onNewResults = (result) => {
      if (result.resultClasses && result.state === QueryStatusEnum.FINISHED) {
        onResult(result.resultClasses.map(entity => entity.entityIRI))
      }
    }

    if (onStop) {
      poller.onStop = onStop
    }

    poller.start()
  }

  async getMaterializedCounts(endpoint: MastroEndpoint) {
    const url = new URL(`${this.requestOptions.basePath}/endpoint/${endpoint.name}/countEntityInstances/info`)
    return new Promise((resolve: (r: MaterializedCounts) => void, reject) => {
      fetch(url,
        {
          method: 'get',
          headers: this.requestOptions.headers
        }).then(async response => {
          if (response.status !== 200) {
            const result = await (response.json() || response.text())
            this.requestOptions.onError(result)
            reject(result)
          } else {
            const result = await response.json()
            result.countsMap = new Map(Object.entries(result.countsMap))
            resolve(result)
          }
        })
        .catch(error => {
          this.requestOptions.onError(error)
          reject(error)
        })
    })

  }

  stopAllQueries() {
    this.queryManager.stopRunningQueries()
  }

  stopCountsQueries() {
    this.queryManager.stopCountsQueries()
  }

  stopInstancesQueries() {
    this.queryManager.stopInstancesQueries()
  }

  setEndpoint(endpoint: MastroEndpoint) {
    this.queryManager = new QueryManager(this.requestOptions, endpoint)
  }

  async getInstanceLabels(instanceIri: string, onResult: (result: { value: string, language?: string }[]) => void) {
    const queryCode = QueriesTemplates.getInstanceLabels(instanceIri)

    const queryPoller = await this.queryManager.performQuery(queryCode, 100, QuerySemantics.CQ, true)
    queryPoller.onNewResults = (result) => {
      onResult(result.results.map(r => this.parseLabel(r[0].value)).filter(l => l.value !== 'null'))
    }

    queryPoller.start()
  }

  async getIntensionalShortestPath(sourceClassIri: string, targetClassIri: string, kShortest = false) {
    const params = new URLSearchParams({
      lastSelectedIRI: sourceClassIri,
      clickedIRI: targetClassIri,
      version: this.requestOptions.version
    })

    if (kShortest)
      params.append('kShortest', 'true')

    const url = new URL(`${this.requestOptions.basePath}/owlOntology/${this.requestOptions.name}/highlights/paths?${params.toString()}`)
    return (await (await handleApiCall(
      fetch(url, {
        method: 'get',
        headers: this.requestOptions.headers
      }),
      this.requestOptions.onError
    )).json())
  }

  async getExtensionalShortestPath(
    path: OntologyPath,
    onNewResult: (rdfGraph?: RDFGraph) => void,
    sourceInstanceIri?: string,
    targetInstanceIri?: string
    ) {
    const params = new URLSearchParams({
      labels: 'true',
      version: this.requestOptions.version
    })

    if (sourceInstanceIri) {
      params.append('sourceInstanceIRI', sourceInstanceIri)
    }

    if (targetInstanceIri) {
      params.append('targetInstanceIRI', targetInstanceIri)
    }

    const url = new URL(`${this.requestOptions.basePath}/owlOntology/${this.requestOptions.name}/instanceShortestPath?${params.toString()}`)
    const headers = this.requestOptions.headers

    // headers['content-type'] = 'text/plain'
    const queryCode = (await (await handleApiCall(
      fetch(url, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(path),
      }),
      this.requestOptions.onError
    )).text())

    if (queryCode && typeof queryCode === 'string') {
      this.queryManager.performQueryContrusct(queryCode)
        .then(rdfGraph => onNewResult(rdfGraph))
    }
  }

  shouldQueryUseLabels(executionId: string) {
    return this.queryManager.shouldQueryUseLabels(executionId)
  }

  private getClassInstanceFromQueryResult(results: ResultRecord, headTerms: string[], headTypes: { [x: string]: HeadTypes }): ClassInstance[] {
    let instance: ClassInstance
    const result: ClassInstance[] = []

    results.forEach((resultColumn, i) => {
      const columnType = getHeadType(headTerms[i])
      if (columnType === HeadTypes.OBJECT) {
        instance = {
          iri: decodeURI(resultColumn.value),
          shortIri: decodeURI(resultColumn.shortIRI),
        }

        let nextColumnType = getHeadType(headTerms[i + 1])
        let nextColumn = results[i + 1]
        // next column referes to this class instance only if it's a value
        if (headTerms[i + 1] && nextColumnType !== HeadTypes.OBJECT) {
          if (headTerms[i + 1] === `l${headTerms[i]}`) {
            const label = nextColumn.value ? this.parseLabel(nextColumn.value) : undefined
            instance.label = label?.value !== 'null' ? label : undefined
          } else {
            instance.searchMatch = nextColumn.value
          }

          // this is necessary only for the queries 14/15
          nextColumnType = getHeadType(headTerms[i + 2])
          nextColumn = results[i + 2]
          if (headTerms[i + 2] && nextColumnType !== HeadTypes.OBJECT && headTerms[i + 2] !== `?l${headTerms[i].charAt(1)}`) {
            instance.searchMatch = results[i + 2].value
          }
        }

        result.push(instance)
      }
    })

    return result

    function getHeadType(headTerm: string | undefined) {
      if (headTerm && headTypes[headTerm])
        return headTypes[headTerm][0]
    }
  }

  private parseLabel(labelWithLang: string) {
    let label: string[] | null | string = null
    let lang: string[] | null | string | undefined = undefined

    if (labelWithLang !== 'null') {
      const atIndex = labelWithLang.lastIndexOf('@')
      if (atIndex > 0) {
        lang = labelWithLang.substring(atIndex + 1)
        label = labelWithLang.substring(1, atIndex - 1)
      } else {
        label = labelWithLang
      }
    }

    return {
      value: label || 'null',
      language: lang || undefined
    }
  }
}

// Stubbed API
// export let vKGApiStub: IVirtualKnowledgeGraphApi = {
//   getInstances: (iri: string) => {
//     return [
//       {
//         iri: `http://obdm.obdasystems.com/book/1`,
//         label: 'Harry Potter',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/2`,
//         label: 'It',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/3`
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/4`,
//         label: 'Divina Commedia',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/5`,
//         label: 'Promessi Sposi',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/6`,
//         label: 'Songs Of My Nightmares',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/7`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/8`,
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/9`,
//         label: 'Losing The Sun',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/10`,
//         label: 'Sailing Into The Void',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/11`,
//         label: 'Calling Myself',
//       },
//       {
//         iri: `http://obdm.obdasystems.com/book/12`,
//         label: 'Bleeding At The Mountains',
//       },
//     ]
//   },
//   getInstancesNumber: function (iri: string, onResult) {
//     onResult(2)
//   },
//   // getObjectProperties: function (iri: string): Promise<Branch[]> {
//   //   throw new Error('Function not implemented.')
//   // }
// }